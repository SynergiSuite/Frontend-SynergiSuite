export type Employee = {
    user_id: number;
    name: string;
    email: string;
    user?: any
}

export type Team = {
    name: string;
    description: string;
    members: number[];
    leader_id: number;
}

export type Teams = {
    id: string
    name: string;
    description: string;
    members: Employee[];
    leader_id: number;
    leader?: any;
}

export type editTeamsForm = {
    id: string
    name: string;
    description: string;
    members: any;
    leader_id: any;
}