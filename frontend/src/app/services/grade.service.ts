import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentGrade } from '../models/models';

const API_URL = 'http://localhost:8084/api/grades/';

@Injectable({
    providedIn: 'root'
})
export class GradeService {
    constructor(private http: HttpClient) { }

    getAll(): Observable<StudentGrade[]> {
        return this.http.get<StudentGrade[]>(API_URL);
    }

    getByStudent(studentId: number): Observable<StudentGrade[]> {
        return this.http.get<StudentGrade[]>(`${API_URL}student/${studentId}`);
    }

    create(data: StudentGrade): Observable<any> {
        return this.http.post(API_URL, data);
    }

    update(id: number, data: StudentGrade): Observable<any> {
        return this.http.put(API_URL + id, data);
    }

    delete(id: number): Observable<any> {
        return this.http.delete(API_URL + id);
    }
}
