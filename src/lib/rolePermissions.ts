const milestoneManagerRoles = [
  "manager",
  "founder",
] as const;
const taskDeleteRoles = [
  "manager",
  "founder",
] as const;

export const normalizeRole = (role?: string | null) =>
  role?.trim().toLowerCase() ?? "";

export const canManageMilestones = (role?: string | null) =>
  milestoneManagerRoles.includes(
    normalizeRole(role) as (typeof milestoneManagerRoles)[number]
  );

export const canManageTeams = (role?: string | null) =>
  milestoneManagerRoles.includes(
    normalizeRole(role) as (typeof milestoneManagerRoles)[number]
  );

export const canDeleteTasks = (role?: string | null) =>
  taskDeleteRoles.includes(
    normalizeRole(role) as (typeof taskDeleteRoles)[number]
  );
