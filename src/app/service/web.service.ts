import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, finalize, map, tap, throwError, timeout } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";


@Injectable()
export class WebService {

    baseUrl: string = "http://localhost:8080";
    baseUrl1: string = "http://localhost:8090";
    timeOut: number = 100000;
    serviceUrlMap: any = {};

    constructor(private spinner: NgxSpinnerService,private httpClient: HttpClient){
        this.serviceUrlMap['api/text/generateCaptcha'] = this.baseUrl;
        this.serviceUrlMap['stationData'] = 'https://www.irctc.co.in/eticketing/protected/mapps1';
        this.serviceUrlMap['trainList'] = 'https://www.irctc.co.in/eticketing';
    }

    getBaseUrl(service: string){
        let url = this.serviceUrlMap[service];
        if(url == undefined){
            url = this.baseUrl1;
        }
        return url;
    }

    get(serviceName: string): Observable<any> {
        if (serviceName !== "api/text/generateCaptcha"){
            this.spinner.show();
        }
        let headers = new HttpHeaders()
                      .set('Content-Type', 'application/x-www-form-urlencoded')
                      .set('Accept', 'application/json, text/plain');
        headers = headers.set('greq', "1710409466242");
        const url = `${this.getBaseUrl(serviceName)}/${serviceName}`;
  
        return this.httpClient.get<any>(url, {
            headers: headers,
            observe: 'response'
        }).pipe(
        tap(resp => {
            console.log(resp.headers.get('Set-Cookie'));
        }),
        map(resp => {
            return resp.body;
        }),
            catchError(this.handleError),
            finalize(() => {
                this.spinner.hide();
            })
            
        );
    }
    post(serviceName: string , data : any): Observable<any> {
        this.spinner.show();
        let headers = new HttpHeaders()
                      .set('Content-Type', 'application/json')
                      .set('Accept', 'application/json, text/plain');
        //headers = headers.set('lso', lsodata);
        const url = `${this.getBaseUrl(serviceName)}/${serviceName}`;
  
        return this.httpClient.post<any>(url, data,{
            headers: headers,
            observe: 'response'
        }).pipe(
            tap(resp => {
                console.log(resp.headers.get('Set-Cookie'));
            }),
            map(resp => {
                return resp.body;
            }),
            catchError(this.handleError),
            finalize(() => {
                this.spinner.hide();
            }));
    }
    getString(serviceName: string): Observable<string> {
        this.spinner.show();
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json, text/plain');

        const url = `${this.getBaseUrl(serviceName)}/${serviceName}`;

        return this.httpClient.get(url, {
            headers: headers,
            responseType: 'text'
        }).pipe(
            catchError(this.handleError),
            finalize(() => {
                this.spinner.hide();
            })
        );
    }
    private handleError(error: HttpErrorResponse | any) {
        console.error('An error occurred:', error);

        // Create a structured error object for user-friendly display
        const errorMessage = error.error || 'Something went wrong';
        const friendlyError = {
            status: error.status,
            message: errorMessage,
            // Additional details as needed
        };
        console.log(friendlyError)

        // Display the error toast
        // this.displayErrorToast(friendlyError);

        // Return a new observable with the error object
        return throwError(friendlyError);
    }
}
