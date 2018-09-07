import { TrainingService } from './../training/training.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as AUTH from '../auth/auth.actions';

import { UIService } from '../shared/ui.service';
import { AuthData } from './auth-data.model';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(new AUTH.Authenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new AUTH.NotAuthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(authResult => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(err => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackBarMessage(err.message, null, 3500);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(authResult => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(err => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackBarMessage(err.message, null, 3500);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}

