"use client"

import { useEffect, useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Role } from "./schemas/roles"
import { fetchRoles } from "./apis/getRoleApi"


type ActionsProps = {
  id: number;
  role: string;
  name: string;
  isFounderUser: boolean;
};

export function Actions({id, role, name, isFounderUser}: ActionsProps) {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [roleValue, setRoleValue] = useState(role)
  const [roles, setRoles] = useState<Role[]>([]);
  const isFounder = isFounderUser
  const normalizedEmployeeRole = role.trim().toLowerCase()
  const isRestrictedEmployee =
    !isFounder &&
    (normalizedEmployeeRole === "founder" || normalizedEmployeeRole === "manager")
  const baseRoles = isFounder
    ? roles
    : roles.filter((item) => {
        const roleName = item.name.toLowerCase()
        return roleName !== "founder" && roleName !== "manager"
      })
  const visibleRoles = isRestrictedEmployee
    ? [{ id: -1, name: role }, ...baseRoles.filter((item) => item.name !== role)]
    : baseRoles

  const handleDelete = () => {
    console.log("Delete user with ID:", id);
    // Add actual delete logic here
    setShowNewDialog(false);
  };

  useEffect(() => {
    if (showShareDialog) {
      setRoleValue(role)
    }
  }, [role, showShareDialog])

  useEffect(() => {
    const loadRoles = async() => {
          try {
            const rolesData = await fetchRoles();
            setRoles(rolesData);
          } catch (error) {
            console.error("Failed to load roles", error);
          }
        };
    loadRoles();
  }, [])

  const handleEditOpenChange = (open: boolean) => {
    setShowShareDialog(open)
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label="Open menu" size="icon-sm">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            {isFounderUser && (
              <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
                Delete
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={() => setShowShareDialog(true)}>
              Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>


      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={showShareDialog} onOpenChange={handleEditOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the role or select a manager.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                className="w-full border rounded-md px-3 py-2"
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="manager" className="block text-sm font-medium">
                Designation
              </label>
              <Select
                disabled={isRestrictedEmployee}
                value={roleValue || undefined}
                onValueChange={(value) => {
                  setRoleValue(value)
                }}
              >
                <SelectTrigger id="manager" className="w-full border_primary bg-white cursor-pointer">
                  <SelectValue placeholder="Select a manager" />
                </SelectTrigger>
                <SelectContent>
                  {visibleRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name} className="cursor-pointer">
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
