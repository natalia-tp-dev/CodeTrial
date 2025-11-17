import { Component, ElementRef, inject, OnInit, output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../services/auth';
import { GetProfileResponse } from '../../../interfaces/get-profile-response';
import { UpdateCodeData } from '../../../interfaces/update-code-data';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-python-course',
  imports: [FormsModule],
  templateUrl: './python-course.html',
  styleUrl: './python-course.css'
})
export class PythonCourse implements OnInit {

  @ViewChild('instrucciones') instrucciones!: ElementRef
  @ViewChild('output') ouput!: ElementRef
  @ViewChild('isCompleted') isCompleted!: ElementRef

  indiceSeleccionadoLeccion: number = 0
  auth = inject(Auth)
  profile: GetProfileResponse | null = null
  codigo: string = ''
  data: UpdateCodeData = {
    code: this.codigo,
    lessonNumber: 0
  }

  loadProfile() {
    this.auth.getPerfil().subscribe({
      next: (res) => {
        this.profile = res
        console.log(this.profile);
      }
    })
  }

  agregarInstrucciones(index: number) {
    this.indiceSeleccionadoLeccion = index

    switch (index) {
      case 0:
        this.instrucciones.nativeElement.textContent = `Welcome to your very first Python lesson!
        In this exercise, you will learn the simplest and most fundamental action in any programming language: displaying a message on the screen.
        Your task is to write a line of code that prints "Hello World". This lesson is meant to help you understand how Python outputs information and how the print() function works.
        It is a small first step, but an essential one in your programming journey!`
        this.indiceSeleccionadoLeccion = 0
        break
      case 1:
        this.instrucciones.nativeElement.textContent = `In this lesson, you will practice printing a numeric value in Python.
        Your goal is to use the print() function to display the number 4 on the screen.
        This exercise helps you understand how Python handles numbers and ensures you are comfortable printing different types of values.
        It is a simple but important foundation before moving on to more complex data types.`
        this.indiceSeleccionadoLeccion = 1
        break
      case 2:
        this.instrucciones.nativeElement.textContent = `This lesson focuses on printing a boolean value in Python.
        Your task is to use the print() function to display the boolean value True.
        Booleans are essential in programming because they help your code make decisions.
        With this exercise, you will understand how Python represents logical values.`
        this.indiceSeleccionadoLeccion = 2
        break
    }

    this.auth.getCode(this.indiceSeleccionadoLeccion + 1).subscribe({
      next: (res) => {
        console.log(res.code);
        if (res.code !== '') {
          this.codigo = res.code
        } else {
          this.codigo = '#You do not have any saved code in lesson ' + (this.indiceSeleccionadoLeccion + 1)
        }
      }
    })
  }

  execute() {
    this.data = {
      code: this.codigo,
      lessonNumber: this.indiceSeleccionadoLeccion + 1
    }
    this.auth.executeCode(this.data).subscribe({
      next: (res) => {
        this.ouput.nativeElement.textContent = res.output
        if (res.isCompleted) {
          Swal.fire({
            title: 'Congratulations!',
            icon: 'success',
            text: 'The lesson was succesfully completed'
          })
          this.isCompleted.nativeElement.textContent = 'COMPLETED'
          this.auth.updateState(true, this.indiceSeleccionadoLeccion + 1).subscribe({})
          this.auth.getPerfil().subscribe(profile => {
            this.profile = profile;
          });
        }
      },
      error: (httpError: HttpErrorResponse) => {
        const status = httpError.status
        const error = httpError.error.error
        if (status === 400) {
          Swal.fire({
            icon: 'error',
            title: error,
            text: 'Please choose a lesson and enter some code to start'
          })
        } else if (status === 500) {
          Swal.fire({
            icon: 'error',
            title: error,
            text: 'Code is not valid, try again please'
          })
        }
      }
    })
  }

  guardar() {
    this.data = {
      code: this.codigo,
      lessonNumber: this.indiceSeleccionadoLeccion + 1
    }
    this.auth.updateCode(this.data).subscribe({
      next: (res) => {
        Swal.fire({
          title: res.message,
          icon: 'success',
          text: 'You can keep coding now'
        })
      },
      error: (httpError: HttpErrorResponse) => {
        const status = httpError.status
        const error = httpError.error.error
        if (status === 400) {
          Swal.fire({
            icon: 'error',
            title: error,
            text: 'Please choose a lesson and enter some code to start'
          })
        } else if (status === 500) {
          Swal.fire({
            icon: 'error',
            title: error,
            text: 'Code is not valid, try again please'
          })
        }
      }
    })
  }

  ngOnInit(): void {
    this.loadProfile()


  }
}
