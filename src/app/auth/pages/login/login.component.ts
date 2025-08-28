import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

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
    private fb: FormBuilder
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
    
    this.http.post<any>(`${environment.apiBase}/auth/login`, this.form.value).subscribe({
      next: (res) => {
        console.log('Login exitoso');
        localStorage.setItem('token', res.token);   // <-- MISMA CLAVE que el guard
        this.router.navigateByUrl('/dashboard');    // <-- ABSOLUTO
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error de autenticación';
        this.loading = false;
      }
    });
  }
}
