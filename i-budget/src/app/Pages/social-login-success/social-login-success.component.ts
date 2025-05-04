import { Component , OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-social-login-success',
  imports: [],
  templateUrl: './social-login-success.component.html',
  styleUrl: './social-login-success.component.css'
})
export class SocialLoginSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
 
    this.route.queryParams.subscribe(params => {
   
      const email = params['email'];
      const userId = params['userId'];
      const accessToken = params['accessToken'];
      const refreshToken = params['refreshToken'];
      const role=params['role'];
        localStorage.setItem('email', email);
        localStorage.setItem('userId', userId);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role',role);
        
      console.log('Social login data saved, redirecting to dashboard');

      if(role=='ROLE_ADMIN'){
        this.router.navigate(["roleList"]);
      }else{
        this.router.navigate(["dashboard"]);
      } // Redirect to dashboard or home
    
    
    });
  }
}
