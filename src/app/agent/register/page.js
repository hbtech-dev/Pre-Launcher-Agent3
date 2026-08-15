"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { agentAPI } from "@/config/api";
import { secureStorage } from "@/utils/secureStorage";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import {
    Eye,
    EyeOff,
    ArrowLeft,
    UploadCloud,
    ShieldCheck,
    FileText,
    Building2,
    User,
    Briefcase,
    CheckCircle2,
    HelpCircle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const STEPS = [
    { id: 1, title: "Structure", desc: "Account credentials" },
    { id: 2, title: "Identity", desc: "CNIC & Tax compliance" },
    { id: 3, title: "Operations", desc: "Office & Agency info" },
    { id: 4, title: "Documents", desc: "KYC verification files" },
];

export default function AgentRegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");

    // Form state matching Agent.js individual & company fields
    const [form, setForm] = useState({
        // Step 1: Account Type & Credentials
        accountType: "individual", // 'individual' | 'business'
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",

        // Step 2: Personal Identification & Tax
        cnicNumber: "",
        dateOfBirth: "",
        sourceOfIncome: "Commission-based",
        ntn: "",

        // Step 3: Operations (Individual Specific)
        operatingCity: "Islamabad",
        yearsOfExperience: "3-5",
        brandName: "",
        permanentAddress: "",
        mailingAddress: "",

        // Step 3: Operations (Company Specific)
        companyName: "",
        legalForm: "Private Limited", // 'Sole Proprietorship' | 'Partnership' | 'Private Limited' | 'Public Limited'
        registrationNumber: "",
        officeAddress: "",
        landline: "",
        teamSize: "1-5",

        // Step 4: Documents Uploads
        cnicFront: null,
        cnicBack: null,
        faceImage: null,
        ntnCertificate: null,
        registrationCertificate: null,
    });

    const update = (field, val) => setForm((p) => ({ ...p, [field]: val }));

    const handleFile = (field, e) => {
        const file = e.target.files?.[0];
        if (file) {
            update(field, file.name);
            toast.success(`Uploaded ${file.name}`);
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        setError("");

        if (currentStep === 1) {
            if (form.password !== form.confirmPassword) {
                setError("Passwords do not match!");
                toast.error("Passwords do not match!");
                return;
            }
            if (form.password.length < 6) {
                setError("Password must be at least 6 characters!");
                toast.error("Password must be at least 6 characters!");
                return;
            }
        }

        if (currentStep === 2) {
            const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
            if (!cnicRegex.test(form.cnicNumber)) {
                setError("CNIC format must be xxxxx-xxxxxxx-x (e.g. 61101-1234567-1)");
                toast.error("CNIC format must be xxxxx-xxxxxxx-x");
                return;
            }
        }

        if (currentStep < 4) {
            setCurrentStep((s) => s + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");

        try {
            const isCompany = form.accountType === "business";

            // Prepare payload conforming exactly to Agent.js model
            const payload = {
                accountType: form.accountType,
                email: form.email,
                phone: form.phone,
                password: form.password,
                fullName: form.fullName,
                cnicNumber: form.cnicNumber,
                dateOfBirth: form.dateOfBirth,
                sourceOfIncome: form.sourceOfIncome,
                ntn: form.ntn,
                residentialAddress: {
                    permanent: form.permanentAddress || form.officeAddress || "Islamabad, Pakistan",
                    mailing: form.mailingAddress || form.officeAddress || "Islamabad, Pakistan"
                },
                businessInfo: {
                    hasBusinessEntity: isCompany,
                    businessName: isCompany ? form.companyName : (form.brandName || null),
                    legalForm: isCompany ? form.legalForm : "N/A",
                    registrationNumber: isCompany ? form.registrationNumber : null,
                    businessAddress: {
                        office: isCompany ? form.officeAddress : (form.mailingAddress || ""),
                        landline: isCompany ? form.landline : ""
                    }
                },
                location: form.operatingCity
            };

            const data = await agentAPI.register(payload);

            if (data.status === "success" || data.data?.token) {
                const agentData = data.data?.agent || data.agent || {
                    fullName: form.fullName,
                    name: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    cnicNumber: form.cnicNumber,
                    accountType: form.accountType,
                    agencyName: isCompany ? form.companyName : form.brandName,
                    operatingCity: form.operatingCity,
                    ntn: form.ntn,
                    legalForm: isCompany ? form.legalForm : undefined,
                    isVerifiedAgent: true
                };

                const token = data.data?.token || data.token || "agent_token";
                const refreshToken = data.data?.refreshToken || data.refreshToken || "";
                const agentId = agentData._id || agentData.id || "agent_id";

                secureStorage.setUserSession(token, refreshToken, agentId, "agent");
                secureStorage.setUserProfile(agentData);

                toast.success(`${isCompany ? "Company" : "Individual"} Agent KYC Submitted!`);
                setTimeout(() => {
                    router.push("/home");
                }, 400);
            } else {
                const msg = data.message || "Agent KYC registration failed. Please review information.";
                setError(msg);
                toast.error(msg);
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Agent register error:", err);
            const msg = err.message || "Failed to submit agent KYC. Please check information.";
            setError(msg);
            toast.error(msg);
            setIsLoading(false);
        }
    };

    const isCompany = form.accountType === "business";

    return (
        <PreLauncherLayout>
            <Toaster position="top-center" />
            <div className="flex-1 flex flex-col justify-center py-4">
                <Link
                    href="/welcome"
                    className="inline-flex items-center gap-1.5 text-sm mb-4"
                    style={{ color: "var(--pl-text-secondary)", textDecoration: "none" }}
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Roles
                </Link>

                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <h1 className="pl-heading">
                            {isCompany ? "🏢 Company / Agency KYC" : "👤 Individual Agent KYC"}
                        </h1>
                        <span className="pl-badge" style={{ background: "rgba(255, 137, 1, 0.12)", color: "#FF8901" }}>
                            Step {currentStep} of 4
                        </span>
                    </div>
                    <p className="pl-subtext">
                        {isCompany
                            ? "Register your corporate brokerage or real estate agency firm"
                            : "Register your individual agent / consultant legal profile"}
                    </p>
                </div>

                {/* Stepper */}
                <div className="pl-stepper">
                    <div className="pl-stepper-line" />
                    <div
                        className="pl-stepper-fill"
                        style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 90}%` }}
                    />
                    {STEPS.map((s) => (
                        <div
                            key={s.id}
                            className={`pl-step-item ${currentStep === s.id ? "active" : currentStep > s.id ? "done" : ""}`}
                        >
                            <div className="pl-step-dot">
                                {currentStep > s.id ? "✓" : s.id}
                            </div>
                            <span className="pl-step-label">{s.title}</span>
                        </div>
                    ))}
                </div>

                <div className="pl-glass-card">
                    {error && (
                        <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleNext}>
                        {/* STEP 1: Account Structure & Principal Info */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="pl-input-group">
                                    <label className="pl-label">Select Entity Classification</label>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <button
                                            type="button"
                                            className={`p-3.5 rounded-xl border text-left transition-all ${
                                                form.accountType === "individual"
                                                    ? "border-[#8C56FC] bg-[rgba(140,86,252,0.12)] text-[#8C56FC] shadow-sm"
                                                    : "border-[var(--pl-border-subtle)] text-[var(--pl-text-secondary)] opacity-80"
                                            }`}
                                            onClick={() => update("accountType", "individual")}
                                        >
                                            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm mb-0.5">
                                                <User className="w-4 h-4" /> Individual Agent
                                            </div>
                                            <p className="text-[11px] opacity-75">Solo broker / consultant</p>
                                        </button>

                                        <button
                                            type="button"
                                            className={`p-3.5 rounded-xl border text-left transition-all ${
                                                form.accountType === "business"
                                                    ? "border-[#8C56FC] bg-[rgba(140,86,252,0.12)] text-[#8C56FC] shadow-sm"
                                                    : "border-[var(--pl-border-subtle)] text-[var(--pl-text-secondary)] opacity-80"
                                            }`}
                                            onClick={() => update("accountType", "business")}
                                        >
                                            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm mb-0.5">
                                                <Building2 className="w-4 h-4" /> Company / Agency
                                            </div>
                                            <p className="text-[11px] opacity-75">Registered firm / agency</p>
                                        </button>
                                    </div>
                                </div>

                                <div className="pl-input-group">
                                    <label className="pl-label">
                                        {isCompany ? "Director / Principal Full Legal Name" : "Full Legal Name (as on CNIC)"}
                                    </label>
                                    <input
                                        type="text"
                                        className="pl-input"
                                        placeholder="e.g. Muhammad Aslam Tariq"
                                        value={form.fullName}
                                        onChange={(e) => update("fullName", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="pl-input-group">
                                        <label className="pl-label">Official Email</label>
                                        <input
                                            type="email"
                                            className="pl-input"
                                            placeholder={isCompany ? "info@agency.com" : "agent@domain.com"}
                                            value={form.email}
                                            onChange={(e) => update("email", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="pl-input-group">
                                        <label className="pl-label">Principal Mobile / WhatsApp</label>
                                        <input
                                            type="tel"
                                            className="pl-input"
                                            placeholder="0300-1234567"
                                            value={form.phone}
                                            onChange={(e) => update("phone", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="pl-input-group">
                                        <label className="pl-label">Create Password</label>
                                        <div className="pl-input-wrapper">
                                            <input
                                                type={showPw ? "text" : "password"}
                                                className="pl-input pl-input-with-icon"
                                                placeholder="Min 6 characters"
                                                value={form.password}
                                                onChange={(e) => update("password", e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                className="pl-icon-btn"
                                                onClick={() => setShowPw(!showPw)}
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pl-input-group">
                                        <label className="pl-label">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="pl-input"
                                            placeholder="Repeat password"
                                            value={form.confirmPassword}
                                            onChange={(e) => update("confirmPassword", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Identity & Tax Compliance */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div className="pl-input-group">
                                    <label className="pl-label">
                                        {isCompany ? "Director / Owner CNIC / NICOP" : "Personal CNIC / NICOP / POC"}
                                    </label>
                                    <input
                                        type="text"
                                        className="pl-input"
                                        placeholder="61101-1234567-1"
                                        value={form.cnicNumber}
                                        onChange={(e) => update("cnicNumber", e.target.value)}
                                        required
                                    />
                                    <span className="text-[11px] mt-1 block" style={{ color: "var(--pl-text-muted)" }}>
                                        Format: 5 digits - 7 digits - 1 digit (e.g. 61101-1234567-1)
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="pl-input-group">
                                        <label className="pl-label">Date of Birth</label>
                                        <input
                                            type="date"
                                            className="pl-input"
                                            value={form.dateOfBirth}
                                            onChange={(e) => update("dateOfBirth", e.target.value)}
                                            required
                                        />
                                        <span className="text-[10px] mt-0.5 block text-[var(--pl-text-muted)]">Must be 18+ years old</span>
                                    </div>

                                    <div className="pl-input-group">
                                        <label className="pl-label">
                                            {isCompany ? "Company NTN Number" : "Personal NTN Number"}
                                        </label>
                                        <input
                                            type="text"
                                            className="pl-input"
                                            placeholder="e.g. 1234567-8"
                                            value={form.ntn}
                                            onChange={(e) => update("ntn", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pl-input-group">
                                    <label className="pl-label">Primary Revenue Stream / Income Source</label>
                                    <select
                                        className="pl-input"
                                        value={form.sourceOfIncome}
                                        onChange={(e) => update("sourceOfIncome", e.target.value)}
                                        required
                                    >
                                        {isCompany ? (
                                            <>
                                                <option value="Business">Registered Real Estate Corporate Agency</option>
                                                <option value="Commission-based">Brokerage Commission & Consulting</option>
                                                <option value="Other">Other Business Entity</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Commission-based">Commission-based Real Estate Sales</option>
                                                <option value="Self-employed">Self-employed Consultant</option>
                                                <option value="Salaried">Salaried Brokerage Advisor</option>
                                                <option value="Business">Sole Proprietorship</option>
                                                <option value="Other">Other</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Operations & Office Details (DIVERGENT FOR INDIVIDUAL VS COMPANY) */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                {isCompany ? (
                                    /* COMPANY SPECIFIC FIELDS */
                                    <>
                                        <div className="pl-input-group">
                                            <label className="pl-label">Registered Business / Agency Name</label>
                                            <input
                                                type="text"
                                                className="pl-input"
                                                placeholder="e.g. Apex Real Estate & Builders Pvt Ltd"
                                                value={form.companyName}
                                                onChange={(e) => update("companyName", e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="pl-input-group">
                                                <label className="pl-label">Legal Form</label>
                                                <select
                                                    className="pl-input"
                                                    value={form.legalForm}
                                                    onChange={(e) => update("legalForm", e.target.value)}
                                                    required
                                                >
                                                    <option value="Private Limited">Private Limited (Pvt Ltd)</option>
                                                    <option value="Partnership">Partnership (AOP / Form-C)</option>
                                                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                                                    <option value="Public Limited">Public Limited</option>
                                                </select>
                                            </div>

                                            <div className="pl-input-group">
                                                <label className="pl-label">SECP / Registrar Reg. Number</label>
                                                <input
                                                    type="text"
                                                    className="pl-input"
                                                    placeholder="e.g. SECP-0192834"
                                                    value={form.registrationNumber}
                                                    onChange={(e) => update("registrationNumber", e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="pl-input-group">
                                                <label className="pl-label">Headquarter City</label>
                                                <select
                                                    className="pl-input"
                                                    value={form.operatingCity}
                                                    onChange={(e) => update("operatingCity", e.target.value)}
                                                    required
                                                >
                                                    <option value="Islamabad">Islamabad</option>
                                                    <option value="Rawalpindi">Rawalpindi</option>
                                                    <option value="Lahore">Lahore</option>
                                                    <option value="Karachi">Karachi</option>
                                                    <option value="Peshawar">Peshawar</option>
                                                    <option value="Multan">Multan</option>
                                                    <option value="Faisalabad">Faisalabad</option>
                                                </select>
                                            </div>

                                            <div className="pl-input-group">
                                                <label className="pl-label">Company Landline / UAN</label>
                                                <input
                                                    type="tel"
                                                    className="pl-input"
                                                    placeholder="051-2894567"
                                                    value={form.landline}
                                                    onChange={(e) => update("landline", e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="pl-input-group">
                                            <label className="pl-label">Commercial Office Plaza Address</label>
                                            <input
                                                type="text"
                                                className="pl-input"
                                                placeholder="e.g. Office #402, 4th Floor, Beverly Centre, Blue Area, Islamabad"
                                                value={form.officeAddress}
                                                onChange={(e) => update("officeAddress", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    /* INDIVIDUAL SPECIFIC FIELDS */
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="pl-input-group">
                                                <label className="pl-label">Primary Operating City</label>
                                                <select
                                                    className="pl-input"
                                                    value={form.operatingCity}
                                                    onChange={(e) => update("operatingCity", e.target.value)}
                                                    required
                                                >
                                                    <option value="Islamabad">Islamabad</option>
                                                    <option value="Rawalpindi">Rawalpindi</option>
                                                    <option value="Lahore">Lahore</option>
                                                    <option value="Karachi">Karachi</option>
                                                    <option value="Peshawar">Peshawar</option>
                                                    <option value="Multan">Multan</option>
                                                    <option value="Faisalabad">Faisalabad</option>
                                                </select>
                                            </div>

                                            <div className="pl-input-group">
                                                <label className="pl-label">Experience Level</label>
                                                <select
                                                    className="pl-input"
                                                    value={form.yearsOfExperience}
                                                    onChange={(e) => update("yearsOfExperience", e.target.value)}
                                                    required
                                                >
                                                    <option value="0-1">0–1 Year (Emerging)</option>
                                                    <option value="1-3">1–3 Years (Intermediate)</option>
                                                    <option value="3-5">3–5 Years (Senior)</option>
                                                    <option value="5-10">5–10 Years (Lead Consultant)</option>
                                                    <option value="10+">10+ Years (Master)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pl-input-group">
                                            <label className="pl-label">Brand / Agency Name (Optional)</label>
                                            <input
                                                type="text"
                                                className="pl-input"
                                                placeholder="e.g. Tariq Property Associates"
                                                value={form.brandName}
                                                onChange={(e) => update("brandName", e.target.value)}
                                            />
                                        </div>

                                        <div className="pl-input-group">
                                            <label className="pl-label">Permanent Residential Address</label>
                                            <input
                                                type="text"
                                                className="pl-input"
                                                placeholder="House / Street / Sector / City"
                                                value={form.permanentAddress}
                                                onChange={(e) => update("permanentAddress", e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="pl-input-group">
                                            <label className="pl-label">Mailing / Operating Address</label>
                                            <input
                                                type="text"
                                                className="pl-input"
                                                placeholder="Office / Plaza / Postal Address"
                                                value={form.mailingAddress}
                                                onChange={(e) => update("mailingAddress", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* STEP 4: KYC Verification Documents (DIVERGENT FOR INDIVIDUAL VS COMPANY) */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="pl-input-group">
                                        <label className="pl-label">
                                            {isCompany ? "Director CNIC Front Copy" : "CNIC Front Copy"}
                                        </label>
                                        <label className="pl-upload-box block">
                                            <UploadCloud className="w-6 h-6 mx-auto mb-1 text-[#8C56FC]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.cnicFront || "Upload CNIC Front"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">JPG or PNG (Max 5MB)</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFile("cnicFront", e)}
                                            />
                                        </label>
                                    </div>

                                    <div className="pl-input-group">
                                        <label className="pl-label">
                                            {isCompany ? "Director CNIC Back Copy" : "CNIC Back Copy"}
                                        </label>
                                        <label className="pl-upload-box block">
                                            <UploadCloud className="w-6 h-6 mx-auto mb-1 text-[#8C56FC]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.cnicBack || "Upload CNIC Back"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">JPG or PNG (Max 5MB)</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFile("cnicBack", e)}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="pl-input-group">
                                        <label className="pl-label">
                                            {isCompany ? "Director Live Selfie Photo" : "Face / Live Selfie Photo"}
                                        </label>
                                        <label className="pl-upload-box block">
                                            <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-[#FF8901]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.faceImage || "Upload Face Photo"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">Clear frontal photo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFile("faceImage", e)}
                                            />
                                        </label>
                                    </div>

                                    <div className="pl-input-group">
                                        <label className="pl-label">
                                            {isCompany ? "Company NTN Certificate" : "NTN / Tax Certificate"}
                                        </label>
                                        <label className="pl-upload-box block">
                                            <FileText className="w-6 h-6 mx-auto mb-1 text-[#FF8901]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.ntnCertificate || "Upload NTN Document"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">PDF or Image</span>
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                className="hidden"
                                                onChange={(e) => handleFile("ntnCertificate", e)}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {isCompany && (
                                    <div className="pl-input-group">
                                        <label className="pl-label">SECP / Incorporation / Form-C Certificate</label>
                                        <label className="pl-upload-box block">
                                            <Building2 className="w-6 h-6 mx-auto mb-1 text-[#8C56FC]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.registrationCertificate || "Upload Incorporation Certificate (SECP/Form-C)"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">Official Registration Document (PDF/JPG)</span>
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                className="hidden"
                                                onChange={(e) => handleFile("registrationCertificate", e)}
                                            />
                                        </label>
                                    </div>
                                )}

                                <div className="p-3 rounded-xl bg-[rgba(140,86,252,0.08)] border border-[rgba(140,86,252,0.2)] text-xs text-[var(--pl-text-secondary)]">
                                    🛡️ <strong>Compliance:</strong> All submitted {isCompany ? "corporate" : "personal"} credentials are encrypted and validated in accordance with Pakistani real estate regulatory standards.
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: "var(--pl-border-subtle)" }}>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    className="pl-btn pl-btn-outline flex-1"
                                    onClick={() => setCurrentStep((s) => s - 1)}
                                >
                                    ← Previous
                                </button>
                            )}

                            <button
                                type="submit"
                                className="pl-btn pl-btn-secondary flex-1"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Submitting KYC..."
                                    : currentStep === 4
                                    ? `Submit ${isCompany ? "Company" : "Individual"} KYC`
                                    : "Continue Step →"}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center mt-6 text-sm" style={{ color: "var(--pl-text-secondary)" }}>
                    Already submitted KYC?{" "}
                    <Link href="/agent/login" className="pl-link" style={{ color: "#FF8901" }}>
                        Agent Sign In
                    </Link>
                </p>
            </div>
        </PreLauncherLayout>
    );
}
