import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../core/services/toast/toast.service';
import { PlatformService } from '../../core/services/platform/platform.service';
import { EmployeeService } from '../../_services/employee/employee.service';


@Component({
  selector: 'app-employee-crud',
  standalone: false,
  templateUrl: './employee-crud.component.html',
  styleUrl: './employee-crud.component.scss'
})
export class EmployeeCrudComponent implements OnInit {

  mode: string = '';
  id: string | null = null;
  form!: FormGroup<any>;
  isSubmitting = false;
  
  
    months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    orginalBody : any = {
      email: ''
    }
  
    body : any = {...this.orginalBody}
  
    constructor(private fb: FormBuilder, private location : Location, private platformService : PlatformService, private toastService: ToastService, private route: ActivatedRoute, private employeeService : EmployeeService) {}
  
    ngOnInit(): void {
      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);
  
      this.route.paramMap.subscribe(params => {
        this.mode = params.get('mode')!;
  
        if(this.mode === 'add'){
          return;
        }
  
        if(this.mode === 'view'){
          let id : any = params.get('id');
          this.body.email = id;
          this.employeeService.getEmployeeForm(this.body).subscribe(async(employee:any) => {
            if(employee.email === id){
              this.loadData(employee);
              this.form.disable();

              const now = new Date();
              const day = String(now.getDate()).padStart(2, '0');
              const month = String(now.getMonth() + 1).padStart(2, '0');
              const year = now.getFullYear();
    
              const dateString: string = `${day}/${month}/${year}`;
    
              let auditlog = {
                id: '',
                actionType: 'view',
                performedBy: user.email,
                description: 'Viewed employee - '+employee.email+' ',
                date: dateString
              }
    
              this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
                //
              }) 
            }else {
              this.toastService.showToast('Error loading data. Try again later!', 'error');
            }
  
          })
          return;
        }
  
        if(this.mode === 'edit'){
          let id : any = params.get('id');
          this.body.email = id;
          this.employeeService.getEmployeeForm(this.body).subscribe(async(employee:any) => {
            if(employee.email === id){
              this.loadData(employee);
            }else {
              this.toastService.showToast('Error loading data. Try again later!', 'error');
            }
  
          })
          return;
        }
  
  
        if(this.mode === 'delete'){
          let id : any = params.get('id');
          this.body.email = id;
          this.employeeService.getEmployeeForm(this.body).subscribe(async(employee:any) => {
            if(employee.email === id){
              this.loadData(employee);
            }else {
              this.toastService.showToast('Error loading data. Try again later!', 'error');
            }
  
          })
          return;
        }
      });
  
      this.form = this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        nic: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        address: ['', [Validators.required]],
        dobMonth: ['', [Validators.required]],
        dobDay: ['', [Validators.required]],
        dobYear: ['', [Validators.required]],
        url: [''], // You can update it when a file is uploaded
        status: [''], // Default value for status, can be changed
        type: [''] // Default value for status, can be changed
      });
  
      if(this.mode === 'add'){
        this.form.get('firstName')?.valueChanges.subscribe(() => this.setAutoPassword());
        this.form.get('dobYear')?.valueChanges.subscribe(() => this.setAutoPassword());
      }
    }
  
    loadData(employee : any) : void{
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
    
  
    setAutoPassword(): void {
      const firstName = this.form.get('firstName')?.value || '';
      const dobYear = this.form.get('dobYear')?.value || '';
      if (firstName && dobYear) {
        this.form.get('password')?.setValue(`${firstName}${dobYear}`);
      }
    }
  
  
    formFields = [
      { key: 'firstName', label: 'First Name', placeholder: 'Enter your first name', error:'Please enter a valid first name' },
      { key: 'lastName', label: 'Last Name', placeholder: 'Enter your last name', error:'Please enter a valid last name' },
      { key: 'email', label: 'Email Address', placeholder: 'Enter your email', error:'Please enter a valid email' },
      { key: 'nic', label: 'NIC', placeholder: 'Enter your ID number', error:'Please enter a valid ID' },
      { key: 'phone', label: 'Phone Number', placeholder: 'Enter your phone number', error:'Phone number should be 10 digits' },
      { key: 'address', label: 'Address', placeholder: 'Enter your address', error:'Please enter a valid address' }
    ];
  
    statuses = ['active', 'blocked'];    
    types = ['employee', 'admin'];    
  
    discardChanges(): void {
      this.form.reset();
    }
  
    cancel(){
      this.location.back();
      this.discardChanges();
    }
  
    create() : void {
      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);
  
      if(this.form.valid){
        const {dobYear, dobMonth, dobDay, ...rest } = this.form.value;
        
        let employee: any = {
          ...rest,
          dob:  this.setMonth(),
        };

        this.isSubmitting = true;

        employee.url = 'https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg'
        console.log(employee)
        this.employeeService.postEmployeeForm(employee).subscribe(async(res:any) => {
          console.log(res)
        if(await res.message === 'success'){
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();

          const dateString: string = `${day}/${month}/${year}`;

          let auditlog = {
            id: '',
            actionType: 'create',
            performedBy: user.email,
            description: 'Created employee - '+employee.email+' ',
            date: dateString
          }

          this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
            this.toastService.showToast('Employee created successfully!', 'success');
            setTimeout(() => {
              this.isSubmitting = false;
              this.location.back();
            }, 1500);
          }) 
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
  
  
    update() : void {
  
      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);
  
  
      if(this.form.valid){
        const {dobYear, dobMonth, dobDay, ...rest } = this.form.value;
        
        let employee: any = {
          ...rest,
          dob:  this.setMonth(),
          password: this.form.get('password')?.value
        };
  
        this.isSubmitting = true;
        
        this.employeeService.updateEmployeeForm(employee).subscribe(async(res:any) => {
          if(await res.message === 'success'){
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
  
            const dateString: string = `${day}/${month}/${year}`;
  
            let auditlog = {
              id: '',
              actionType: 'update',
              performedBy: user.email,
              description: 'Updated employee - '+employee.email+' ',
              date: dateString
            }
  
            this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
              this.toastService.showToast('Employee updated successfully!', 'success');
              setTimeout(() => {
                this.isSubmitting = false;
                this.location.back();
              }, 1500);
            }) 
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
  
  
    delete():void{
      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);
  
      if(this.form.valid){
        const {dobYear, dobMonth, dobDay, ...rest } = this.form.value;
        
        let employee: any = {
          ...rest,
          dob:  this.setMonth(),
        };
  
        this.isSubmitting = true;
        
        this.employeeService.deleteEmployeeForm(employee).subscribe(async(res:any) => {
          if(await res.message === 'success'){
  
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
  
            const dateString: string = `${day}/${month}/${year}`;
  
            let auditlog = {
              id: '',
              actionType: 'delete',
              performedBy: user.email,
              description: 'Deleted employee - '+employee.email+' ',
              date: dateString
            }
  
            this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
              this.toastService.showToast('Employee deleted successfully!', 'info');
              setTimeout(() => {
                this.isSubmitting = false;
                this.location.back();
              }, 1500);
            }) 
          }
        })
      } else {
        this.toastService.showToast('Please enter valid details for all fields!', 'error');
        this.form.markAllAsTouched();
      }
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
}
