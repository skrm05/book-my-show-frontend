import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 text-sm text-neutral-300 font-medium">
        {label}
      </label>
      <input
        className={`px-4 py-2 rounded bg-brand-dark border focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-500 focus:ring-red-500/50"
            : "border-neutral-700 focus:border-brand-crimson focus:ring-brand-crimson/30"
        } text-white placeholder-neutral-500 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};
