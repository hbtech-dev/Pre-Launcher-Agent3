"use client";
import { BadgeCheck } from "lucide-react";

export default function VerifiedBadge({ 
    size = "sm", 
    showText = false, 
    className = "",
    variant = "blue"
}) {
    const sizeClasses = {
        xs: "w-3.5 h-3.5",
        sm: "w-[18px] h-[18px]", 
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8"
    };

    const textSizeClasses = {
        xs: "text-xs",
        sm: "text-xs",
        md: "text-sm", 
        lg: "text-base",
        xl: "text-lg"
    };

    const fillVariantClasses = {
        blue: "fill-[#0095F6] text-white",
        white: "fill-white text-[#0095F6]",
        dark: "fill-gray-900 text-white"
    };
    
    const textVariantClasses = {
        blue: "text-[#0095F6]",
        white: "text-white",
        dark: "text-gray-900"
    };

    return (
        <span className={`inline-flex items-center gap-1 ${className}`} title="WhatsApp Verified Member">
            <BadgeCheck 
                className={`${sizeClasses[size]} ${fillVariantClasses[variant]}`}
                strokeWidth={2}
            />
            {showText && (
                <span className={`font-semibold tracking-wide ${textSizeClasses[size]} ${textVariantClasses[variant]}`}>
                    Verified
                </span>
            )}
        </span>
    );
}
