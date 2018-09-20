import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';

import { map } from "rxjs/operators";

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private router: Router) { }
  
  initAuthListener() {
    this.afAuth.authState.subscribe(fbUser => {
      console.info(`From auth.service ${fbUser}`);
    });
  }

  public createUser(data) {
    this.afAuth.auth
    .createUserWithEmailAndPassword(data.email, data.password)
    .then(res => {
      console.info(res);
      this.router.navigate(['/']);
      Swal('Account created', `Welcome ${res.user.email}`, 'success');
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
