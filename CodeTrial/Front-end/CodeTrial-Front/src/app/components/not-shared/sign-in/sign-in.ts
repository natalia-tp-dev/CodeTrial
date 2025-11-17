import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css']
})

export class SignIn {
  //Inyeccion de propiedades de Auth de nuestros servicios
  auth = inject(Auth)
  router = inject(Router)
  //Variables que capturan la info del forms
  firstName: string = ''
  lastName: string = ''
  email: string = ''
  password: string = ''
  confirmPassword: string = ''

  //evento click del boton registrar
  registrar() {
    //Confirmar que las contrasenas coincidan
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        text: 'Las contrasenas deben ser iguales'
      })
      return
    }
    //Objeto data que contiene la info del usuario
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }

    //metodo registrar de auth
    this.auth.sing_in(data).subscribe({
      next: res => Swal.fire({
        icon: 'success',
        text: res.message,
        footer: 'You can now log in with your credentials'
      }).then(result => {
        if (result.isConfirmed) {
          this.router.navigate(['/log-in'])
        }
      }),
      error: (httpError: HttpErrorResponse) => {
        const status = httpError.status
        const error = httpError.error.error
        let messageError = ''
        if (status === 400) {
          switch (error) {
            case 'All fields are required to sign in':
              messageError = error
              break
            case 'Invalid format for email field, does not contain @':
              messageError = error
              break
            case 'Invalid format for email field, must contains something before @':
              messageError = error
              break
            case 'Invalid format for email field, does not contain gmail.com and neither hotmail.com':
              messageError = error
              break
            case 'The password must be at least 8 characters':
              messageError = error
              break
          }
          Swal.fire({
            title: 'An error occurred',
            icon: 'error',
            text: messageError
          })
        }
        if (status === 409){
          Swal.fire({
            title: 'An error occurred',
            icon: 'error',
            text: `The email ${data.email} is already registered, pleas log in`
          }).then( (result) => {
            this.router.navigate(['/log-in'])
          })
        }
      }
    });
  }
}
