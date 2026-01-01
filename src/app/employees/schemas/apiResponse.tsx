
import { UIEmployee } from "./employee";

export type Response = {
    employees?: any;
    registrationCount?: number;
    newProjectsThisMonth?: number;
    projectCount?: number;
}

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
};