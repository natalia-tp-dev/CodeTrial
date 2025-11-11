import { Routes } from '@angular/router';
import { Home } from './components/not-shared/home/home';
import { SignIn } from './components/not-shared/sign-in/sign-in';
import { Cookies } from './components/not-shared/cookies/cookies';

export const routes: Routes = [
    {path: '', component: Home, pathMatch: 'full'},
    {path: 'home', component: Home},
    {path: 'sign-in', component: SignIn},
    {path: 'cookies', component: Cookies}
];
