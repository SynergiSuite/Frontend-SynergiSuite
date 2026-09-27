"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontalIcon, Pencil, Shield, Trash2, UserRound, X, DollarSign } from "lucide-react";
import { gsap } from "gsap";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "./schemas/roles";
import { fetchRoles } from "./apis/getRoleApi";
import { editEmployeeApi, EditEmployeePayload } from "./apis/editEmployeeApi";
import { deleteEmployeeApi } from "./apis/deleteEmployeeApi";

type ActionsProps = {
  id: number;
  role: string;
  name: string;
  isFounderUser: boolean;
  onRefresh?: () => void;
};

export function Actions({ id, role, name, isFounderUser, onRefresh }: ActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [roleValue, setRoleValue] = useState(role);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [salaryValue, setSalaryValue] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const deleteDialogRef = useRef<HTMLDivElement | null>(null);
  const editDialogRef = useRef<HTMLDivElement | null>(null);

  const isFounder = isFounderUser;
  const normalizedEmployeeRole = role.trim().toLowerCase();
  const isRestrictedEmployee =
    !isFounder &&
    (normalizedEmployeeRole === "founder" || normalizedEmployeeRole === "manager");

  const baseRoles = (
    isFounder
      ? roles
      : roles.filter((item) => {
          const roleName = item.name.trim().toLowerCase();
          return roleName !== "founder" && roleName !== "manager";
        })
  ).filter((item) => !item.name.toLowerCase().includes("client"));

  const visibleRoles = (
    isRestrictedEmployee
      ? [{ id: -1, name: role }, ...baseRoles.filter((item) => item.name.toLowerCase() !== role.toLowerCase())]
      : baseRoles
  ).filter((item) => !item.name.toLowerCase().includes("client"));

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteEmployeeApi(id);
      toast.success(res?.message || "Employee removed from business successfully.");
      setShowNewDialog(false);
      onRefresh?.();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast.error(error?.message || "Failed to remove employee.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const rolesData = await fetchRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Failed to load roles", error);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    if (showShareDialog) {
      setRoleValue(role);
      setSalaryValue("");
      if (roles.length > 0) {
        const found = roles.find(
          (r) => r.name.toLowerCase() === role.trim().toLowerCase()
        );
        if (found) {
          setSelectedRoleId(found.id);
        } else {
          setSelectedRoleId(null);
        }
      }
    }
  }, [role, showShareDialog, roles]);

  const handleEditOpenChange = (open: boolean) => {
    setShowShareDialog(open);
  };

  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);
      const payload: EditEmployeePayload = {};

      const activeRoleId =
        selectedRoleId && selectedRoleId > 0
          ? selectedRoleId
          : roles.find((r) => r.name.toLowerCase() === roleValue.toLowerCase())?.id;

      if (activeRoleId) {
        payload.roleId = activeRoleId;
      }

      if (salaryValue.trim() !== "") {
        payload.salary = salaryValue.trim();
      }

      if (!payload.roleId && !payload.salary) {
        toast.warning("Please select a valid role or enter a salary to update.");
        setIsSaving(false);
        return;
      }

      const res = await editEmployeeApi(id, payload);
      toast.success(res?.message || "Employee updated successfully.");
      setShowShareDialog(false);
      onRefresh?.();
    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast.error(error?.message || "Failed to update employee.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;

    const items = menuRef.current.querySelectorAll("[data-employee-action-item]");
    gsap.fromTo(
      items,
      { opacity: 0, y: -6, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.22,
        ease: "power2.out",
        stagger: 0.04,
      }
    );
  }, [menuOpen]);

  useEffect(() => {
    const activeDialog = showNewDialog
      ? deleteDialogRef.current
      : showShareDialog
      ? editDialogRef.current
      : null;
    if (!activeDialog) return;

    const sections = activeDialog.querySelectorAll("[data-action-dialog-section]");
    gsap.fromTo(
      sections,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.32,
        ease: "power3.out",
        stagger: 0.06,
      }
    );
  }, [showNewDialog, showShareDialog]);

  const animateTrigger = (scale: number, y: number) => {
    if (!triggerRef.current) return;
    gsap.to(triggerRef.current, {
      scale,
      y,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <>
      <DropdownMenu modal={false} open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            variant="ghost"
            aria-label="Open employee actions"
            size="icon-sm"
            className="rounded-full border border-white/[0.08] bg-white/[0.03] text-white/55 shadow-[0_0_0_rgba(82,113,255,0)] transition-colors hover:border-[#5271ff]/50 hover:bg-[#5271ff]/10 hover:text-white hover:shadow-[0_0_18px_rgba(82,113,255,0.22)] focus-visible:border-[#5271ff]/60 focus-visible:ring-[#5271ff]/25"
            onMouseEnter={() => animateTrigger(1.06, -1)}
            onMouseLeave={() => animateTrigger(1, 0)}
            onFocus={() => animateTrigger(1.06, -1)}
            onBlur={() => animateTrigger(1, 0)}
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          ref={menuRef}
          className="w-52"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              data-employee-action-item
              variant="destructive"
              onSelect={() => setShowNewDialog(true)}
              className="py-2.5"
            >
              <span className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
                <Trash2 className="h-4 w-4" />
              </span>
              <span className="font-medium">Delete user</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              data-employee-action-item
              onSelect={() => setShowShareDialog(true)}
              className="py-2.5"
            >
              <span className="flex size-8 items-center justify-center rounded-lg border border-v2-neutral-200 bg-v2-neutral-200/60 text-v2-neutral-500">
                <Pencil className="h-4 w-4" />
              </span>
              <span className="font-medium">Edit employee</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent
          ref={deleteDialogRef}
          showCloseButton={false}
          className="border border-white/[0.08] bg-[#0a0826]/95 text-white shadow-[0_24px_80px_rgba(3,1,20,0.55)] backdrop-blur-xl sm:max-w-[425px]"
        >
          <DialogHeader className="border-b border-white/[0.08] px-6 py-6 sm:px-8" data-action-dialog-section>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-semibold text-white">Delete user</DialogTitle>
                <DialogDescription className="mt-2 text-sm text-white/45">
                  Are you sure you want to delete this user?
                </DialogDescription>
              </div>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close delete user dialog"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/45 transition hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="px-6 py-5 sm:px-8" data-action-dialog-section>
            <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-4 text-sm text-red-100/80">
              This action is permanent for <span className="font-semibold text-red-100">{name}</span>.
            </div>
          </div>
          <DialogFooter className="border-t border-white/[0.08] px-6 py-4 sm:px-8" data-action-dialog-section>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-red-500/85 text-white shadow-[0_0_18px_rgba(239,68,68,0.24)] hover:bg-red-500 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showShareDialog} onOpenChange={handleEditOpenChange}>
        <DialogContent
          ref={editDialogRef}
          showCloseButton={false}
          className="border border-white/[0.08] bg-[#0a0826]/95 text-white shadow-[0_24px_80px_rgba(3,1,20,0.55)] backdrop-blur-xl sm:max-w-[460px]"
        >
          <DialogHeader className="border-b border-white/[0.08] px-6 py-6 sm:px-8" data-action-dialog-section>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-semibold text-white">Edit Employee</DialogTitle>
                <DialogDescription className="mt-2 text-sm text-white/45">Update designation or salary details.</DialogDescription>
              </div>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close edit user dialog"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/45 transition hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="px-6 pb-3 pt-5 sm:px-8" data-action-dialog-section>
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor={`employee-name-${id}`} className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                  Name
                </label>
                <div className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5">
                  <UserRound className="h-4 w-4 text-[#8fa2ff]" />
                  <input
                    id={`employee-name-${id}`}
                    name="name"
                    type="text"
                    value={name}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor={`employee-role-${id}`} className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                  Designation
                </label>
                <Select
                  disabled={isRestrictedEmployee}
                  value={selectedRoleId ? String(selectedRoleId) : ""}
                  onValueChange={(value) => {
                    const numId = Number(value);
                    setSelectedRoleId(numId);
                    const found = roles.find((r) => r.id === numId);
                    if (found) {
                      setRoleValue(found.name);
                    }
                  }}
                >
                  <SelectTrigger
                    id={`employee-role-${id}`}
                    className="h-12 w-full cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-white transition hover:border-[#5271ff]/35 focus:ring-[#5271ff]/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-[#8fa2ff]" />
                      <SelectValue placeholder="Select a role" />
                    </span>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-white/[0.08] bg-[#0a0826] text-white shadow-[0_18px_50px_rgba(3,1,20,0.45)]">
                    {visibleRoles.map((r) => (
                      <SelectItem key={r.id} value={String(r.id)} className="cursor-pointer rounded-lg focus:bg-[#5271ff]/12 focus:text-white">
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isRestrictedEmployee && (
                  <p className="text-xs text-white/35">Only founders can update founder or manager roles.</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor={`employee-salary-${id}`} className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                  Salary
                </label>
                <div className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 transition focus-within:border-[#5271ff]/50">
                  <DollarSign className="h-4 w-4 text-[#8fa2ff]" />
                  <input
                    id={`employee-salary-${id}`}
                    name="salary"
                    type="text"
                    placeholder="Enter salary (optional)"
                    value={salaryValue}
                    onChange={(e) => setSalaryValue(e.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-white placeholder-white/20 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-white/[0.08] px-6 py-4 sm:px-8" data-action-dialog-section>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="rounded-xl bg-[#5271ff] text-white shadow-[0_0_18px_rgba(82,113,255,0.24)] hover:bg-[#6380ff] disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
