"use client";
import React from "react";

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
};

export function Select({ value, onValueChange, children, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm 
        ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
        placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed 
        disabled:opacity-50 ${className || ""}`}
    >
      {children}
    </select>
  );
}

type SelectTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  return (
    <div
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input 
        bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground 
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
    >
      {children}
    </div>
  );
}

type SelectValueProps = {
  placeholder: string;
};

export function SelectValue({ placeholder }: SelectValueProps) {
  return <span className="text-muted-foreground">{placeholder}</span>;
}

type SelectContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function SelectContent({ children, className }: SelectContentProps) {
  return (
    <div
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover 
        text-popover-foreground shadow-md animate-in fade-in-80 ${className || ""}`}
    >
      <div className="p-1">{children}</div>
    </div>
  );
}

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

export function SelectItem({ value, children }: SelectItemProps) {
  return (
    <option
      value={value}
      className="relative flex w-full cursor-default select-none items-center rounded-sm 
        py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground 
        data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      {children}
    </option>
  );
}
