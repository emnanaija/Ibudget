import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../../Models/User/register-request';
import { ActivationRequest } from '../../Models/User/activation-request';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { UpdateRequest } from '../../Models/User/update-request';
import { UpdateUserRequest } from '../../Models/User/update-user-request';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private BASE_URL="http://localhost:8090/user";

  requestHeader = new HttpHeaders({ 'No-Auth': 'True' }); //hethi bch najm naadi hajet menghir login

  constructor(private http:HttpClient,private router:Router) { }

  // The function returns an Observable, meaning the result will be available later (like waiting for a server to respond)
  login(email: string , password: string ): Observable<any> {
    const url=`${this.BASE_URL}/login`;
    return this.http.post<any>(url, {email, password},{
      headers: this.requestHeader
    });
  }

  /******Register***/
  register(request: RegisterRequest): Observable<any> {
    const registerUrl=`${this.BASE_URL}/register`;
    return this.http.post(registerUrl, request, {
      headers: this.requestHeader,
      responseType: 'text' as 'json' 
    });
  }
//*****Activate account */
activateAccount(request:ActivationRequest): Observable<any>{
  const url=`${this.BASE_URL}/activateAccount`;
  return this.http.post<any>(url,request,{
    headers: this.requestHeader,
    responseType: 'text' as 'json' 
  });

}
//***Resend Activation Code */
resendActivationCode(email: string): Observable<any>{
  const url=`${this.BASE_URL}/resendActivationCode`;
  return this.http.post<any>(url,{email},{
    headers: this.requestHeader,
    responseType: 'text' as 'json' 
  });

}
//**Send email activation code */
sendResetPasswordEmail(email: string):Observable<any>{
  const url=`${this.BASE_URL}/sendResetPasswordRequest`;
  return this.http.post<any>(url,{email},{
    headers: this.requestHeader,
    responseType: 'text' as 'json' 
  });

}

//**Reset Password */

resetPassword(newPassword: string ,resetToken:string):Observable<any>{
  const url=`${this.BASE_URL}/resetPassword?token=${resetToken}`; //k yabda type query param hak nabaathou mel front
  return this.http.post<any>(url,{newPassword},{
    headers: this.requestHeader
    ,
  responseType: 'text' as 'json' // angular lenna yekhou up to 3 arguments so hetha nhotou haka
  });
}

//**Change Password */
changePassword(currentPassword: string, newPassword: string, confirmationPassword: string): Observable<any> {
  const url = `${this.BASE_URL}/changePassword`; 

  return this.http.patch<any>(url, {currentPassword, newPassword, confirmationPassword}, {responseType: 'text' as 'json' 
  });
}

private platformId = inject(PLATFORM_ID);


getAllUsers(): Observable<any[]> {
  const url = `${this.BASE_URL}/getAllUsersByAdmin`;

  if (!isPlatformBrowser(this.platformId)) {
    console.warn('getAllUsers: not in browser, skipping localStorage usage.');
    return this.http.get<any[]>(url);
  }

  const refreshToken = localStorage.getItem('refreshtoken'); // tu peux l'utiliser ici si nécessaire
  return this.http.get<any[]>(url);
}

/*Admin get users who requested update */
getUpdateRequestsAdmin():Observable<any[]>{
  const url=`${this.BASE_URL}/getUpdateRequestsAdmin`;
  return this.http.get<any[]>(url);
}
/*Admin get users who requested deletion */
getDeletionRequestsAdmin():Observable<any[]>{
  const url=`${this.BASE_URL}/getDeletionRequestsAdmin`;
  return this.http.get<any[]>(url);
}
/*Admin delete users who requested deletion */
deleteUsers():Observable<any>{
  const url=`${this.BASE_URL}/deleteUserByAdmin`;
  return this.http.delete<any>(url,{ responseType: 'text' as 'json' });
}
/*Get user by id*/
getUserById(id:string):Observable<any>{
  const url=`${this.BASE_URL}/getUserByAdmin/${id}`;
  return this.http.get<any>(url);
}
/**send update request */
sendUpdateRequest(request: UpdateRequest): Observable<any> {
  const url = `${this.BASE_URL}/sendUpdateRequest`;

  const token = localStorage.getItem('accessToken'); // or sessionStorage.getItem(...)
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  return this.http.post<any>(url, request, { headers ,responseType: 'text' as 'json'});
}
/*Update user profile */
updateUserProfile(request: UpdateUserRequest): Observable<any> {
  const url = `${this.BASE_URL}/updateUser`;
  return this.http.patch<any>(url, request, {responseType: 'text' as 'json'});
}
/*Delete Account Requeqt */
deleteUserRequest(password: string): Observable<any> {
  const url = `${this.BASE_URL}/accountDeletionRequest`;
  return this.http.post<any>(url,{password},{responseType: 'text' as 'json'});
}
/*Update user by id */
updateUserById(id:string):Observable<any>{
  const url=`${this.BASE_URL}/updateUserByAdmin/${id}`;
  return this.http.post<any>(url,{id},{responseType: 'text' as 'json'});
  
}
/*Ai Advice*/
getFinancialAdvice(question: string): Observable<any> {
  const url = `${this.BASE_URL}/advice`;
  return this.http.post<any>(url, { question },{responseType: 'text' as 'json'});
}

/*Complete Profile*/
completeProfile(request: RegisterRequest): Observable<any> {

  const url = `${this.BASE_URL}/completeProfile?email=${request.email}`;
  // Remove email from the request body
  const requestBody = {
    aiTonePreference: request.aiTonePreference,
    dateOfBirth: request.dateOfBirth,
    financialKnowledgeLevel: request.financialKnowledgeLevel,
    firstName: request.firstName,
    gender: request.gender,
    lastName: request.lastName,
    password: request.password,
    phoneNumber: request.phoneNumber,
    profession: request.profession
  };
  return this.http.post<any>(url, requestBody,{headers: this.requestHeader,responseType: 'text' as 'json'});
}
//**Logout */
  logOut():void{
    if(typeof localStorage !== 'undefined'){
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('role')
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
      this.router.navigate(['signupRegister'])
    }
  }

  isAuthenticated(): boolean {
    if(typeof localStorage !== 'undefined'){ // Checks if localStorage is available
      const token = localStorage.getItem('accesToken'); // Retrieves the token from localStorage
      return !!token; // Converts the token value into a boolean: true if it exists, false if null/undefined
    }
    return false; // If localStorage is not available, return false

  }

  isAdmin(): boolean {
    if(typeof localStorage !== 'undefined'){
      const role = localStorage.getItem('role');
      return role === 'ROLE_ADMIN'
    }
    return false;

  }

  isUser(): boolean {
    if(typeof localStorage !== 'undefined'){
      const role = localStorage.getItem('role');
      if (role==='ROLE_USER_FREMIUM'|| role === 'ROLE_USER_PREMIUM'){
        return true;
      }
    }
    return false;

  }

  isUserPremium(): boolean {
    if(typeof localStorage !== 'undefined'){
      const role = localStorage.getItem('role');
      if (role === 'ROLE_USER_PREMIUM'){
        return true;
      }
    }
    return false;

  }
  
}
