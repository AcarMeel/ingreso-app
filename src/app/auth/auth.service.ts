import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';

import { map } from "rxjs/operators";
import { Store } from "@ngrx/store";

import Swal from 'sweetalert2';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';
import { ActivateLoadingAction, DeactivateLoadingAction } from '../shared/ui.actions';
import { setUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private subscription: Subscription = new Subscription();
  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store: Store<AppState>) { }
  
  initAuthListener() {
    this.afAuth.authState.subscribe(fbUser => {
      if (fbUser) {
        this.subscription = this.afDB.doc(`${fbUser.uid}/user`)
                          .valueChanges()
                          .subscribe((user: any) => {
                            const newUser = new User(user);
                            this.store.dispatch(new setUserAction(newUser));
                          })
      } else {
        this.subscription.unsubscribe();
      }
    });
  }

  public createUser(data) {
    this.store.dispatch(new ActivateLoadingAction());
    this.afAuth.auth
    .createUserWithEmailAndPassword(data.email, data.password)
    .then(res => {
      // save data to model
      const user: User = {
        uid: res.user.uid,
        name: data.name,
        email: res.user.email
      };
      // create a new collection in the DB with User schema
      this.afDB.doc(`${user.uid}/user`)
      .set(user)
      .then(() => {
        // navigate to dashboard
        this.router.navigate(['/']);
        Swal('Account created', `Welcome ${res.user.email}`, 'success');
        this.store.dispatch(new DeactivateLoadingAction());
      })
    })
    .catch(err => {
      this.store.dispatch(new DeactivateLoadingAction());
      Swal('Signup error', err.message, 'error');
    });
  }

  public login(data) {
    this.store.dispatch(new ActivateLoadingAction());
    this.afAuth.auth
    .signInWithEmailAndPassword(data.email, data.password)
    .then(res => {
      this.router.navigate(['/']);
      Swal('Login success', `Welcome ${res.user.email}`, 'success');
      this.store.dispatch(new DeactivateLoadingAction());
    })
    .catch(err => {
      Swal('Login error', err.message, 'error');
      this.store.dispatch(new DeactivateLoadingAction());
    });
  }

  public logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

  public isAuth() {
    return this.afAuth.authState
    .pipe(
      map(fbUser => {
        if (fbUser === null) {
          this.router.navigate(['/login']);
        }
          return fbUser !== null;
      })
    )
  }

}
