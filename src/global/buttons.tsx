"use client";
import React from "react";
import Image from "next/image";
import PlusButtonLogo from "@/assets/plus-button-logo.svg";
import CameraLogo from "@/assets/camera-logo.svg";
import ReportLogo from "@/assets/report-logo.svg";
import TaskLogo from "@/assets/task-logo.svg";

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
  function getIcon(type: string) {
    if (type === "task") {
      return <Image src={TaskLogo} alt="Task" />;
    } else if (type === "report") {
      return <Image src={ReportLogo} alt="report" />;
    } else if (type === "camera") {
      return <Image src={CameraLogo} alt="Camera" />;
    } else if (type === "add") {
      return <Image src={PlusButtonLogo} alt="add" />;
    } 
  }
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={className}
    >
      {variant === "none" ? null : <div className="mb-0.5 px-2">{getIcon(variant)}</div>}

      <span>{children}</span>
    </button>
  );
}
