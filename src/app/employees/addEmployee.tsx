"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { CircleDollarSign, LoaderCircle, Mail, UserPlus } from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { inviteEmployee } from "./apis/addEmployeeApi";
import { fetchRoles } from "./apis/getRoleApi";
import type { AddEmployeeDialogProps } from "./schemas/addEmployee";
import type { Role } from "./schemas/roles";

const inputClassName =
  "h-12 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/15";

export default function AddEmployee({
  isOpen,
  onClose,
  onEmployeeAdded,
}: AddEmployeeDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role_id: 0,
    salary: "",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;
    setIsLoadingRoles(true);

    fetchRoles()
      .then((result) => {
        if (!cancelled) {
          setRoles(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Roles could not be loaded. Close this dialog and try again.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingRoles(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (
      !isOpen ||
      !contentRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-invite-section]", {
        autoAlpha: 0,
        y: 10,
        duration: 0.35,
        stagger: 0.055,
        ease: "power3.out",
      });
    }, contentRef);

    return () => context.revert();
  }, [isOpen]);

  const closeDialog = () => {
    setError(null);
    setFormData({ email: "", role_id: 0, salary: "" });
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.email.trim() || !formData.role_id || !formData.salary.trim()) {
      setError("Complete all fields before sending the invitation.");
      return;
    }

    setIsSubmitting(true);

    try {
      await inviteEmployee(formData);
      toast.success("Employee invitation sent.");
      onEmployeeAdded?.();
      closeDialog();
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "The invitation could not be sent.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRoles = roles.filter(
    (role) => !role.name.trim().toLowerCase().includes("client"),
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent
        ref={contentRef}
        className="border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-[0_24px_80px_rgba(53,53,54,0.22)] sm:max-w-xl"
      >
        <DialogHeader data-invite-section className="border-v2-neutral-200">
          <div className="flex items-start gap-3 pr-12">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-v2-neutral-500 text-v2-neutral-100">
              <UserPlus className="size-4" aria-hidden="true" />
            </span>
            <div>
              <DialogTitle className="text-xl tracking-[-0.03em] text-v2-neutral-600">
                Invite an employee
              </DialogTitle>
              <DialogDescription className="mt-1.5 leading-5 text-v2-neutral-400">
                Assign their initial role and salary before sending workspace access.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div data-invite-section className="px-6 py-6 sm:px-8">
            {error && (
              <FieldError className="mb-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                {error}
              </FieldError>
            )}

            <Card variant="subtle" size="sm" className="mb-6">
              <CardContent className="text-sm leading-6 text-v2-neutral-400">
                The employee will receive an invitation and can access the workspace after creating their account.
              </CardContent>
            </Card>

            <FieldGroup className="gap-5">
              <Field data-invalid={Boolean(error && !formData.email.trim())}>
                <FieldLabel htmlFor="employee-email">Email address</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v2-neutral-400" aria-hidden="true" />
                  <input
                    id="employee-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => {
                      setFormData((current) => ({ ...current, email: event.target.value }));
                      setError(null);
                    }}
                    placeholder="name@company.com"
                    className={`${inputClassName} pl-11`}
                    autoComplete="email"
                    required
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="employee-role">Workspace role</FieldLabel>
                <Select
                  value={formData.role_id ? String(formData.role_id) : ""}
                  onValueChange={(value) => {
                    setFormData((current) => ({ ...current, role_id: Number(value) }));
                    setError(null);
                  }}
                  disabled={isLoadingRoles}
                >
                  <SelectTrigger
                    id="employee-role"
                    className="h-12 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20"
                  >
                    {isLoadingRoles && <LoaderCircle className="size-4 animate-spin text-v2-neutral-400" aria-hidden="true" />}
                    <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "Select a role"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                    {filteredRoles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)} className="rounded-lg focus:bg-v2-neutral-200/70 focus:text-v2-neutral-600">
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>This controls their initial workspace permissions.</FieldDescription>
              </Field>

              <Field data-invalid={Boolean(error && !formData.salary.trim())}>
                <FieldLabel htmlFor="employee-salary">Salary</FieldLabel>
                <div className="relative">
                  <CircleDollarSign className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v2-neutral-400" aria-hidden="true" />
                  <input
                    id="employee-salary"
                    name="salary"
                    type="number"
                    min={0}
                    max={1000000}
                    step="any"
                    value={formData.salary}
                    onChange={(event) => {
                      setFormData((current) => ({ ...current, salary: event.target.value }));
                      setError(null);
                    }}
                    placeholder="Enter salary amount"
                    className={`${inputClassName} pl-11`}
                    inputMode="decimal"
                    required
                  />
                </div>
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter data-invite-section className="border-v2-neutral-200">
            <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || isLoadingRoles}>
              {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
              {isSubmitting ? "Sending invitation..." : "Send invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
