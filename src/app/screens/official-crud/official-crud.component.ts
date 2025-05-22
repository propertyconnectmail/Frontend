import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../core/services/toast/toast.service';
import { PlatformService } from '../../core/services/platform/platform.service';
import { OfficialService } from '../../_services/official/official.service';
import { RegistryService } from '../../_services/registry/registry.service';

@Component({
  selector: 'app-official-crud',
  standalone: false,
  templateUrl: './official-crud.component.html',
  styleUrl: './official-crud.component.scss'
})
export class OfficialCrudComponent {
  
  mode: string = '';
  id: string | null = null;
  form!: FormGroup<any>;
  isSubmitting = false;
  districts: string[] = [];
  provinces: string[] = [];

  
    orginalBody : any = {
      id: ''
    }
  
    body : any = {...this.orginalBody}
  
    constructor(private fb: FormBuilder, private location : Location, private platformService : PlatformService, private toastService: ToastService, private route: ActivatedRoute, private officialService : OfficialService, private registryService : RegistryService) {}
  
    ngOnInit(): void {
      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);
  
      this.route.paramMap.subscribe(params => {
        this.mode = params.get('mode')!;
        this.registryService.getAllRegistryLocations().subscribe((registry: any[]) => {
          if (registry.length !== 0) {
            this.districts = [...new Set(registry.map(item => item.district))];
            this.provinces = [...new Set(registry.map(item => item.province))];
          }
        }); 
  
        if(this.mode === 'add'){                   
          return;
        }
  
        if(this.mode === 'view'){
          let id : any = params.get('id');
          this.body.id = id;
          this.officialService.getOfficialForm(this.body).subscribe(async(officials:any) => {
            console.log(officials)
            if(officials.id === id){
              this.loadData(officials);
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
                description: 'Viewed official - '+officials.id+' ',
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
          this.body.id = id;
          this.officialService.getOfficialForm(this.body).subscribe(async(officials:any) => {
            if(officials.id === id){
              this.loadData(officials);
            }else {
              this.toastService.showToast('Error loading data. Try again later!', 'error');
            }
  
          })
          return;
        }
  
  
        if(this.mode === 'delete'){
          let id : any = params.get('id');
          this.body.id = id;
          this.officialService.getOfficialForm(this.body).subscribe(async(officials:any) => {
            if(officials.id === id){
              this.loadData(officials);
            }else {
              this.toastService.showToast('Error loading data. Try again later!', 'error');
            }
  
          })
          return;
        }
      });
  
      this.form = this.fb.group({
        id: [''],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        district: ['', [Validators.required]],
        province: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        type:['',[Validators.required]],
        url:['']
      });
    }
  
    loadData(official : any) : void{
  
      this.form.patchValue({
        id:official.id,
        firstName: official.firstName,
        lastName: official.lastName,
        district: official.district,
        province: official.province,
        phone: official.phone,
        type: official.type,
        url:official.url
      });
    } 
    
  
  
    formFields = [
      { key: 'firstName', label: 'First Name', placeholder: 'Enter your first name', error:'Please enter a valid first name' },
      { key: 'lastName', label: 'Last Name', placeholder: 'Enter your last name', error:'Please enter a valid last name' },
      { key: 'phone', label: 'Phone Number', placeholder: 'Enter your phone number', error:'Phone number should be 10 digits' },
    ];

    types = ['PHI officer', 'grama niladhari officer', 'municipal council officer'];    

    capitalizeWords(str: string): string {
      return str
        .split(' ') // Split the string into words
        .map(word => {
          // If the word is an acronym (all caps), return it as is
          if (word === word.toUpperCase()) {
            return word;
          }
          // Otherwise, capitalize the first letter and make the rest lowercase
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' '); // Join the words back into a single string
    }
    
  
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
        const { ...rest } = this.form.value;
        
        let officials: any = {
          ...rest,
        };

        this.isSubmitting = true;

        officials.url = 'https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg'
        this.officialService.postOfficialForm(officials).subscribe(async(res:any) => {
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
            description: 'Created official - '+officials.id+' ',
            date: dateString
          }

          this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
            this.toastService.showToast('Official created successfully!', 'success');
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
        const { ...rest } = this.form.value;
        
        let officials: any = {
          ...rest,
        };

      
        this.isSubmitting = true;
        
        this.officialService.updateOfficialForm(officials).subscribe(async(res:any) => {
          console.log(res)
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
              description: 'Updated official - '+officials.id+' ',
              date: dateString
            }
  
            this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
              this.toastService.showToast('Official updated successfully!', 'info');
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
        const { ...rest } = this.form.value;
        
        let officials: any = {
          ...rest,
        };
  
        this.isSubmitting = true;
        
        this.officialService.deleteOfficialForm(officials).subscribe(async(res:any) => {
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
              description: 'Deleted official - '+officials.email+' ',
              date: dateString
            }
  
            this.platformService.createAuditLog(auditlog).subscribe(async(res:any) =>{
              this.toastService.showToast('Official deleted successfully!', 'success');
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
}
