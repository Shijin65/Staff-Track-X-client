export type UserRow = {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  attachment?: {
    picId: string;
  };
};

export type ApiUser = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  updatedAt: string;
  attachment?: {
    picId: string;
  };
};

export interface UserData {
  id: string;
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  isVerified: boolean;
  emergencyContact?: string;
  address?: string; // Permanent Address
  currentAddress?: string;
  permanentAddress?: string;
  city?: string;
  district?: string;
  state?: string;
  experience?: number;
  rating?: number;
  gender?: string;
  bloodGroup?: string;
  profileUpdated?: boolean;
  dateOfBirth?: string;
  dateOfJoining?: string;
  role?: string;
  whiteShirt: boolean;
  blackPant: boolean;
  executiveBlackShoe: boolean;
  grooming: boolean;
  profilePhoto?: string;
  totalEvents?: number;
  successRate?: number;
  recentEvents?: Array<{
    id: string;
    name: string;
    date: string;
    rating: number;
    comment: string;
  }>;
  permissions?: Array<{
    name: string;
    is_access: boolean;
  }>;
  attachment?: {
    attachmentId: string;
    picId: string;
    fileName: string;
    contentType?: string;
    fileExtension?: string;
  };
}