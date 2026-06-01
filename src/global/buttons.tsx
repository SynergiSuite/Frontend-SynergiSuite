"use client";
import React from "react";
import { Plus } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  className: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: "task" | "report" | "camera" | "add" | "none";
  type?: "button" | "submit" | "reset";
};

export function Button({
  children,
  onClick,
  variant = "none",
  className,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const showIcon = variant !== "none";

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap ${className}`}
    >
      {showIcon ? (
        <span className="inline-flex shrink-0 items-center justify-center">
          <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
        </span>
      ) : null}

      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}
