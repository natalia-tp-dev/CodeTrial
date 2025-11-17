import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isLogged = false
  //inyecciones
  auth = inject(Auth)
  router = inject(Router)
  //cada que se reinicia valida que el usuario este logueado
  ngOnInit() {
    this.auth.isLoggedIn().subscribe({
      next: (res) => {
        this.isLogged = res
      }
    })
  }
  //funcion de logout
  logout() {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      text: 'If your progress is not saved, it will be lost',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Go back'
    }).then(result => {
      if (result.isConfirmed) {
        this.auth.logOut().subscribe(() => {
          this.isLogged = false
        })
        this.router.navigate(['/log-in'])
      } else if (result.isDenied) {
        Swal.close()
      }
    })

  }
}
