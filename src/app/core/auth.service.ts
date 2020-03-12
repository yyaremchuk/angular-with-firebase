import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { UserProfile } from './user-ptofile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly _afAuth: AngularFireAuth,
    private readonly _router: Router,
    private readonly _afs: AngularFirestore
  ) {}

  public logout() {
    this._afAuth.auth.signOut();
    this._router.navigate(['']);
  }

  public isLoggedIn(): boolean {
    return !!this._afAuth.auth.currentUser;
  }

  public createUserDocument() {
    const user = this._afAuth.auth.currentUser;
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      specialty: '',
      ip: ''
    };

    return this._afs.doc(`users/${user.uid}`).set(userProfile);
  }

  public updateUserDocument(userProfile: UserProfile) {
    return this._afs.doc(`users/${userProfile.uid}`).update(userProfile);
  }

  public async routeOnLogin() {
    const user = this._afAuth.auth.currentUser;
    const token = await user.getIdTokenResult();

    if (token.claims.admin) {
      this._router.navigate(['/users']);
    } else {
      this._router.navigate([`/profile/${user.uid}`]);
    }
  }
}
