import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Component({ 
  selector: 'app-login', 
  standalone: false,
  templateUrl: './login.component.html', 
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() { this.showPassword = !this.showPassword; }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.error = '';

    // Usa AuthService; acepta 'token'/'accessToken'; redirige por rol usando user del payload
    const { email, password } = this.form.value;
    this.auth.login({ email, password }).subscribe({
      next: (user: any) => {
        this.loading = false;
        const roles: string[] = user?.roles || [];
        console.log('[login] User after login:', user);
        if (roles.includes('ADMIN'))      this.router.navigateByUrl('/admin/usuarios');
        else if (roles.includes('JEFE'))  this.router.navigateByUrl('/dashboard');
        else if (roles.includes('BODEGUERO')) this.router.navigateByUrl('/productos');
        else if (roles.includes('VENDEDOR'))  this.router.navigateByUrl('/ventas/nueva');
        else this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error de autenticación';
        this.loading = false;
      }
    });
  }
}
