"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { X } from "lucide-react";
import { Button } from "@/global/buttons";
import { getCookie } from "cookies-next";
import { Loader } from "@/components/ui/loader";
import { is } from "zod/v4/locales";

type AddEmployeeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface Role {
  id: number;
  name: string;
}

export default function AddEmployeeDialog({
  isOpen,
  onClose,
}: AddEmployeeDialogProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role_id: 0,
  });

  useEffect(() => {
    const getRoles = async () => {
      try {
        const token = await getCookie("access_token");
        const response = await fetch("http://localhost:3002/roles/get-all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data: Role[] = await response.json();
        setRoles(data);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };
    getRoles();
  }, []);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formData.role_id);

    if (!formData.email.trim() || formData.role_id === 0) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getCookie("access_token");
      const response = await fetch("http://localhost:3002/business/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      onClose();
      setFormData({ email: "", role_id: 0 });
      alert("Employee added successfully!");
    } catch (err) {
      console.error("Error adding employee:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">Add New Employee</h2>
            <p className="text-sm text-muted-foreground">
              Send invitation to new team members with their roles.
            </p>
          </div>
          <button
            onClick={() => {
              setError("");
              onClose();
              setFormData({ email: "", role_id: 0 });
            }}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-2 py-4">
          {error ? (
            <Alert variant="destructive" className="border-red-400">
              <Terminal />
              <AlertTitle>OOPs!</AlertTitle>
              <AlertDescription>
                <p className="text-red-600 text-sm">{error}</p>
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <div className="px-6">
          <p className="text-sm text-muted-foreground">
            Make sure the invited person has an account with SynergiSuite. If
            they don't, they can sign up for a free trial. Once they've signed
            up, they'll be able to access SynergiSuite and start collaborating
            with you. Once they've signed up, they'll be able to access
            SynergiSuite and start collaborating with you.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          {/* Personal Info */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Employment Details */}
          <div className="space-y-1">
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <select
              name="role_id"
              id="role"
              className="w-full border_primary h-11 px-2"
              value={formData.role_id}
              onChange={handleChange}
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              className="text-gray-800"
              type="button"
              onClick={() => {
                setError("");
                onClose();
                setFormData({ email: "", role_id: 0 });
              }}
            >
              Cancel
            </Button>
            <Button
              className={
                isSubmitting
                  ? "button_primary_lg bg-gray-500 text-black"
                  : "button_primary_lg"
              }
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing...." : "Add Employee"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
