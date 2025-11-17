import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../../services/auth';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-log-in',
  imports: [FormsModule, RouterLink],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css'
})
export class LogIn {

  //Inyeccion
  auth = inject(Auth)
  router = inject(Router)
  //Variables
  email: string = ''
  password: string = ''

//Metodo de iniciar sesion
  ingresar() {
    const data = {
      email: this.email,
      password: this.password
    }
    //Handler para la respuesta del post del log in
    this.auth.log_in(data).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          text: res.message,
        }).then((result) => {
          if(result.isConfirmed){
            this.router.navigate(['/profile'])
          }
        })
      },
      error: (httpError: HttpErrorResponse) => {
        const status = httpError.status
        const error = httpError.error
        let messageError = '' 
        console.log(status, error);
        if(status === 400){
          switch(error.error){
            case 'Email and password required':
              messageError = error.error
              break
            case 'Invalid format for email field, does not contain @':
              messageError = error.error
              break
            case 'Invalid format for email field, must contains something before @':
              messageError = error.error
              break
            case 'Invalid format for email field, does not contain gmail.com and neither hotmail.com':
              messageError =  error.error
          }
          Swal.fire({
            title: 'An error occurred',
            icon: 'error',
            text: messageError
          })
        }
        if(status === 404){
          messageError = error.error
          Swal.fire({
            title: 'An error occurred',
            icon: 'error',
            text: messageError
          })
        }
      }
    });
  }
}
