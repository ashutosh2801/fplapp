import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, tap } from 'rxjs/operators';

export  interface User{
  account_id: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppHttpService {

  private user : User;
  allPosts = null;
  pages: any;

  httpHeader = {
    headers: new HttpHeaders({ 'Authorization': environment.Apikey, 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  public get(url: string) { 
    return this.http.get(environment.apiUrl + url, this.httpHeader)
    .pipe(
      tap(Student => console.log(url+' fetched!')),
      catchError(this.handleError<any>(url, []))
    ); 
  } 
  public post(url: string, data: any) { 
    return this.http.post(environment.apiUrl + url, data, this.httpHeader)
    .pipe(
      tap(Student => console.log(url+' fetched!')),
      catchError(this.handleError<any>(url, []))
    );
  } 
  public put(url: string, data: any) { 
    return this.http.put(environment.apiUrl + url, data, this.httpHeader)
    .pipe(
      tap(Student => console.log(url+' fetched!')),
      catchError(this.handleError<any>(url, []))
    );
  } 
  public delete(url: string) { 
    return this.http.delete(environment.apiUrl + url, this.httpHeader)
    .pipe(
      tap(Student => console.log(url+' fetched!')),
      catchError(this.handleError<any>(url, []))
    );
  } 

  public getAllPosts(page: number = 1): Observable<any[]> {
    let options = {
      observe: "response" as 'body',
      params: {
        per_page: '6',
        page: ''+page
      },
      headers: new HttpHeaders({ 'Authorization': environment.Apikey, 'Content-Type': 'application/json' })
    };
 
    return this.http.get<any[]>(`${environment.apiUrl}blog?_embed`, options)
    .pipe(
      map((res: any) => {
        this.pages = res['headers'].get('x-wp-totalpages');
        this.allPosts = res['headers'].get('x-wp-total');
        return res['body'];
      })
    )
  }

  public setUser(user: User){
    return this.user = user;
  }

  public getUserID(): string{
    return this.user.user_id;
  }

  public getAccountID(): string{
    return this.user.account_id;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
