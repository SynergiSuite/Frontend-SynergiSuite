import { Client } from "./client";
import { Team } from "./team";

export type Projects = {
    id: string;
    name: string;
    description?: string;
    status: number;
    tasks: [];
    teams: Team[];
    client: Client
}