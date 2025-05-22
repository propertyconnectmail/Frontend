import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';

import {trigger, transition, style, animate} from '@angular/animations';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-5px)' }))
      ])
    ])
  ]
})
export class LoginComponent {


  loginForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;
  loginError: string | null = null;

  constructor(private fb: FormBuilder,private authService: AuthService, private router : Router, private toastService : ToastService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    console.log("in login")

    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      this.toastService.showToast('Please enter your email and password!', 'error');
      return;
    }

    if(this.loginForm.valid){
      const { ...rest } = this.loginForm.value;

      let employee: any = {
        ...rest,
      };

      this.isSubmitting = true;
      
      this.authService.login(employee).subscribe(async(res:any) => {
        console.log(res)
        if(res.email){
          this.isSubmitting = false;
          this.toastService.showToast('Login Successful!', 'info');
          localStorage.setItem('user', JSON.stringify(res));
          this.authService.setLoginState(true);
          this.router.navigate(['/dashboard'])
          return
        }
        if(res.Error === 'Email or Password is Incorrect'){
          this.isSubmitting = false;
          this.toastService.showToast('Email or password is incorrect!', 'error');
          return
        }
        if(res.email != employee.email){
          this.isSubmitting = false;
          this.toastService.showToast('Something went wrong please try again later!', 'error');
          return
        }
      })
    }
  }
}
