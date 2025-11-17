import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { GetProfileResponse } from '../../../interfaces/get-profile-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit{
  auth = inject(Auth)
  router = inject(Router)

  message:string = '' 
  email: string = ''
  profile!: GetProfileResponse

  getProgress(course: { lessons: any[] }): number {
    const total = course.lessons.length;
    const completed = course.lessons.filter(lesson => lesson.isCompleted).length;
    console.log(course.lessons);
    return total ? Math.round((completed / total) * 100) : 0;
  }

  loadProfile(){
    this.auth.getPerfil().subscribe({
      next: (res => {
        this.message = res.message
        this.email = res.user.email
        this.profile = res
        
      })
    })
  }

  openPython(){
    this.router.navigate(['/python-course'])
  }
  
  ngOnInit(): void {
    this.loadProfile();
    this.getProgress
  }
  
}
