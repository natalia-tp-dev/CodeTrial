import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, map, of, BehaviorSubject } from 'rxjs';
import { GetProfileResponse } from '../interfaces/get-profile-response'
import { SigninData } from '../interfaces/signin-data';
import { LoginData } from '../interfaces/login-data';
import { SuccessResponse } from '../interfaces/success-response';
import { LogOutResponse } from '../interfaces/log-out-response';
import { CodeResponse } from '../interfaces/code-response';
import { UpdateCodeData } from '../interfaces/update-code-data';
import { GetCodeResponse } from '../interfaces/get-code-response';

@Injectable({
  providedIn: 'root'
})

export class Auth {

  private URL = "http://localhost:4000/api/usuarios"
  //Inyeccion de HttpClient
  http = inject(HttpClient)

  //Registro
  sing_in(data: SigninData): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this.URL}/sign-in`, data)
  }
  //Login
  log_in(data: LoginData): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this.URL}/log-in`, data, {
      withCredentials: true
    })
  }
  //Obtener info del perfil
  getPerfil(): Observable<GetProfileResponse> {
    return this.http.get<GetProfileResponse>(`${this.URL}/get-profile-info`,
      { withCredentials: true })
  }
  //Obtener perfil y validar que este logueado
  isLoggedIn(): Observable<boolean> {
    return this.http.get<GetProfileResponse>(
      `${this.URL}/get-profile-info`,
      { withCredentials: true }
    ).pipe(
      map(res => res.isLogged),
      catchError(() => of(false))
    )
  }
  //Desloguear
  logOut(): Observable<LogOutResponse> {
    return this.http.post<LogOutResponse>(`${this.URL}/log-out`, {}, {
      withCredentials: true
    })
  }
  //Ejecutar codigo
  executeCode(data: UpdateCodeData): Observable<CodeResponse> {
    return this.http.post<CodeResponse>(`${this.URL}/execute-code`, data, {
      withCredentials: true
    })
  }
  //Actualizar codigo
  updateCode(data: UpdateCodeData): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(`${this.URL}/update`, data, {
      withCredentials: true
    })
  }
  //Obtener codigo
  getCode(lessonNumber: number): Observable<GetCodeResponse> {
    return this.http.get<GetCodeResponse>(`${this.URL}/get-code?lessonNumber=${lessonNumber}`,
      {
        withCredentials: true
      })
  }
  //Actualizar estado
  updateState(state:boolean, lessonNumber: number): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(`${this.URL}/update-state`, {state, lessonNumber}, {
      withCredentials:true
    })
  }
}
