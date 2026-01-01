import { User } from "./user";

export type Team = {
    id: string;
    name: string;
    description?: string;
    leader: User 
}