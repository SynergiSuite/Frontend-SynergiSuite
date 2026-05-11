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
      className={className}
    >
      {showIcon ? (
        <div className="mb-0.5 px-2">
          <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
        </div>
      ) : null}

      <span>{children}</span>
    </button>
  );
}
