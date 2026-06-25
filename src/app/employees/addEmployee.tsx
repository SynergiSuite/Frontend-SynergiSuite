import { useEffect, useState, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/global/buttons";
import { AddEmployeeDialogProps } from "./schemas/addEmployee";
import { Role } from "./schemas/roles";
import { fetchRoles } from "./apis/getRoleApi";
import { inviteEmployee } from "./apis/addEmployeeApi";
import { gsap } from "gsap";

export default function AddEmployee({ isOpen, onClose }: AddEmployeeDialogProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role_id: 0,
    salary: "",
  });
  const modalShellRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isOpen && modalShellRef.current) {
      gsap.fromTo(
        modalShellRef.current,
        { opacity: 0, scale: 0.95, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  const handleCloseModal = () => {
    setError("");
    onClose();
    setFormData({ email: "", role_id: 0, salary: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" || name === "role_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim() || formData.role_id === 0 || !formData.salary.trim()) {
      setError("Please fill in all fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await inviteEmployee(formData);
      toast.success("Employee invited successfully!");
      onClose();
      setFormData({ email: "", role_id: 0, salary: "" });
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
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          onClick={handleCloseModal}
        />

        <div
          ref={modalShellRef}
          className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0a0826]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        >
          {/* Top thin accent bar */}
          <div className="absolute left-0 top-0 h-[2px] w-24 bg-gradient-to-r from-[#5271ff] to-transparent" />

          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-5 sm:px-8">
            <div>
              <h2 className="text-xl font-bold text-white">Add New Employee</h2>
              <p className="mt-1 text-xs text-white/40 leading-relaxed">
                Send invitation to new team members with their roles.
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
            {error ? (
              <Alert className="border border-red-500/20 bg-red-500/10 text-red-400 rounded-xl px-4 py-3">
                <Terminal className="h-4 w-4 text-red-400" />
                <AlertTitle className="text-red-400 font-semibold text-sm ml-2">OOPs!</AlertTitle>
                <AlertDescription className="mt-1 text-xs text-red-300 ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            ) : null}

            <p className="text-sm text-white/40 leading-relaxed">
              Make sure the invited person has an account with SynergiSuite. If
              they don&apos;t, they can sign up for a free trial. Once they&apos;ve signed
              up, they&apos;ll be able to access SynergiSuite and start collaborating
              with you.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Info */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.08em] text-white/50">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#5271ff]/50 focus:bg-white/[0.05] transition-all"
                />
              </div>

              {/* Employment Details */}
              <div className="space-y-2">
                <label htmlFor="role" className="block text-xs font-semibold uppercase tracking-[0.08em] text-white/50">
                  Role
                </label>
                <select
                  name="role_id"
                  id="role"
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0a0826] px-3.5 py-2 text-sm text-white outline-none focus:border-[#5271ff]/50 transition-all cursor-pointer"
                  value={formData.role_id}
                  onChange={handleChange}
                >
                  <option value="" className="bg-[#0a0826] text-white">Select role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id} className="bg-[#0a0826] text-white">
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Info */}
              <div className="space-y-2">
                <label htmlFor="salary" className="block text-xs font-semibold uppercase tracking-[0.08em] text-white/50">
                  Salary
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="text"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter annual or monthly salary"
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-[#5271ff]/50 focus:bg-white/[0.05] transition-all"
                />
              </div>

              {/* Footer / Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-white/[0.06] -mx-6 sm:-mx-8 px-6 sm:px-8 mt-6">
                <Button
                  className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
                  type="button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all ${
                    isSubmitting
                      ? "bg-gray-700/50 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-[#5271ff] to-[#3a4ec4] shadow-[0_0_16px_rgba(82,113,255,0.25)] hover:shadow-[0_0_24px_rgba(82,113,255,0.35)]"
                  }`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing...." : "Add Employee"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    ) : null
  );
}
