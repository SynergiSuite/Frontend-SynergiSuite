export enum ClientPriority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export const CLIENT_PRIORITY_OPTIONS = [
  { label: "High", value: ClientPriority.HIGH },
  { label: "Medium", value: ClientPriority.MEDIUM },
  { label: "Low", value: ClientPriority.LOW },
];
