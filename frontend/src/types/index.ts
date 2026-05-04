export type Role = 'USER' | 'ORG_ADMIN' | 'SUPER_ADMIN';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface AuthResponse extends AuthUser {
  token: string;
}

export interface Organization {
  id: number;
  name: string;
  legalAddress: string;
  taxIdentificationNumber: string;
  primaryContact: string;
  description: string;
  isValidated: boolean;
}

export type Category = 'EDUCATION' | 'ENVIRONNEMENT' | 'SANTE' | 'URGENCE'; // Expand as needed

export interface ActionUpdate {
  id?: number;
  date: string; // The backend should return this formatted, e.g., "2026-04-22"
  message: string;
}

export interface CharityAction {
  id: number;
  title: string;
  description: string;
  longStory?: string; // For the rich text description
  updates?: ActionUpdate[]; // For the timeline
  organizationName?: string; // To display who is running it
  actionDate: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  category: Category;
  organizationId: number;
  mediaUrl?: string;
}

export interface Donation {
  id: number;
  amount: number;
  donationDate: string;
  status: string;
  firstName?: string; // Optional, assuming your backend includes the donor's name!
}

export interface UserDonation {
  id: number;
  amount: number;
  donationDate: string;
  status: string;
  actionTitle: string;
}

export interface AdminStats {
  totalOrganizations: number;
  pendingApprovals: number;
  totalCampaigns: number;
  totalRaised: number;
  totalUsers: number;
}

export interface PlatformUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ORG_ADMIN' | 'SUPER_ADMIN';
}

export interface OrgAdminStats {
  totalOrganizations: number;
  totalCampaigns: number;
  totalRaised: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number; // Spring's default for pageSize
  number: number; // Spring's default for pageNumber
  last: boolean; // Spring's default for isLast
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
