import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../models/models';

const API_URL = 'http://localhost:8084/api/teachers/';

@Injectable({
    providedIn: 'root'
})
export class TeacherService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Teacher[]> {
        return this.http.get<Teacher[]>(API_URL);
    }

    get(id: number): Observable<Teacher> {
        return this.http.get<Teacher>(API_URL + id);
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
