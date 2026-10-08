export type AddEmployeeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded?: () => void;
};

export type InviteEmployeePayload = {
  email: string;
  role_id: number;
  salary: string;
};
