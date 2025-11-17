import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { map } from 'rxjs';

//guard para proteger rutas
export const authGuard: CanActivateFn = (route, state) => {

  //Inyeccion
  const auth = inject(Auth)
  const router = inject(Router)

  //Retorno de booleano, verifica que el token siga activo
  return auth.isLoggedIn().pipe(
    map(isLogged => {
      if(!isLogged){
        return router.parseUrl('/log-in')
      }
      return true
    })
  )
};
