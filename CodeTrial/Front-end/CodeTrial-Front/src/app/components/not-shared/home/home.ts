import { Component, ElementRef, OnInit, ViewChildren, AfterViewInit, QueryList } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit{

  //Animacion de scroll 
  @ViewChildren('observado') observados!: QueryList<ElementRef>

  ngAfterViewInit(){
    const observador = new IntersectionObserver(
      entries => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement
        if(entry.isIntersecting){
          el.classList.add('visible')
        } else {
          el.classList.remove('visible')
        }
      })
    })
    this.observados.forEach(el => observador.observe(el.nativeElement))
  }
}
