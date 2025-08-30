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

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.loading = true;
    this.error = '';

    // Usa AuthService y acepta 'token' o 'accessToken'
    this.auth.login(this.form.value).subscribe({
      next: (res: any) => {
        const token = res?.accessToken || res?.token;
        if (!token) {
          this.error = 'Respuesta de login inválida';
          this.loading = false;
          return;
        }
        this.auth.token = token; // guarda en localStorage con la misma clave
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error de autenticación';
        this.loading = false;
      }
    });
  }
}
