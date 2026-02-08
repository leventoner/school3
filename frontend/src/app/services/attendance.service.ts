import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/models';

const API_URL = 'http://localhost:8084/api/attendance/';

@Injectable({
    providedIn: 'root'
})
export class AttendanceService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(API_URL);
    }

    getByStudent(studentId: number): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(`${API_URL}student/${studentId}`);
    }

    create(data: Attendance): Observable<any> {
        return this.http.post(API_URL, data);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(API_URL + id);
    }
}
