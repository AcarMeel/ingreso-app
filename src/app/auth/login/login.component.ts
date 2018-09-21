import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  public loading: boolean;
  public subscription: Subscription;
  constructor(private authService: AuthService,
              public store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ui').subscribe(ui => this.loading =  ui.isLoading);
  }

  public onSubmit(f) {
    this.authService.login(f);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
