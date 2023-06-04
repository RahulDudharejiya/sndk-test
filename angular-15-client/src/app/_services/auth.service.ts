import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';
const API_URL = 'http://localhost:8080/api/test/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(AUTH_API + 'signup', formData);
  }
  // register(
  //   username: string,
  //   firstname: string,
  //   lastname: string,
  //   email: string,
  //   password: string,
  //   profileImg: string
  // ): Observable<any> {
  //   console.log(profileImg, 'profileImg');

  //   return this.http.post(
  //     AUTH_API + 'signup',
  //     {
  //       username,
  //       firstname,
  //       lastname,
  //       email,
  //       password,
  //       profileImg,
  //     },
  //     httpOptions
  //   );
  // }

  update(
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    id: string
  ): Observable<any> {
    return this.http.post(
      API_URL + 'update',
      {
        username,
        firstname,
        lastname,
        email,
        id,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }
}
