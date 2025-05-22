import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Professional } from '../../_interfaces/professional/professional'; 
import { ProfessionalService } from '../../_services/professional/professional.service';
import { UploadService } from '../../_services/upload/upload.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { PlatformService } from '../../core/services/platform/platform.service';

interface DownloadedFiles {
  name: string;
  url: string;
}


@Component({
  selector: 'app-professional-add',
  standalone: false,
  templateUrl: './professional-add.component.html',
  styleUrl: './professional-add.component.scss'
})
export class ProfessionalAddComponent implements OnInit {

  mode: string = '';
  id: string | null = null;
  form!: FormGroup<any>;
  uploadedFiles: File[] = [];
  isSubmitting = false;
  selectedFiles: any;
  isFileInputDisabled = false; // or false to enable it

  downloadedFiles: DownloadedFiles[] = [];


  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  orginalBody : any = {
    email: ''
  }

  body : any = {...this.orginalBody}

  constructor(private fb: FormBuilder, private location : Location, private platformService : PlatformService, private toastService: ToastService, private route: ActivatedRoute, private professionalService : ProfessionalService, private uploadService : UploadService) {}

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
        this.professionalService.getProfessionalForm(this.body).subscribe(async(professional:any) => {
          if(professional.email === id){
            this.loadData(professional);
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
              description: 'Viewed professional - '+professional.email+' ',
              date: dateString
            }
  
            this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
              //
            })

            this.downloadedFiles = professional.certifications.map((url: string) => {
              const name = url.split('/').pop(); // Extract filename from URL
              console.log(this.downloadedFiles)
              return { name, url };
            });
          }else {
            this.toastService.showToast('Error loading data. Try again later!', 'error');
          }

        })
        return;
      }

      if(this.mode === 'edit'){
        let id : any = params.get('id');
        this.body.email = id;
        this.professionalService.getProfessionalForm(this.body).subscribe(async(professional:any) => {
          if(professional.email === id){
            this.loadData(professional);
            this.isFileInputDisabled = true;
            this.downloadedFiles = professional.certifications.map((url: string) => {
              const name = url.split('/').pop(); // Extract filename from URL
              return { name, url };
            });
          }else {
            this.toastService.showToast('Error loading data. Try again later!', 'error');
          }

        })
        return;
      }


      if(this.mode === 'delete'){
        let id : any = params.get('id');
        this.body.email = id;
        this.professionalService.getProfessionalForm(this.body).subscribe(async(professional:any) => {
          if(professional.email === id){
            this.loadData(professional);
            console.log(this.form.value)
            
            this.isFileInputDisabled = true; // or false to enable it
            this.downloadedFiles = professional.certifications.map((url: string) => {
              const name = url.split('/').pop(); // Extract filename from URL
              return { name, url };
            });
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
      googleId: [''],
      phone: ['', [Validators.required]],
      type: ['',Validators.required],
      address: ['', [Validators.required]],
      dobMonth: ['', [Validators.required]],
      dobDay: ['', [Validators.required]],
      dobYear: ['', [Validators.required]],
      consultationFee: ['', [Validators.required]],
      url: [''],
      status: [''], 
      certifications: [[]], 
    });

    if(this.mode = 'add'){
      this.form.get('firstName')?.valueChanges.subscribe(() => this.setAutoPassword());
      this.form.get('dobYear')?.valueChanges.subscribe(() => this.setAutoPassword());
    }
  }

  loadData(professional : any) : void{
    const [day, month, year] = professional.dob.split('/');

    const monthIndex = parseInt(month, 10) - 1; 
    const monthName = this.months[monthIndex]; 

    this.form.patchValue({
      firstName: professional.firstName,
      lastName: professional.lastName,
      email: professional.email,
      password: professional.password,
      nic: professional.nic,
      googleId: professional.googleId,
      phone: professional.phone,
      type: professional.type,
      address: professional.address,
      dobDay: day,
      dobMonth: monthName,
      dobYear: year,
      consultationFee: professional.consultationFee,
      url: professional.url,
      status: professional.status,
      certifications: professional.certifications || [],
    });

    console.log(this.form.value)
  }

  downloadFilesAsZip(): void {
    const docs = this.downloadedFiles;
    if (docs.length === 0) return;

    const apiUrl = 'https://propertconnectbackend.onrender.com/api/certifications/download-zip'; // ✅ same as mobile app
    const params = new URLSearchParams();

    docs.forEach(file => {
      if (file.url) {
        params.append('urls', file.url);
      }
    });

    const downloadUrl = `${apiUrl}?${params.toString()}`;
    window.open(downloadUrl, '_blank'); // 🔁 Opens download link in new tab
  }

  
  setAutoPassword(): void {
    const firstName = this.form.get('firstName')?.value || '';
    const dobYear = this.form.get('dobYear')?.value || '';
    if (firstName && dobYear) {
      this.form.get('password')?.setValue(`${firstName}${dobYear}`);
    }
  }


  formFields = [
    { key: 'firstName', label: 'First Name', placeholder: 'Enter your first name', error:'Please enter a valid first name with atleast 3 letters' },
    { key: 'lastName', label: 'Last Name', placeholder: 'Enter your last name', error:'Please enter a valid last name with atleast 3 letters' },
    { key: 'email', label: 'Email Address', placeholder: 'Enter your email', error:'Please enter a valid email' },
    { key: 'nic', label: 'NIC', placeholder: 'Enter your ID number', error:'Please enter a valid ID' },
    { key: 'phone', label: 'Phone Number', placeholder: 'Enter your phone number', error:'Phone number should be 10 digits' },
    { key: 'address', label: 'Address', placeholder: 'Enter your address', error:'Please enter a valid address' },
    { key: 'consultationFee', label: 'Consultation Fee', placeholder: 'Enter your consultation fee', error:'Please enter a valid consultation fee' }
  ];

  statuses = ['pending', 'verified', 'blocked', 'rejected'];
  professionalTypes = ['lawyer', 'surveyor', 'valuer'];


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      const selectedFiles = Array.from(input.files).filter(file =>
        allowedTypes.includes(file.type)
      );

      if (selectedFiles.length === 0) {
        this.toastService.showToast('Only PDF, DOC, or DOCX files are allowed!', 'error');
        return;
      }

      if (selectedFiles.length > 10) {
        this.toastService.showToast('You can upload a maximum of 10 files!', 'error');
        return;
      }
      

      this.uploadedFiles = selectedFiles;
    }
  }
  

  discardChanges(): void {
    this.form.reset();
    this.uploadedFiles = [];
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
      
      let professional: Professional = {
        ...rest,
        dob:  this.setMonth(),
      };

      if(this.uploadedFiles.length === 0 ){
        this.toastService.showToast('Please Upload Certification!', 'error');
        return
      }

      this.isSubmitting = true;

      const formData = new FormData();
      this.uploadedFiles.forEach(file => {
        formData.append('certifications', file); // 'certifications' must match the Multer field name
      });
      
      this.uploadService.postProfessionalFiles(formData).subscribe(async(res:any) => {
        if(await res.message === 'Certification files uploaded successfully'){
          professional.certifications = await res.fileUrls;
          professional.url = 'https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg'

          this.professionalService.postProfessionalForm(professional).subscribe(async(res:any) => {
            if(await res.message === 'success'){
              // Simulate API delay
              this.platformService.updateTotalProfessionals().subscribe(async(res:any) =>{

                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();

                const dateString: string = `${day}/${month}/${year}`;

                let auditlog = {
                  id: '',
                  actionType: 'create',
                  performedBy: user.email,
                  description: 'Created professional - '+professional.email+' ',
                  date: dateString
                }

                this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
                  this.toastService.showToast('Professional created successfully!', 'success');
                  setTimeout(() => {
                    this.isSubmitting = false;
                    this.location.back();
                  }, 1500);
                })              
              })
            }
            if(await res.Type === 'Joi'){
              this.toastService.showToast('Please enter valid details and try again!', 'error');
                setTimeout(() => {
                  this.isSubmitting = false;
              }, 1500);
            }
          })
        }else {
          this.toastService.showToast('File Upload Failed. Try Again Later!', 'error');
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
      
      let professional: Professional = {
        ...rest,
        dob:  this.setMonth(),
      };
      
      console.log(professional)

      this.isSubmitting = true;
      
      this.professionalService.updateProfessionalForm(professional).subscribe(async(res:any) => {
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
            description: 'Updated professional - '+professional.email+' ',
            date: dateString
          }

          this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
            this.toastService.showToast('Professional updated successfully!', 'info');
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
      
      let professional: Professional = {
        ...rest,
        dob:  this.setMonth(),
      };

      this.isSubmitting = true;
      
      this.professionalService.deleteProfessionalForm(professional).subscribe(async(res:any) => {
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
            description: 'Deleted professional - '+professional.email+' ',
            date: dateString
          }

          this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
            this.toastService.showToast('Professional deleted successfully!', 'success');
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

    const monthIndex = monthNames.indexOf(formData.dobMonth) + 1;
    const month = String(monthIndex).padStart(2, '0');
    const day = String(formData.dobDay).padStart(2, '0');
    const year = formData.dobYear;
    const dob = `${day}/${month}/${year}`;

    return dob
  }
}
