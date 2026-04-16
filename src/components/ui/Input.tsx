"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-300"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-4 py-3 border rounded-xl text-white placeholder-gray-500 bg-navy-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent ${
          error ? "border-red-400 bg-red-900/20" : "border-gold/20"
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
