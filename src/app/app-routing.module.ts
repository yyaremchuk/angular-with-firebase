import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  customClaims
} from '@angular/fire/auth-guard';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToProfile = () =>
  map(user => (user ? ['profile', (user as any).uid] : true));

const onlyAllowSelf = next =>
  map(user => (!!user && next.params.id == (user as any).uid) || []);

const adminOnly = () =>
  pipe(
    customClaims,
    map((claims: { admin: boolean }) => claims.admin === true || [''])
  );

const redirectLoggedInToProfileOrUsers = () =>
  pipe(
    customClaims,
    map((claims: { [key: string]: any }) => {
      if (claims.length === 0) {
        return true;
      }

      if (claims.admin) {
        return ['users'];
      }

      return ['profile', claims.user_id];
    })
  );

const onlyAllowSelfOrAdmin = next =>
  pipe(
    customClaims,
    map((claims: { [key: string]: any }) => {
      if (claims.length === 0) {
        return [''];
      }

      return next.params.id === claims.user_id || claims.admin === true;
    })
  );

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToProfileOrUsers
    }
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: onlyAllowSelfOrAdmin
    }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: adminOnly
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
