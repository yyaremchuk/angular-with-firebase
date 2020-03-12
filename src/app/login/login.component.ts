import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public formGroup: FormGroup;
  action: 'login' | 'signup' = 'login';
  error: string;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _afAuth: AngularFireAuth,
    private readonly _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
  }

  public async onSubmit() {
    const { email, password, firstName, lastName } = this.formGroup.value;
    this.error = null;

    let resp;
    try {
      if (this.isSignUp()) {
        resp = await this._afAuth.auth.createUserWithEmailAndPassword(
          email,
          password
        );
        await resp.user.updateProfile({
          displayName: `${firstName} ${lastName}`
        });
        await this._auth.createUserDocument();
        this.formGroup.reset();
      } else {
        resp = await this._afAuth.auth.signInWithEmailAndPassword(
          email,
          password
        );
      }

      const uid = resp.user.uid;
      this._auth.routeOnLogin();
    } catch (error) {
      console.log(error);
      this.error = error;
    }
  }

  public isLogin() {
    return this.action === 'login';
  }

  public isSignUp() {
    return this.action === 'signup';
  }
}
