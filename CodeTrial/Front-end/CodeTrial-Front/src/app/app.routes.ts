import { Routes } from '@angular/router';
import { Home } from './components/not-shared/home/home';
import { SignIn } from './components/not-shared/sign-in/sign-in';
import { Cookies } from './components/not-shared/cookies/cookies';
import { LogIn } from './components/not-shared/log-in/log-in';
import { authGuard } from './guards/auth-guard';
import { Courses } from './components/not-shared/courses/courses';
import { Profile } from './components/not-shared/profile/profile';
import { PythonCourse } from './components/not-shared/python-course/python-course';
import { About } from './components/not-shared/about/about';

export const routes: Routes = [
    {path: '', component: Home, pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'sign-in', component: SignIn},
    {path: 'cookies', component: Cookies},
    {path: 'log-in', component: LogIn},
    {path: 'about', component: About},
    {path: 'courses', component: Courses, canActivate: [authGuard]},
    {path: 'profile', component: Profile, canActivate: [authGuard]},
    {path: 'python-course', component: PythonCourse, canActivate: [authGuard]}
];
