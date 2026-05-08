import { Client } from "../../schemas/client";
import { Team } from "../../schemas/team";
import { Task } from "../task/schemas/task";

export interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    client?: Client;
    tasks: Task[];
    teams: Team[];
    created_at: string;
    duration: string;
}
