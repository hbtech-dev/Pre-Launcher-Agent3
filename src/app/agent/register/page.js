"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { agentAPI } from "@/config/api";
import { secureStorage } from "@/utils/secureStorage";
import PreLauncherLayout from "@/components/PreLauncherLayout";
import {
    Eye, EyeOff, ArrowLeft, UploadCloud, ShieldCheck, FileText,
    Building2, User, CheckCircle2, Sparkles, Clock, ArrowRight
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const STEPS = [
    { id: 1, title: "Structure", desc: "Account credentials" },
    { id: 2, title: "Identity", desc: "CNIC & Tax compliance" },
    { id: 3, title: "Operations", desc: "Office & Agency info" },
    { id: 4, title: "Documents", desc: "KYC verification files" },
];

// Auto-format CNIC: xxxxx-xxxxxxx-x
function formatCNIC(val) {
    const digits = val.replace(/\D/g, "").slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

// Auto-format phone: 0xxx-xxxxxxx
function formatPhone(val) {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export default function AgentRegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedSummary, setSubmittedSummary] = useState({ name: "", email: "", accountType: "individual" });

    // File refs to store actual File objects
    const fileRefs = useRef({
        cnicFront: null,
        cnicBack: null,
        faceImage: null,
        ntnCertificate: null,
        registrationCertificate: null,
    });

    // Form state matching Agent.js model
    const [form, setForm] = useState({
        accountType: "individual",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",

        cnicNumber: "",
        dateOfBirth: "",
        sourceOfIncome: "Commission-based",
        ntn: "",

        // Individual
        operatingCity: "Islamabad",
        yearsOfExperience: "3-5",
        brandName: "",
        permanentAddress: "",
        mailingAddress: "",

        // Company
        companyName: "",
        legalForm: "Private Limited",
        registrationNumber: "",
        officeAddress: "",
        landline: "",

        // File display names
        cnicFrontName: "",
        cnicBackName: "",
        faceImageName: "",
        ntnCertificateName: "",
        registrationCertificateName: "",
    });

    const update = (field, val) => setForm((p) => ({ ...p, [field]: val }));

    const handleCNIC = (e) => {
        update("cnicNumber", formatCNIC(e.target.value));
    };

    const handlePhone = (e) => {
        update("phone", formatPhone(e.target.value));
    };

    const handleFile = (field, e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be under 5MB");
                return;
            }
            fileRefs.current[field] = file;
            update(`${field}Name`, file.name);
            toast.success(`${file.name} selected`);
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        setError("");

        if (currentStep === 1) {
            if (!form.fullName || !form.email || !form.phone) {
                setError("Please fill all required fields.");
                return;
            }
            if (form.password !== form.confirmPassword) {
                setError("Passwords do not match!");
                toast.error("Passwords do not match!");
                return;
            }
            if (form.password.length < 6) {
                setError("Password must be at least 6 characters!");
                return;
            }
        }

        if (currentStep === 2) {
            const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
            if (!cnicRegex.test(form.cnicNumber)) {
                setError("CNIC format must be xxxxx-xxxxxxx-x");
                toast.error("Invalid CNIC format");
                return;
            }
            if (!form.dateOfBirth || !form.ntn) {
                setError("Please fill all required fields.");
                return;
            }
        }

        if (currentStep === 3) {
            const isCompany = form.accountType === "business";
            if (isCompany && (!form.companyName || !form.registrationNumber || !form.officeAddress)) {
                setError("Please fill all company details.");
                return;
            }
            if (!isCompany && (!form.permanentAddress || !form.mailingAddress)) {
                setError("Please fill address fields.");
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
        // Validate required files
        if (!fileRefs.current.cnicFront || !fileRefs.current.cnicBack || !fileRefs.current.faceImage) {
            setError("Please upload CNIC front, back, and face photo.");
            toast.error("Required documents missing!");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const isCompany = form.accountType === "business";

            // Build FormData exactly matching backend agentKYCRegister controller
            const fd = new FormData();

            // Basic credentials
            fd.append("email", form.email.trim().toLowerCase());
            fd.append("password", form.password);
            fd.append("phone", form.phone);

            // Personal Information
            fd.append("fullName", form.fullName);
            fd.append("cnicNumber", form.cnicNumber);
            fd.append("dateOfBirth", form.dateOfBirth);
            fd.append("sourceOfIncome", form.sourceOfIncome);
            fd.append("ntn", form.ntn);

            // Account Type
            fd.append("accountType", form.accountType);

            // residentialAddress — backend uses JSON.parse() on this
            fd.append("residentialAddress", JSON.stringify({
                permanent: isCompany ? (form.officeAddress || "Islamabad, Pakistan") : form.permanentAddress,
                mailing: isCompany ? (form.officeAddress || "Islamabad, Pakistan") : form.mailingAddress,
            }));

            // Business Information
            fd.append("hasBusinessEntity", isCompany ? "true" : "false");
            if (isCompany) {
                fd.append("businessName", form.companyName);
                fd.append("legalForm", form.legalForm);
                fd.append("registrationNumber", form.registrationNumber);
                fd.append("businessAddress", JSON.stringify({
                    office: form.officeAddress,
                    landline: form.landline,
                }));
            } else {
                fd.append("businessName", form.brandName || "");
                fd.append("legalForm", "N/A");
            }

            // File uploads (actual File objects)
            fd.append("cnicFront", fileRefs.current.cnicFront);
            fd.append("cnicBack", fileRefs.current.cnicBack);
            fd.append("faceImage", fileRefs.current.faceImage);
            if (fileRefs.current.ntnCertificate) {
                fd.append("ntnCertificate", fileRefs.current.ntnCertificate);
            }
            if (fileRefs.current.registrationCertificate) {
                fd.append("registrationCertificate", fileRefs.current.registrationCertificate);
            }

            const data = await agentAPI.register(fd);

            if (data.status === "success") {
                const agentData = data.data?.agent || {};
                const token = data.data?.token || "";
                const refreshToken = data.data?.refreshToken || "";
                const agentId = agentData._id || agentData.id || "";

                if (token) {
                    secureStorage.setUserSession(token, refreshToken, agentId, "agent");
                    secureStorage.setUserProfile(agentData);
                }

                setSubmittedSummary({
                    name: isCompany ? form.companyName : form.fullName,
                    email: form.email,
                    accountType: form.accountType,
                });
                setIsSubmitted(true);
                setIsLoading(false);
                toast.success("KYC application submitted successfully!");
            } else {
                const msg = data.message || "KYC registration failed. Please review your information.";
                setError(msg);
                toast.error(msg);
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Agent register error:", err);
            const msg = err.message || "Failed to submit KYC. Please try again.";
            setError(msg);
            toast.error(msg);
            setIsLoading(false);
        }
    };

    const isCompany = form.accountType === "business";

    // ── Celebration & Success Screen ──
    if (isSubmitted) {
        return (
            <PreLauncherLayout>
                <Toaster position="top-center" />
                <div className="flex-1 flex flex-col justify-center py-6 text-center animate-fadeIn">
                    {/* Glowing Celebration Icon */}
                    <div className="pl-success-ring">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>

                    <div className="inline-block mb-3">
                        <span className="pl-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                            <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Application Received
                        </span>
                    </div>

                    <h1 className="pl-heading text-2xl sm:text-3xl mb-2">
                        Welcome to the <span style={{ color: "#8C56FC" }}>Agent3</span> Family!
                    </h1>
                    <p className="pl-subtext max-w-md mx-auto mb-6 text-sm">
                        Thank you for registering with Agent3. We are thrilled to have you join Pakistan&apos;s most advanced real estate network!
                    </p>

                    {/* Review Status Card */}
                    <div className="pl-glass-card text-left max-w-lg mx-auto w-full mb-6">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: "var(--pl-border-subtle)" }}>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#FF8901]" />
                                <span className="font-semibold text-xs sm:text-sm text-[var(--pl-text-primary)]">
                                    Application Status
                                </span>
                            </div>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255, 137, 1, 0.15)", color: "#FF8901" }}>
                                ⏳ Under Review
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="pl-info-row">
                                <span className="text-[var(--pl-text-muted)]">Applicant Name</span>
                                <span className="font-medium text-[var(--pl-text-primary)]">{submittedSummary.name || form.fullName}</span>
                            </div>
                            <div className="pl-info-row">
                                <span className="text-[var(--pl-text-muted)]">Entity Type</span>
                                <span className="font-medium text-[var(--pl-text-primary)]">
                                    {submittedSummary.accountType === "business" ? "Company / Real Estate Agency" : "Individual Real Estate Agent"}
                                </span>
                            </div>
                            <div className="pl-info-row">
                                <span className="text-[var(--pl-text-muted)]">Registered Email</span>
                                <span className="font-medium text-[var(--pl-text-primary)]">{submittedSummary.email || form.email}</span>
                            </div>
                            <div className="pl-info-row">
                                <span className="text-[var(--pl-text-muted)]">Estimated Review</span>
                                <span className="font-medium text-emerald-400">24 – 48 Hours</span>
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-xl bg-[rgba(140,86,252,0.08)] border border-[rgba(140,86,252,0.18)] text-xs text-[var(--pl-text-secondary)]">
                            <p className="flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#8C56FC] flex-shrink-0 mt-0.5" />
                                <span>
                                    Our compliance team is currently reviewing your CNIC, tax, and registration credentials. You will receive an email confirmation once approved.
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto w-full">
                        <Link href="/agent/login" className="flex-1" style={{ textDecoration: "none" }}>
                            <button type="button" className="pl-btn pl-btn-secondary w-full">
                                Agent Login Portal <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </Link>
                        <Link href="/welcome" className="flex-1" style={{ textDecoration: "none" }}>
                            <button type="button" className="pl-btn pl-btn-outline w-full">
                                Back to Welcome
                            </button>
                        </Link>
                    </div>

                    <p className="mt-6 text-xs" style={{ color: "var(--pl-text-muted)" }}>
                        Need urgent assistance? Contact compliance at <span style={{ color: "var(--pl-accent-primary)" }}>compliance@agent3.pk</span>
                    </p>
                </div>
            </PreLauncherLayout>
        );
    }

    return (
        <PreLauncherLayout>
            <Toaster position="top-center" />
            <div className="flex-1 flex flex-col justify-center py-4">
                <Link
                    href="/agent/login"
                    className="inline-flex items-center gap-1.5 text-sm mb-4"
                    style={{ color: "var(--pl-text-secondary)", textDecoration: "none" }}
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </Link>

                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <h1 className="pl-heading">
                            {isCompany ? "🏢 Company KYC" : "👤 Agent KYC"}
                        </h1>
                        <span className="pl-badge" style={{ background: "rgba(255, 137, 1, 0.12)", color: "#FF8901" }}>
                            Step {currentStep}/4
                        </span>
                    </div>
                    <p className="pl-subtext">
                        {isCompany
                            ? "Register your agency or firm"
                            : "Register as an individual agent"}
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
                                {currentStep > s.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
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
                        {/* ── STEP 1: Account Type & Credentials ── */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div className="pl-input-group">
                                    <label className="pl-label">Account Type</label>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <button
                                            type="button"
                                            className={`pl-type-card ${form.accountType === "individual" ? "selected" : ""}`}
                                            onClick={() => update("accountType", "individual")}
                                        >
                                            <User className="w-5 h-5" />
                                            <span className="font-semibold text-xs">Individual</span>
                                        </button>
                                        <button
                                            type="button"
                                            className={`pl-type-card ${form.accountType === "business" ? "selected" : ""}`}
                                            onClick={() => update("accountType", "business")}
                                        >
                                            <Building2 className="w-5 h-5" />
                                            <span className="font-semibold text-xs">Company</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pl-input-group">
                                    <label className="pl-label">
                                        {isCompany ? "Director Full Name" : "Full Name (as on CNIC)"}
                                    </label>
                                    <input
                                        type="text"
                                        className="pl-input"
                                        placeholder="Muhammad Aslam"
                                        value={form.fullName}
                                        onChange={(e) => update("fullName", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="pl-input-group">
                                        <label className="pl-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="pl-input"
                                            placeholder={isCompany ? "info@agency.com" : "name@email.com"}
                                            value={form.email}
                                            onChange={(e) => update("email", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="pl-input-group">
                                        <label className="pl-label">WhatsApp / Mobile</label>
                                        <input
                                            type="tel"
                                            className="pl-input"
                                            placeholder="0300-1234567"
                                            value={form.phone}
                                            onChange={handlePhone}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="pl-input-group">
                                        <label className="pl-label">Password</label>
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
                                            <button type="button" className="pl-icon-btn" onClick={() => setShowPw(!showPw)}>
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

                        {/* ── STEP 2: Identity & Tax ── */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div className="pl-input-group">
                                    <label className="pl-label">
                                        {isCompany ? "Director CNIC Number" : "CNIC / NICOP Number"}
                                    </label>
                                    <input
                                        type="text"
                                        className="pl-input font-mono tracking-wide"
                                        placeholder="61101-1234567-1"
                                        value={form.cnicNumber}
                                        onChange={handleCNIC}
                                        maxLength={15}
                                        required
                                    />
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
                                        <span className="text-[10px] mt-0.5 block text-[var(--pl-text-muted)]">Must be 18+</span>
                                    </div>
                                    <div className="pl-input-group">
                                        <label className="pl-label">
                                            {isCompany ? "Company NTN" : "NTN Number"}
                                        </label>
                                        <input
                                            type="text"
                                            className="pl-input"
                                            placeholder="1234567-8"
                                            value={form.ntn}
                                            onChange={(e) => update("ntn", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pl-input-group">
                                    <label className="pl-label">Source of Income</label>
                                    <select
                                        className="pl-input"
                                        value={form.sourceOfIncome}
                                        onChange={(e) => update("sourceOfIncome", e.target.value)}
                                        required
                                    >
                                        {isCompany ? (
                                            <>
                                                <option value="Business">Registered Agency</option>
                                                <option value="Commission-based">Brokerage Commission</option>
                                                <option value="Other">Other</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="Commission-based">Commission-based</option>
                                                <option value="Self-employed">Self-employed</option>
                                                <option value="Salaried">Salaried</option>
                                                <option value="Business">Business</option>
                                                <option value="Other">Other</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: Operations ── */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                {isCompany ? (
                                    <>
                                        <div className="pl-input-group">
                                            <label className="pl-label">Registered Business Name</label>
                                            <input
                                                type="text"
                                                className="pl-input"
                                                placeholder="Apex Real Estate Pvt Ltd"
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
                                                    <option value="Private Limited">Private Limited</option>
                                                    <option value="Partnership">Partnership</option>
                                                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                                                    <option value="Public Limited">Public Limited</option>
                                                </select>
                                            </div>
                                            <div className="pl-input-group">
                                                <label className="pl-label">SECP / Reg. Number</label>
                                                <input
                                                    type="text"
                                                    className="pl-input"
                                                    placeholder="SECP-0192834"
                                                    value={form.registrationNumber}
                                                    onChange={(e) => update("registrationNumber", e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="pl-input-group">
                                                <label className="pl-label">City</label>
                                                <select className="pl-input" value={form.operatingCity} onChange={(e) => update("operatingCity", e.target.value)}>
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
                                                <label className="pl-label">Landline / UAN</label>
                                                <input
                                                    type="tel"
                                                    className="pl-input"
                                                    placeholder="051-2894567"
                                                    value={form.landline}
                                                    onChange={(e) => update("landline", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="pl-input-group">
                                            <label className="pl-label">Office Address</label>
                                            <input
                                                type="text"
                                                className="pl-input"
                                                placeholder="Office #402, Beverly Centre, Blue Area, Islamabad"
                                                value={form.officeAddress}
                                                onChange={(e) => update("officeAddress", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="pl-input-group">
                                                <label className="pl-label">Operating City</label>
                                                <select className="pl-input" value={form.operatingCity} onChange={(e) => update("operatingCity", e.target.value)}>
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
                                                <label className="pl-label">Experience</label>
                                                <select className="pl-input" value={form.yearsOfExperience} onChange={(e) => update("yearsOfExperience", e.target.value)}>
                                                    <option value="0-1">0–1 Year</option>
                                                    <option value="1-3">1–3 Years</option>
                                                    <option value="3-5">3–5 Years</option>
                                                    <option value="5-10">5–10 Years</option>
                                                    <option value="10+">10+ Years</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="pl-input-group">
                                            <label className="pl-label">Brand / Agency Name <span className="text-[var(--pl-text-muted)]">(Optional)</span></label>
                                            <input
                                                type="text"
                                                className="pl-input"
                                                placeholder="Tariq Property Associates"
                                                value={form.brandName}
                                                onChange={(e) => update("brandName", e.target.value)}
                                            />
                                        </div>
                                        <div className="pl-input-group">
                                            <label className="pl-label">Permanent Address</label>
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
                                            <label className="pl-label">Mailing Address</label>
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

                        {/* ── STEP 4: Documents ── */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="pl-input-group">
                                        <label className="pl-label">CNIC Front *</label>
                                        <label className={`pl-upload-box block ${form.cnicFrontName ? "uploaded" : ""}`}>
                                            <UploadCloud className="w-5 h-5 mx-auto mb-1 text-[#8C56FC]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.cnicFrontName || "Upload CNIC Front"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">JPG/PNG (Max 5MB)</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile("cnicFront", e)} />
                                        </label>
                                    </div>
                                    <div className="pl-input-group">
                                        <label className="pl-label">CNIC Back *</label>
                                        <label className={`pl-upload-box block ${form.cnicBackName ? "uploaded" : ""}`}>
                                            <UploadCloud className="w-5 h-5 mx-auto mb-1 text-[#8C56FC]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.cnicBackName || "Upload CNIC Back"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">JPG/PNG (Max 5MB)</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile("cnicBack", e)} />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="pl-input-group">
                                        <label className="pl-label">Face / Selfie Photo *</label>
                                        <label className={`pl-upload-box block ${form.faceImageName ? "uploaded" : ""}`}>
                                            <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-[#FF8901]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.faceImageName || "Upload Face Photo"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">Clear frontal photo</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile("faceImage", e)} />
                                        </label>
                                    </div>
                                    <div className="pl-input-group">
                                        <label className="pl-label">NTN Certificate</label>
                                        <label className={`pl-upload-box block ${form.ntnCertificateName ? "uploaded" : ""}`}>
                                            <FileText className="w-5 h-5 mx-auto mb-1 text-[#FF8901]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.ntnCertificateName || "Upload NTN (Optional)"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">PDF or Image</span>
                                            <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile("ntnCertificate", e)} />
                                        </label>
                                    </div>
                                </div>

                                {isCompany && (
                                    <div className="pl-input-group">
                                        <label className="pl-label">SECP / Incorporation Certificate</label>
                                        <label className={`pl-upload-box block ${form.registrationCertificateName ? "uploaded" : ""}`}>
                                            <Building2 className="w-5 h-5 mx-auto mb-1 text-[#8C56FC]" />
                                            <span className="text-xs font-medium block text-[var(--pl-text-primary)]">
                                                {form.registrationCertificateName || "Upload Certificate"}
                                            </span>
                                            <span className="text-[10px] text-[var(--pl-text-muted)]">PDF or Image</span>
                                            <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile("registrationCertificate", e)} />
                                        </label>
                                    </div>
                                )}

                                <div className="p-2.5 rounded-lg bg-[rgba(140,86,252,0.06)] border border-[rgba(140,86,252,0.15)] text-[11px] text-[var(--pl-text-muted)]">
                                    🛡️ All your documents are secured and encrypted.
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-5 pt-4 border-t" style={{ borderColor: "var(--pl-border-subtle)" }}>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    className="pl-btn pl-btn-outline flex-1"
                                    onClick={() => setCurrentStep((s) => s - 1)}
                                >
                                    ← Back
                                </button>
                            )}
                            <button
                                type="submit"
                                className="pl-btn pl-btn-secondary flex-1"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? "Submitting..."
                                    : currentStep === 4
                                    ? "Submit KYC"
                                    : "Continue →"}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center mt-5 text-sm" style={{ color: "var(--pl-text-secondary)" }}>
                    <Link href="/agent/login" className="pl-link" style={{ color: "#FF8901" }}>
                        Sign In
                    </Link>
                </p>
            </div>
        </PreLauncherLayout>
    );
}
