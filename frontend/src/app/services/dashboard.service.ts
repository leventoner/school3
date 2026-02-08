import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8084/api/dashboard';

export interface DashboardStats {
    total_students: number;
    total_teachers: number;
    total_classrooms: number;
    total_books: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    constructor(private http: HttpClient) { }

    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(API_URL);
    }
}
