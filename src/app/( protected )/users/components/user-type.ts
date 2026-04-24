export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
};

export type ApiUser = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  updatedAt: string;
};
