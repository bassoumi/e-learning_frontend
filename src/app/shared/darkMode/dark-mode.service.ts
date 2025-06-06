import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  private darkMode$ = new BehaviorSubject<boolean>(false);
  // Observable auquel les composants peuvent s'abonner
  darkModeChanges$ = this.darkMode$.asObservable();

  toggle() {
    this.darkMode$.next(!this.darkMode$.value);
  }

  setDarkMode(value: boolean) {
    this.darkMode$.next(value);
  }

}
