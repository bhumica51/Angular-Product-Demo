import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { product } from '../shared/product';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class httpservices {
    List = []

    constructor(private http: HttpClient) { }


    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'localhost:4200',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',

        })
    }

    getProductList(queryString): Observable<[product]> {
        var apiURL = 'http://localhost:3000/api/products';
        if (queryString) {
            apiURL += '?';
            for (const param of Object.keys(queryString)) {
                apiURL += param + '=' + encodeURIComponent(queryString[param]) + '&';
            }
            // remove last '&'
            apiURL = apiURL.substring(0, apiURL.length - 1)
          }
        return this.http.get<[product]>(apiURL , this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }
}