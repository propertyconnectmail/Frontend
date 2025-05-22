import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from '../../_services/upload/upload.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { PlatformService } from '../../core/services/platform/platform.service';
import { RegistryService } from '../../_services/registry/registry.service';


@Component({
  selector: 'app-registry-crud',
  standalone: false,
  templateUrl: './registry-crud.component.html',
  styleUrl: './registry-crud.component.scss'
})
export class RegistryCrudComponent {
  mode: string = '';
  id: string | null = null;
  form!: FormGroup<any>;
  isSubmitting = false;
  selectedFiles: any;
  isFileInputDisabled = false; // or false to enable it

  uploadedImage: { name: string; file: File } | null = null;
  downloadedFile: { name: string; url: string } | null = null;



  orginalBody : any = {
    id: ''
  }

  body : any = {...this.orginalBody}

  constructor(private fb: FormBuilder, private location : Location, private toastService: ToastService, private route: ActivatedRoute, private registryService : RegistryService) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.mode = params.get('mode')!;

      if(this.mode === 'view'){
        let id : any = params.get('id');
        this.body.id = id;
        this.registryService.getRegistryLocationForm(this.body).subscribe(async(registryLocation:any) => {
          if(registryLocation.id === id){
            this.loadData(registryLocation);
            this.form.disable();
            this.isFileInputDisabled = true; // or false to enable it

            const url = registryLocation.url;
            const name = url.split('/').pop();
          }else {
            this.toastService.showToast('Error loading data. Try again later!', 'error');
          }

        })
        return;
      }
    });

    this.form = this.fb.group({
      locationName: ['', [Validators.required]],
      district: ['', [Validators.required]],
      province: ['', [Validators.required]],
      contactNumber: [''], // Default value for status, can be changed
      address: [''] // You can update it when a file is uploaded
    });
  }

  loadData(location : any) : void{

    this.form.patchValue({
      locationName: location.locationName,
      address: location.address,
      phone: location.phone,
      status: location.status,
      url: location.url,
    });

    console.log(this.form.value)
  }

  formFields = [
    { key: 'locationName', label: 'Location Name', placeholder: 'Enter the location name', error:'Please enter a valid first name' },
    { key: 'address', label: 'Address', placeholder: 'Enter the address', error:'Please enter a valid address' },
    { key: 'contactNumber', label: 'Phone Number', placeholder: 'Enter the phone number', error:'Phone number should be 10 digits' },
  ];

  statuses = ['active', 'inactive', 'blocked'];

  

  discardChanges(): void {
    this.form.reset();
  }

  cancel(){
    this.location.back();
    this.discardChanges();
  }
}
