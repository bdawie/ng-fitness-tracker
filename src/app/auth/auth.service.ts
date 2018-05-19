import { Injectable } from '@angular/core';

import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  constructor(private router: Router) {}

  private user: User;
  authChange = new Subject<boolean>();

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authSuccessful();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    };
    this.authSuccessful();
  }

  getUser() {
    return {...this.user};
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  isAuth() {
    return this.user != null;
  }

  private authSuccessful() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
