export type AddEmployeeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type InviteEmployeePayload = {
  email: string;
  role_id: number;
};