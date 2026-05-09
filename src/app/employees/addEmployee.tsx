import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/global/buttons";
import { AddEmployeeDialogProps } from "./schemas/addEmployee";
import { Role } from "./schemas/roles";
import { fetchRoles } from "./apis/getRoleApi";
import { inviteEmployee } from "./apis/addEmployeeApi";
import {
  modalBodyClass,
  modalCloseButtonClass,
  modalFooterClass,
  modalHeaderClass,
  modalOverlayClass,
  modalShellClass,
  modalSubtitleClass,
  modalTitleClass,
} from "@/lib/modalStyles";


export default function AddEmployee({ isOpen, onClose }: AddEmployeeDialogProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role_id: 0,
  });

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
  }, []);

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

    if (!formData.email.trim() || formData.role_id === 0) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await inviteEmployee(formData);
      toast.success("Employee invited successfully!");
      onClose();
      setFormData({ email: "", role_id: 0 });
    } catch (err) {
      toast.error("Failed to invite employee");
      console.error("Error inviting employee:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close add employee modal"
        className={modalOverlayClass}
        onClick={() => {
          setError("");
          onClose();
          setFormData({ email: "", role_id: 0 });
        }}
      />
      <div className={`${modalShellClass} max-w-3xl`}>
        {/* Header */}
        <div className={`${modalHeaderClass} flex items-start justify-between gap-4`}>
          <div>
            <h2 className={modalTitleClass}>Add New Employee</h2>
            <p className={modalSubtitleClass}>
              Send invitation to new team members with their roles.
            </p>
          </div>
          <button
            onClick={() => {
              setError("");
              onClose();
              setFormData({ email: "", role_id: 0 });
            }}
            className={modalCloseButtonClass}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pt-4 sm:px-8">
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

        <div className="px-6 sm:px-8">
          <p className="text-sm text-muted-foreground">
            Make sure the invited person has an account with SynergiSuite. If
            they don&apos;t, they can sign up for a free trial. Once they&apos;ve signed
            up, they&apos;ll be able to access SynergiSuite and start collaborating
            with you. Once they&apos;ve signed up, they&apos;ll be able to access
            SynergiSuite and start collaborating with you.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`${modalBodyClass} space-y-6`}
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
          <div className={`${modalFooterClass} -mx-6 -mb-6 mt-4 flex justify-end space-x-3 pt-4 sm:-mx-8 sm:-mb-6`}>
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
    ) : null
  );
}
