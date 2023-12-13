import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export  interface User{
  account_id: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private user : User;
  private _user_id = new BehaviorSubject<string>(null);

  public setUserInfo(val: string) {
    this._user_id.next(val);
  }

  public getUserInfo(): Observable<string> {
    return this._user_id;
  }

  httpHeader = {
    headers: new HttpHeaders({ 'Authorization': environment.Apikey, 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  addData(formData: any, type: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl + type}`, formData, this.httpHeader)
      .pipe(catchError(this.handleError(type)));
  }

  login(formData: any, type: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl + type}`, formData, this.httpHeader)
      .pipe(  
        //tap(_ => console.log(`Student fetched: ${page}`)),
        catchError(this.handleError('Login'))
      );
  } 
  
  postData(formData: any, type: string): Observable<any> {   
    return this.http
      .post(`${environment.apiUrl + type}`, formData, this.httpHeader)
      .pipe( catchError(this.handleError(type)) ); 
  }
  
  // setUser(user: User){
  //   return this.user = user;
  // }

  // getUserID(): string{
  //   return this.user.user_id;
  // }

  // getAccountID(): string{
  //   return this.user.account_id;
  // }

  getData(page: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl + page}`)
      .pipe(
        tap(_ => console.log(`Student fetched: ${page}`)),
        catchError(this.handleError<any>(`Get student id=${page}`))
      );
  }

  getStudentList(): Observable<any> {
    return this.http.get<any>('api-goes-here/')
      .pipe(
        tap(Student => console.log('Student fetched!')),
        catchError(this.handleError<any>('Get student', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
