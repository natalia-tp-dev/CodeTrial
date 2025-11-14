import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  
  private URL = "http://localhost:4000/api/usuarios"

  http = inject(HttpClient)

  //Registro
  registrar(data:any): Observable<any>{
    return this.http.post(`${this.URL}/sign-in`, data, {
      withCredentials: true
    })
  }

  //Login
  login(data:any): Observable<any> {
    return this.http.post(`${this.URL}/log-in`, data, {
      withCredentials: true
    })
  }

  //Obtener perfil
  getPerfil(): Observable<any>{
    return this.http.get(`${this.URL}/get-profile`, {
      withCredentials: true
    })
  }
}
