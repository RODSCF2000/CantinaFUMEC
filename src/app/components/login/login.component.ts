import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as shajs from 'sha.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      }
    );
  }

  ngOnInit() {
  }

  submit() {
    const login = this.loginForm.getRawValue();
    login.password = shajs('sha256').update(login.password).digest('hex');
    if (this.loginForm.valid) {
      this.authService.login(login).subscribe(
        data => {
          if (data.length > 0) {
            if (login.password === data[0].password) {
              localStorage.setItem('user', JSON.stringify(data[0]));
              this.router.navigate(['']);
            } else {
              alert('Email ou senha inválido(s).');
            }
          } else {
            alert('Usuário não cadastrado.');
          }
          console.log(data);
        }
      );
    }
  }
}
