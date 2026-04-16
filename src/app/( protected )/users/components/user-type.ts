export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  verification: boolean;
};

export type ApiUser = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  verification: boolean;
  updatedAt: string;
};
