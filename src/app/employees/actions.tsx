"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CircleDollarSign,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { deleteEmployeeApi } from "./apis/deleteEmployeeApi";
import { editEmployeeApi, type EditEmployeePayload } from "./apis/editEmployeeApi";
import { fetchRoles } from "./apis/getRoleApi";
import type { Role } from "./schemas/roles";
import { CookieManager } from "@/lib/cookieManager";

type ActionsProps = {
  id: number;
  role: string;
  name: string;
  isFounderUser: boolean;
  onRefresh?: () => void;
};

const inputClassName =
  "h-12 w-full rounded-xl border border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm text-v2-neutral-600 outline-none transition-[border-color,box-shadow] placeholder:text-v2-neutral-300 hover:border-v2-neutral-400 focus:border-v2-neutral-500 focus:ring-[3px] focus:ring-v2-neutral-400/20 disabled:cursor-not-allowed disabled:bg-v2-neutral-200 disabled:text-v2-neutral-400";

export function Actions({
  id,
  role,
  name,
  isFounderUser,
  onRefresh,
}: ActionsProps) {
  const currentUserId = CookieManager("get", "user-id");
  const isSelf = currentUserId ? String(id) === String(currentUserId) : false;

  const deleteDialogRef = useRef<HTMLDivElement>(null);
  const editDialogRef = useRef<HTMLDivElement>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [roleValue, setRoleValue] = useState(role);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [salaryValue, setSalaryValue] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isSelf) {
    return null;
  }

  const normalizedEmployeeRole = role.trim().toLowerCase();
  const isRestrictedEmployee =
    !isFounderUser &&
    (normalizedEmployeeRole === "founder" || normalizedEmployeeRole === "manager");

  const baseRoles = (
    isFounderUser
      ? roles
      : roles.filter((item) => {
          const name = item.name.trim().toLowerCase();
          return name !== "founder" && name !== "manager";
        })
  ).filter((item) => !item.name.toLowerCase().includes("client"));

  const visibleRoles = isRestrictedEmployee
    ? [
        { id: -1, name: role },
        ...baseRoles.filter(
          (item) => item.name.toLowerCase() !== role.toLowerCase(),
        ),
      ]
    : baseRoles;

  useEffect(() => {
    fetchRoles().then(setRoles).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!editOpen) {
      return;
    }

    setRoleValue(role);
    setSalaryValue("");
    const currentRole = roles.find(
      (item) => item.name.toLowerCase() === role.trim().toLowerCase(),
    );
    setSelectedRoleId(currentRole?.id ?? null);
  }, [editOpen, role, roles]);

  useLayoutEffect(() => {
    const dialog = deleteOpen
      ? deleteDialogRef.current
      : editOpen
        ? editDialogRef.current
        : null;

    if (!dialog || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from("[data-employee-dialog-section]", {
        autoAlpha: 0,
        y: 8,
        duration: 0.3,
        stagger: 0.05,
        ease: "power3.out",
      });
    }, dialog);

    return () => context.revert();
  }, [deleteOpen, editOpen]);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await deleteEmployeeApi(id);
      toast.success(response?.message || "Employee removed from the workspace.");
      setDeleteOpen(false);
      onRefresh?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The employee could not be removed.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async () => {
    const payload: EditEmployeePayload = {};
    const activeRoleId =
      selectedRoleId && selectedRoleId > 0
        ? selectedRoleId
        : roles.find((item) => item.name.toLowerCase() === roleValue.toLowerCase())?.id;

    if (activeRoleId) {
      payload.roleId = activeRoleId;
    }

    if (salaryValue.trim()) {
      payload.salary = salaryValue.trim();
    }

    if (!payload.roleId && !payload.salary) {
      toast.warning("Select a role or enter a salary to update.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await editEmployeeApi(id, payload);
      toast.success(response?.message || "Employee updated successfully.");
      setEditOpen(false);
      onRefresh?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The employee could not be updated.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label={`Actions for ${name}`}>
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-52">
          <DropdownMenuLabel>Employee actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setEditOpen(true)} className="py-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-v2-neutral-200 text-v2-neutral-500">
                <Pencil className="size-4" aria-hidden="true" />
              </span>
              Edit employee
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)} className="py-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-destructive/10 text-destructive">
                <Trash2 className="size-4" aria-hidden="true" />
              </span>
              Remove employee
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent
          ref={deleteDialogRef}
          className="border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-[0_24px_80px_rgba(53,53,54,0.22)] sm:max-w-md"
        >
          <DialogHeader data-employee-dialog-section className="border-v2-neutral-200">
            <DialogTitle className="text-xl tracking-[-0.03em] text-v2-neutral-600">Remove employee</DialogTitle>
            <DialogDescription className="leading-5 text-v2-neutral-400">
              This removes their access to the current business workspace.
            </DialogDescription>
          </DialogHeader>
          <div data-employee-dialog-section className="px-6 py-5 sm:px-8">
            <Card variant="subtle" size="sm">
              <CardContent className="text-sm leading-6 text-v2-neutral-500">
                Remove <span className="font-semibold text-v2-neutral-600">{name}</span>? This action cannot be undone from this screen.
              </CardContent>
            </Card>
          </div>
          <DialogFooter data-employee-dialog-section className="border-v2-neutral-200">
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Trash2 aria-hidden="true" />}
              {isDeleting ? "Removing..." : "Remove employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          ref={editDialogRef}
          className="border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-[0_24px_80px_rgba(53,53,54,0.22)] sm:max-w-lg"
        >
          <DialogHeader data-employee-dialog-section className="border-v2-neutral-200">
            <DialogTitle className="text-xl tracking-[-0.03em] text-v2-neutral-600">Edit employee</DialogTitle>
            <DialogDescription className="leading-5 text-v2-neutral-400">
              Update the workspace role or salary for this employee.
            </DialogDescription>
          </DialogHeader>
          <div data-employee-dialog-section className="px-6 py-6 sm:px-8">
            <FieldGroup className="gap-5">
              <Field data-disabled="true">
                <FieldLabel htmlFor={`employee-name-${id}`}>Employee</FieldLabel>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v2-neutral-400" aria-hidden="true" />
                  <input id={`employee-name-${id}`} value={name} readOnly disabled className={`${inputClassName} pl-11`} />
                </div>
              </Field>

              <Field data-disabled={isRestrictedEmployee}>
                <FieldLabel htmlFor={`employee-role-${id}`}>Workspace role</FieldLabel>
                <Select
                  disabled={isRestrictedEmployee}
                  value={selectedRoleId ? String(selectedRoleId) : ""}
                  onValueChange={(value) => {
                    const nextId = Number(value);
                    setSelectedRoleId(nextId);
                    const selected = roles.find((item) => item.id === nextId);
                    if (selected) setRoleValue(selected.name);
                  }}
                >
                  <SelectTrigger id={`employee-role-${id}`} className="h-12 w-full rounded-xl border-v2-neutral-300 bg-v2-neutral-100 px-4 text-sm shadow-none hover:border-v2-neutral-400 focus-visible:border-v2-neutral-500 focus-visible:ring-v2-neutral-400/20">
                    <span className="flex items-center gap-2.5"><Shield className="size-4 text-v2-neutral-400" aria-hidden="true" /><SelectValue placeholder="Select a role" /></span>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-v2-neutral-200 bg-v2-neutral-100 text-v2-neutral-600 shadow-xl">
                    {visibleRoles.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)} className="rounded-lg focus:bg-v2-neutral-200/70 focus:text-v2-neutral-600">{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isRestrictedEmployee && <FieldDescription>Only founders can change founder or manager roles.</FieldDescription>}
              </Field>

              <Field>
                <FieldLabel htmlFor={`employee-salary-${id}`}>Salary</FieldLabel>
                <div className="relative">
                  <CircleDollarSign className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-v2-neutral-400" aria-hidden="true" />
                  <input
                    id={`employee-salary-${id}`}
                    type="number"
                    min={0}
                    max={1000000}
                    step="any"
                    placeholder="Enter a new salary (optional)"
                    value={salaryValue}
                    onChange={(event) => setSalaryValue(event.target.value)}
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter data-employee-dialog-section className="border-v2-neutral-200">
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Pencil aria-hidden="true" />}
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
