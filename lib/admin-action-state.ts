export type AdminActionState = {
  success: boolean;
  message: string;
};

export const initialAdminActionState: AdminActionState = {
  success: false,
  message: "",
};
