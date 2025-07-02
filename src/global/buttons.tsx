"use client";
import React from "react";
import PlusButtonLogo from "@/assets/plus-button-logo.svg";
import CameraLogo from "@/assets/camera-logo.svg";
import ReportLogo from "@/assets/report-logo.svg";
import TaskLogo from "@/assets/task-logo.svg"

type ButtonProps = {
    children: React.ReactNode;
    className: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    type?: string
}

export function Button({children, onClick, type = 'add', className, disabled = false}: ButtonProps){
    function variant(type:string) {
        if (type === 'task') {
            return TaskLogo
        } else if (type === 'report'){
            return ReportLogo
        } else if (type === 'camera'){
            return CameraLogo
        } else {
            return PlusButtonLogo
        }
    }
    return (
        <button onClick={onClick} disabled={disabled} className={className}>
            <div>
                <img src="{variant(type)}" alt="Logo buttons" />
            </div>

            <span>{children}</span>
        </button>
    )
}