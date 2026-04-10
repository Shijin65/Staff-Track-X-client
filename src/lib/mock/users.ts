"use client";

export interface UserData {
  id: string;
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  verification: string;
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
}

export const initialUsers: UserData[] = [
  {
    id: "uuid-1",
    roleId: 1002,
    role: "Senior Captain",
    firstName: "Devi",
    lastName: "Kumar",
    mobileNumber: "9876543210",
    emergencyContact: "9123456780",
    email: "devi.kumar@example.com",
    isActive: true,
    gender: "Female",
    rating: 4.5,
    totalEvents: 124,
    successRate: 98,
    verification: "Verified",
    dateOfBirth: "5th March, 1996",
    dateOfJoining: "12th June, 2021",
    bloodGroup: "B+",
    state: "Tamil Nadu",
    district: "Chennai",
    city: "Chennai",
    permanentAddress: "12, Anna Nagar Main Road, Chennai, Tamil Nadu",
    currentAddress: "12, Anna Nagar Main Road, Chennai, Tamil Nadu",
    profilePhoto: "https://i.pravatar.cc/150?u=uuid-1",
    recentEvents: [
      { id: 'ev-1', name: 'Grand Wedding Catering', date: '2026-03-20', rating: 5, comment: 'Excellent performance' },
      { id: 'ev-2', name: 'Corporate Gala Dinner', date: '2026-02-15', rating: 4, comment: 'Good team work' }
    ]
  },
  {
    id: "uuid-2",
    roleId: 1003,
    role: "Staff Member",
    firstName: "John",
    lastName: "Doe",
    mobileNumber: "9123456781",
    emergencyContact: "9876543211",
    email: "john.doe@example.com",
    isActive: false,
    gender: "Male",
    rating: 4.0,
    totalEvents: 45,
    successRate: 92,
    verification: "Pending",
    dateOfBirth: "12th Jan, 1990",
    dateOfJoining: "01-01-2022",
    bloodGroup: "O+",
    state: "Maharashtra",
    district: "Mumbai",
    city: "Mumbai",
    permanentAddress: "45, Marine Drive, Mumbai",
    currentAddress: "45, Marine Drive, Mumbai",
    recentEvents: [
      { id: 'ev-3', name: 'Alumni Meet 2026', date: '2026-01-10', rating: 4, comment: 'Handled pressure well' }
    ]
  }
];
