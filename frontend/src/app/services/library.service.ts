import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/models';

const API_URL = 'http://localhost:8084/api/books/';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Book[]> {
        return this.http.get<Book[]>(API_URL);
    }

    get(id: number): Observable<Book> {
        return this.http.get<Book>(API_URL + id);
    }

    create(data: any): Observable<any> {
        return this.http.post(API_URL, data);
    }

    update(id: number, data: any): Observable<any> {
        return this.http.put(API_URL + id, data);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(API_URL + id);
    }
}
