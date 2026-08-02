import { UIEmployee } from "./employee";

type RoleData = {
  name?: string;
};

type BusinessData = {
  name?: string;
};

export type EmployeeApiRecord = {
  user_id?: number;
  name?: string;
  role?: RoleData;
  business?: BusinessData;
  isExpired?: boolean;
};

export type PaginationMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type Response = {
  data?: EmployeeApiRecord[];
  meta?: PaginationMeta;
  statistics?: {
    registrationCount?: number;
    newProjectsThisMonth?: number;
    projectCount?: number;
  };
  employees?: EmployeeApiRecord[] | { employees?: EmployeeApiRecord[] };
  registrationCount?: number;
  newProjectsThisMonth?: number;
  projectCount?: number;
};

export type Stats = {
  totalEmployees: number;
  totalNewReg: number;
  totalNewProj: number;
  totalProjects: number;
  activeEmployees: number;
};

export type MainPageData = {
  employees: UIEmployee[];
  stats: Stats;
  meta: PaginationMeta;
};
