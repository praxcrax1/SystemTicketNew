import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, tap, timeout } from "rxjs";


@Injectable()
export class WebService {

    baseUrl: string = "http://localhost:8080";
    timeOut: number = 10000;

    constructor(private httpClient: HttpClient){

    }

    get(serviceName: string): Observable<any> {
        let headers = new HttpHeaders()
                      .set('Content-Type', 'application/x-www-form-urlencoded')
                      .set('Accept', 'application/json, text/plain');
        //headers = headers.set('lso', lsodata);
        const url = `${this.baseUrl}/${serviceName}`;
  
        return this.httpClient.get<any>(url, {
            headers: headers,
            observe: 'response'
        }).pipe(timeout(this.timeOut),
        tap(resp => {
            console.log(resp.headers.get('Set-Cookie'));
        }, (err: HttpErrorResponse) => this.checkErrorStatus(err, serviceName)),
        map(resp => {
            return resp.body;
        }));
    }

    checkErrorStatus(err, serviceName){
        console.log(err);
    }
}
