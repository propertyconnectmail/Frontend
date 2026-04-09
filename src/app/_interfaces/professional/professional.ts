export interface Professional {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  nic: string;
  googleId?: string;
  phone: string;
  type: string;
  address: string;
  province: string;       // Added
  district?: string;      // Added
  dob: string;
  url: string;
  status: string;
  consultationFee: string;
  certifications: string[];
  identityImage?: string;
  rejectionReason?: string;
  rejectedAt?: Date | null;
  bankAccountDetails?: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
  };
  rating?: {
    clientEmail: string;
    clientName: string;
    rating: string;
    message: string;
    date: string;
  }[];
}