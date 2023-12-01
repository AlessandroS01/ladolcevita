import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "../../shared/services/model/user/user.service";
import {AuthService} from "../../shared/services/auth/auth.service";
import {map, Observable, of, switchMap} from "rxjs";

export const adminGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.getLoggedUser().pipe(
    map( user => {
      if (user != null && user.isAdmin) {
        return true;
      }
      else {
        router.navigate(['/unauthorized']);
        return false;
      }
      }
    )
  )
};
