import { Injectable } from '@angular/core';
import {map, of} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {authState} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class UserService {


  isAdmin = of(true);

  constructor(private auth: AuthService) {

  }

  login() {

  }
}
