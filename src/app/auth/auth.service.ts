import { TrainingService } from './../training/training.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';

import { UIService } from '../shared/ui.service';
import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.isAuthenticated = false;
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(authResult => this.uiService.loadingStateChanged.next(false))
      .catch(err => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBarMessage(err.message, null, 3500);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(authResult => this.uiService.loadingStateChanged.next(false))
      .catch(err => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackBarMessage(err.message, null, 3500);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
