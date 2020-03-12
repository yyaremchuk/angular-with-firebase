import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-with-firebase';

  constructor(public readonly authService: AuthService) {}

  public logout() {
    this.authService.logout();
  }
}
