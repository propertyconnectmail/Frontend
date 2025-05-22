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
    dob: string;
    url: string;
    status: string;
    consultationFee: string;
    certifications: string[];
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
  

// this.form = this.fb.group({
//     firstName: ['', [Validators.required]],
//     lastName: ['', [Validators.required]],
//     email: ['', [Validators.required, Validators.email]],
//     password: [''],
//     nic: ['', [Validators.required]],
//     googleId: [''],
//     phone: ['', [Validators.required]],
//     type: ['',Validators.required],
//     address: ['', [Validators.required]],
//     dobMonth: ['', [Validators.required]],
//     dobDay: ['', [Validators.required]],
//     dobYear: ['', [Validators.required]],
//     url: [''], // You can update it when a file is uploaded
//     status: ['pending'], // Default value for status, can be changed
//     certifications: [[]], // Empty initially
//   });
