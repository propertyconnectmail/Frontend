import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../core/services/toast/toast.service';
import { PlatformService } from '../../core/services/platform/platform.service';
import { EmployeeService } from '../../_services/employee/employee.service';
import { UploadService } from '../../_services/upload/upload.service';
import { TopbarComponent } from '../../navigation/topbar/topbar.component';
import { UserstateService } from '../../core/services/userstate/userstate.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-setting',
  standalone: false,
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent implements OnInit {
  mode: string = '';
  id: string | null = null;
  form!: FormGroup<any>;
  passwordForm!: FormGroup;
  isSubmitting = false;
  isPasswordSubmitting = false;
  isUpdateProfile = false;
  isUpdatePassword = false;
  maintenanceMode: boolean = false;
  
  
    months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    orginalBody : any = {
      email: ''
    }
  
    body : any = {...this.orginalBody}
  
    constructor(private router : Router, private authService : AuthService, private userstateService : UserstateService, private cdref: ChangeDetectorRef, private uploadService : UploadService, private fb: FormBuilder, private location : Location, private platformService : PlatformService, private toastService: ToastService, private route: ActivatedRoute, private employeeService : EmployeeService) {}
  
    ngOnInit(): void {

      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);

      this.employeeService.getEmployeeForm({email : user.email}).subscribe(async(employee:any)=>{
        if(employee.email === user.email){
          this.loadData(employee);
        }else {
          this.toastService.showToast('Error loading data. Try again later!', 'error');
        }
      })  
      this.form = this.fb.group({
        firstName: [{ value: '', disabled: true }, [Validators.required]],
        lastName: [{ value: '', disabled: true }, [Validators.required]],
        email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
        password: [''],
        nic: [{ value: '', disabled: true }, [Validators.required]],
        phone: [{ value: '', disabled: true }, [Validators.required]],
        address: [{ value: '', disabled: true }, [Validators.required]],
        dobMonth: [{ value: '', disabled: true }, [Validators.required]],
        dobDay: [{ value: '', disabled: true }, [Validators.required]],
        dobYear: [{ value: '', disabled: true }, [Validators.required]],
        url: [''], // You can update it when a file is uploaded
        status: [''], // Default value for status, can be changed
        type: [''] // Default value for status, can be changed
      });

      this.passwordForm = this.fb.group({
        oldPassword: [{ value: '', disabled: true }, [Validators.required]],
        newPassword: [{ value: '', disabled: true }, [Validators.required]],
        confirmPassword: [{ value: '', disabled: true }, [Validators.required]]
      }, { validator: this.passwordsMatch });

      this.platformService.getPlatformConfig({ id: '1' }).subscribe((res: any) => {
        if (res && res.maintenanceMode) {
          this.maintenanceMode = res.maintenanceMode === 'on';
        }
      });
    }
  
    loadData(employee : any) : void{
      console.log(employee)
      const [day, month, year] = employee.dob.split('/');
  
      const monthIndex = parseInt(month, 10) - 1; // Convert to 0-based index
      const monthName = this.months[monthIndex]; // Get month name from array
  
      this.form.patchValue({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        password: employee.password,
        nic: employee.nic,
        phone: employee.phone,
        address: employee.address,
        dobDay: day,
        dobMonth: monthName,
        dobYear: year,
        url: employee.url,
        status: employee.status,
        type: employee.type
      });
    }
  
  
    formFields = [
      { key: 'email', label: 'Email Address', placeholder: 'Enter your email', error:'Please enter a valid email' },
      { key: 'firstName', label: 'First Name', placeholder: 'Enter your first name', error:'Please enter a valid first name' },
      { key: 'lastName', label: 'Last Name', placeholder: 'Enter your last name', error:'Please enter a valid last name' },
      { key: 'nic', label: 'NIC', placeholder: 'Enter your ID number', error:'Please enter a valid ID' },
      { key: 'phone', label: 'Phone Number', placeholder: 'Enter your phone number', error:'Phone number should be 10 digits' },
      { key: 'address', label: 'Address', placeholder: 'Enter your address', error:'Please enter a valid address' }
    ];
  
    statuses = ['active', 'blocked'];    
    types = ['employee', 'admin'];    

    logout(): void {
      this.authService.logout();
      this.router.navigateByUrl('/login')
    }



    
    passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
      return group.get('newPassword')?.value === group.get('confirmPassword')?.value
        ? null
        : { mismatch: true };
    }


    updatePassword() {
      if (this.passwordForm.invalid) {
        this.passwordForm.markAllAsTouched();
        this.toastService.showToast('Please check if your new your password matches the confirm password', 'error');
        return;
      }

      const user = JSON.parse(localStorage.getItem('user')!);
      const { oldPassword, newPassword } = this.passwordForm.value;
      this.isPasswordSubmitting = true;
      this.employeeService.updateEmployeePassword({ email : user.email ,oldPassword : oldPassword, newPassword : newPassword }).subscribe(async(res:any)=> {
        if (res.message === 'success') {
          this.toastService.showToast('Password updated successfully!', 'success');
          this.isPasswordSubmitting = false;
          this.cancelPassword();
          return;
        } 
        if (res.Error === 'Please Enter the Valid Old Password') {
          this.toastService.showToast('Please enter the correct old password!', 'error');
          this.isPasswordSubmitting = false;
          return;
        } 
        else {
          this.toastService.showToast('Failed to update password please try again later!', 'error');
          this.isPasswordSubmitting = false;
          return;
        }
      });
    }
  
  
    update() : void {
  
      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);
  
  
      if(this.form.valid){
        const rawValues = this.form.getRawValue();
        const {dobYear, dobMonth, dobDay, ...rest } = rawValues;
        
        let employee: any = {
          ...rest,
          dob:  this.setMonth(),
        };
  
        this.isSubmitting = true;

        console.log(employee)
        
        this.employeeService.updateEmployeeForm(employee).subscribe(async(res:any) => {
           console.log(res)
          if(await res.message === 'success'){
            this.isSubmitting = false;
            this.cancel();
            this.toastService.showToast('Profile updated successfully!', 'success');
          }
          if(await res.Type === 'Joi'){
            this.toastService.showToast('Please enter valid details and try again!', 'error');
              setTimeout(() => {
                this.isSubmitting = false;
            }, 1500);
          }
        })
      } else {
        this.toastService.showToast('Please enter valid details for all fields!', 'error');
        this.form.markAllAsTouched();
      }
    }

    toggleEdit(){
      this.isUpdateProfile = !this.isUpdateProfile;

      const controlsToToggle = [
        'firstName',
        'lastName',
        // email stays disabled
        'nic',
        'phone',
        'address',
        'dobMonth',
        'dobDay',
        'dobYear'
      ];

      controlsToToggle.forEach(controlName => {
        const control = this.form.get(controlName);
        if (control) {
          this.isUpdateProfile ? control.enable() : control.disable();
        }
      });
    }

    toggleEditPassword(){
      this.isUpdatePassword = !this.isUpdatePassword

      if (this.isUpdatePassword) {
        this.passwordForm.get('oldPassword')?.enable();
        this.passwordForm.get('newPassword')?.enable();
        this.passwordForm.get('confirmPassword')?.enable();
      } else {
        this.passwordForm.get('oldPassword')?.disable();
        this.passwordForm.get('newPassword')?.disable();
        this.passwordForm.get('confirmPassword')?.disable();
      }
    }


    discardChanges(): void {
      this.form.reset();
    }
  
    cancel(){
      this.toggleEdit();
    }

    discardChangesPassword(): void {
      this.passwordForm.reset();
    }
  
    cancelPassword(){
      this.discardChangesPassword();
      this.toggleEditPassword();
    }


    onImageSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) return;

      const file = input.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.toastService.showToast('Only PNG, JPG, and JPEG formats are allowed!', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);

      this.uploadService.postImage(formData).subscribe((res: any) => {
        if (res.message === 'File uploaded successfully') {
          this.employeeService.updateEmployeeProfilePicture({ email: this.form.get('email')?.getRawValue(), url: res.fileUrl }).subscribe((updated: any) => {
            console.log(updated)
              if(updated.message === "success"){
                this.form.get('url')?.setValue(updated.url);
                this.userstateService.setProfileImage(updated.url); // triggers the topbar to update automatically
                this.cdref.detectChanges();
                this.toastService.showToast('Updated profile picture successfully!', 'success');
                return;
              }else{
                this.toastService.showToast('Image upload failed. Try again later!', 'error');
                return;
              }
            });
        }else{
          this.toastService.showToast('Image upload failed. Try again later!', 'error');
          return;
        }
      });
    }
  
    setMonth(){
      const formData = this.form.value;
  
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      // Convert month name to 2-digit month number
      const monthIndex = monthNames.indexOf(formData.dobMonth) + 1;
      const month = String(monthIndex).padStart(2, '0');
  
      // Pad day to 2 digits
      const day = String(formData.dobDay).padStart(2, '0');
  
      // Use year as-is
      const year = formData.dobYear;
  
      // Final DOB string in DD/MM/YYYY format
      const dob = `${day}/${month}/${year}`;
  
      return dob
    }

    onToggleMaintenance(): void {
      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);

      const mode = this.maintenanceMode ? 'on' : 'off';
      this.platformService.updateMaintenanceMode({ id: '1', maintenanceMode: mode }).subscribe((res: any) => {
        console.log(res)
        if (res.message === 'success' && mode === 'on') {
          this.toastService.showToast('Maintenance mode turned on!', 'info');

          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();

          const dateString: string = `${day}/${month}/${year}`;

          let auditlog = {
            id: '',
            actionType: 'update',
            performedBy: user.email,
            description: 'Maintainance mode status - ON',
            date: dateString
          }

          this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
            //
          })
          return
        }
        if (res.message === 'success' && mode === 'off') {
          this.toastService.showToast('Maintenance mode turned off!', 'info');


          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();

          const dateString: string = `${day}/${month}/${year}`;

          let auditlog = {
            id: '',
            actionType: 'update',
            performedBy: user.email,
            description: 'Maintainance mode status - OFF',
            date: dateString
          }

          this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
            //
          })
          return;
        } else {
          this.toastService.showToast('Failed to update platform settings.', 'error');
        }
      });
    }

}
