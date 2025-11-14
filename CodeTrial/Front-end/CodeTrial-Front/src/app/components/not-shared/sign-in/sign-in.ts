import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css']
})

export class SignIn {

  //Inyeccion de propiedades de Auth de nuestros servicios
  auth = inject(Auth)

  //Variables que capturan la info del forms
  firstName: string = ''
  lastName: string = ''
  email: string = ''
  password: string = ''
  confirmPassword: string = ''

  //evento click del boton registrar
  registrar(){
    //Confirmar que las contrasenas coincidan
    if(this.password !== this.confirmPassword){
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
    this.auth.registrar(data).subscribe({
      next: res => Swal.fire({ 
        icon: 'success', 
        text: 'Usuario registrado correctamente', 
        confirmButtonColor: 'rgba(23, 39, 128, 1)' 
      })
    })
  }
}
