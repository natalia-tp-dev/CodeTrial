import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CookieService {

  /*Metodo para guardar las cookies en el navegador*/
  setCookie(name: string, value: string, days?: number) { //days es opcional
    let expires = ''

    if (days) {
      const date = new Date() //objeto tipo fecha
      date.setTime(date.getTime() + days * 24 * 60 * 60 - 1000) //dias en milisegundos, para manejar fechas como js
      expires = ':expires = ' + date.toUTCString() //fecha en formato utc a string
    }

    document.cookie = name + '=' + value + expires + ';path=/' //setemos la cookie en el navegador con un tiempo de expiracion

  }

  /*Metodo que retorna la cookie*/
  getCookie(name: string): string {
    const nameConsultar = name + '=' //constante que almacenara el nombre de la cookie
    const cookies = document.cookie.split(';')

    for (let cookie of cookies) {
      cookie = cookie.trim() //Eliminamos espacios
      if (cookie.indexOf(nameConsultar) === 0) return cookie.substring(nameConsultar.length) //si empieza por el nombre a consultar, entonces me retorna solo el valor
    }
    return ''
  }

  /*Metodo que elimina la cookie por el nombre*/
  deleteCookie(name: string) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' //fecha pasada para eliminar automaticamente la cookie
  }

  /*Metodo que retorna todas las cookies, dentro de una lista de objetos*/
  getAllCookies(): { name: string, value: string }[] {
    if (!document.cookie) return [] // si no hay cookies, retorna una lista vacia

    return document.cookie.split(';').map(cookie => {  //si hay cookies, dividimos en ; y con el .map
      const [name, ...val] = cookie.split('=')  // desestructuramos el arreglo que nos da luego de dividir cada cookie en un = en name y los valores los almacenamos en otro arreglo
      return { name: name.trim(), value: val.join('=') } // y retornamos un objeto que va a tener nombre, y valores, a los que les aplicamos el .join
    })
  }


}
