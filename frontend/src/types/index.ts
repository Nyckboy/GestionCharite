export type Role = 'USER' | 'ORG_ADMIN' | 'SUPER_ADMIN';

export interface AuthUser {
  firstName: string;
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

export interface CharityAction {
  id: number;
  title: string;
  description: string;
  actionDate: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  category: Category;
  organizationId: number;
}

export interface Donation {
  id: number;
  amount: number;
  donationDate: string;
  status: string;
  firstName?: string; // Optional, assuming your backend includes the donor's name!
}