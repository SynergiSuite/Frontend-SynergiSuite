export enum DocumentLabel {
  PERSONAL = 1,
  TEAM = 2,
  PROJECT = 3,
  CLIENT = 4,
  OTHER = 5,
}

export const ALL_DOCUMENT_LABEL_OPTIONS = [
  { label: "Personal", value: DocumentLabel.PERSONAL },
  { label: "Team", value: DocumentLabel.TEAM },
  { label: "Project", value: DocumentLabel.PROJECT },
  { label: "Client", value: DocumentLabel.CLIENT },
  { label: "Other", value: DocumentLabel.OTHER },
];

export const CLIENT_DOCUMENT_LABEL_OPTIONS = [
  { label: "Project", value: DocumentLabel.PROJECT },
  { label: "Client", value: DocumentLabel.CLIENT },
];

export const DOCUMENT_LABEL_OPTIONS = ALL_DOCUMENT_LABEL_OPTIONS;
