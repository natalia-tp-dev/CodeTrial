import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from '../../../services/cookie-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cookies',
  imports: [FormsModule, CommonModule],
  templateUrl: './cookies.html',
  styleUrl: './cookies.css'
})

export class Cookies implements OnInit {

  codigo: string = ''
  nombre: string = ''
  cookies: { name: string, value: string }[] = [];
  cookiesString: string = ''

  constructor(private cookiesService: CookieService) { }

  ngOnInit() {
    this.mostrarCookies()
  }

  anadir() {
    this.cookiesService.setCookie('codigo', this.codigo)
    this.cookiesService.setCookie('nombre', this.nombre)
    this.mostrarCookies();
  }

  borrar() {
    this.cookiesService.deleteCookie('codigo')
    this.cookiesService.deleteCookie('nombre')
    this.codigo = ''
    this.nombre = ''
    this.mostrarCookies()
  }

  mostrarCookies() {
    this.cookies = this.cookiesService.getAllCookies()
    this.cookiesString = document.cookie || 'vacío'
  }
}


