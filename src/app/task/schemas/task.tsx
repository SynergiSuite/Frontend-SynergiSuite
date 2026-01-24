import { Team } from "@/app/projects/schemas/team";

export type Task = {
 id: string,
 priority: string,
 status: string,
 title: string,
 description: string,
 teams: Team[],
 due_date: string,
 createdAt: string,
 updatedAt: string,
   
}