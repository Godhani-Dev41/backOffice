import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminAuthService } from '@app/shared/services/auth/admin-auth.service';

@Component({
  selector: 'rc-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  styleUrls: ['./admin-login-page.component.scss']
})
export class AdminLoginPageComponent implements OnInit {
  loading: boolean;
  user: { email: string, password: string };
  loginForm: FormGroup;
  errorMessage: string;
  constructor(
    private route: Router,
    private adminAuth: AdminAuthService,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: '',
      password: ''
    });

    this.user = {
      email: '',
      password: ''
    };
  }

  onLogin(form) {
    if (this.loading) return;

    this.loading = true;
    this.adminAuth.login(form.email, form.password).subscribe((response) => {
      this.loading = false;

      this.route.navigate(['/admin']);
    }, (err) => {
      this.loading = false;

      const error = err;
      console.log(error);
    });
  }
}
