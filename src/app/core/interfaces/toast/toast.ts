export interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
  }
  
  // Allow the subject to accept both ToastMessage and null
export type ToastMessageOrNull = Toast | null;