import { Injector } from '@angular/core';
import { RequestOptionsArgs, Response } from '@angular/http';
import { HttpInterceptor } from 'ng-jhipster';
import { Observable } from 'rxjs/Observable';
import { AuthServerProvider } from '../../shared/auth/auth-oauth2.service';
import { AuthService } from '../../shared/auth/auth.service';
import { Principal } from '../../shared/auth/principal.service';

export class AuthExpiredInterceptor extends HttpInterceptor {

    constructor(private injector: Injector) {
        super();
    }

    requestIntercept(options?: RequestOptionsArgs): RequestOptionsArgs {
        return options;
    }

    responseIntercept(observable: Observable<Response>): Observable<Response> {
        return <Observable<Response>> observable.catch((error, source) => {
            if (error.status === 401) {
                const principal: Principal = this.injector.get(Principal);

                if (principal.isAuthenticated()) {
                    const auth: AuthService = this.injector.get(AuthService);
                    auth.authorize(true);
                } else {
                    const authServerProvider: AuthServerProvider = this.injector.get(AuthServerProvider);
                    authServerProvider.logout();
                }
            }
            return Observable.throw(error);
        });
    }
}
