import { Component, OnInit } from '@angular/core';
import { ConnexionInfoService } from '../../services/User/connexion-info.service';
import { ActivatedRoute,Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-approve-new-device',
  imports: [CommonModule, FormsModule],
  templateUrl: './approve-new-device.component.html',
  styleUrl: './approve-new-device.component.css'
})
export class ApproveNewDeviceComponent implements OnInit {
  constructor(private router:Router
    ,private connexionInfoService:ConnexionInfoService,private route:ActivatedRoute ) { }
    approvalToken:string=''
    errorMessage: string = '';
    successMessage: string = '';

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this. approvalToken = params['token'];
        console.log(' approvalToken:', this. approvalToken);
      });
    }

    approveDevice(){
      this.connexionInfoService.approveDevice(this.approvalToken).subscribe({
        next:(response) =>{
          console.log(response);
          this.showSuccess("Device approved successfully");
          setTimeout(() => {
            this.router.navigate(["signupRegister"]);
          }, 2000);
        },
        error: (error) => {
          console.error(error);
          this.showError("Device approval failed");
        }
      })
    }
    cancel(){
      this.router.navigate(["signupRegister"]);
    }
    /*notification*/
    /**Error messages */
showError(mess: string) {
  this.errorMessage = mess;
  setTimeout(() => {
    this.errorMessage = '';
  }, 3000);
}
showSuccess(mess: string) {
  this.successMessage = mess;
  setTimeout(() => {
    this.successMessage = '';
  }, 3000);
}

}
