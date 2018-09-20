import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';

import { map } from "rxjs/operators";

import Swal from 'sweetalert2';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore) { }
  
  initAuthListener() {
    this.afAuth.authState.subscribe(fbUser => {
      console.info(`From auth.service ${fbUser}`);
    });
  }

  public createUser(data) {
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
      })
    })
    .catch(err => {
      console.error(err);
      Swal('Signup error', err.message, 'error');
    });
  }

  public login(data) {
    this.afAuth.auth
    .signInWithEmailAndPassword(data.email, data.password)
    .then(res => {
      console.info(res);
      this.router.navigate(['/']);
      Swal('Login success', `Welcome ${res.user.email}`, 'success');
    })
    .catch(err => {
      console.error(err);
      Swal('Login error', err.message, 'error');
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
