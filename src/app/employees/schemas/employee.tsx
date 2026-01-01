export type UIEmployee = {
  id: number;
  name: string;
  role: string;
  department: string;
  status: "Active" | "Inactive";
}

export type Employee = {
  id: number;
  name: string;
  role: string;
  department: string;
  status: string;
};