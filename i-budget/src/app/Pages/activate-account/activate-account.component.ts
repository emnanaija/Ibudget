import { Component, QueryList, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivationRequest } from '../../Models/User/activation-request';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {UserService} from '../../services/User/user.service';

@Component({
  selector: 'app-activate-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css'
})
export class ActivateAccountComponent{
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router:Router
    ,private userService:UserService) { }
    activationreq :ActivationRequest = {email: '', activationCode: ''} ;

    errorMsg: Array<string>=[];



/**Activate */
  activate(): void {
  this.errorMsg= [];
    this.userService.activateAccount(
      this.activationreq
    )
      .subscribe({
        next: (): void => {
          this.showSuccess("Account activated successfully");
          setTimeout(() => {
            this.router.navigate(["signupRegister"]);
          }, 2000);
        },
        error: (err) : void => {
          console.log(err);
          if(err.error==null)
          {
            this.showError("Email is required");

          }else if (!this.activationreq.activationCode){  this.showError("Activation code is required");}else
            {this.showError(err.error);
          }}

      });
}

resend(): void {
  this.errorMsg= [];
    this.userService.resendActivationCode(
      this.activationreq.email
    )
      .subscribe({
        next: (): void => {
          this.successMessage = 'Activation code was sent to your email';
          this.showSuccess(this.successMessage);
        },
        error: (err) : void => {
          console.log(err);
          if(this.activationreq.email=='')
            {this.showError("Email is required");}
          else{this.showError("User not found");}
        }
      });
}

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
