import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../../services/attendance.service';
import { StudentService } from '../../services/student.service';
import { Attendance, Student } from '../../models/models';

@Component({
    selector: 'app-attendance-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="mt-8 space-y-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Record Attendance</h2>
        <form (ngSubmit)="recordAttendance()" #attendanceForm="ngForm" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Student</label>
            <select [(ngModel)]="newAttendance.studentId" name="studentId" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
              <option *ngFor="let s of students" [value]="s.id">{{ s.firstName }} {{ s.lastName }} ({{ s.schoolNumber }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Date</label>
            <input type="date" [(ngModel)]="newAttendance.date" name="date" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Status</label>
            <select [(ngModel)]="newAttendance.status" name="status" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
          <button type="submit" [disabled]="!attendanceForm.form.valid" class="py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
            Save Record
          </button>
        </form>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 border-b border-gray-100">
          <h2 class="text-2xl font-bold text-gray-900">Attendance History</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th class="px-8 py-4">Student</th>
                <th class="px-8 py-4">Date</th>
                <th class="px-8 py-4">Status</th>
                <th class="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let record of attendanceRecords" class="hover:bg-gray-50 transition">
                <td class="px-8 py-5">
                  <div class="font-bold text-gray-900">{{ getStudentName(record.studentId) }}</div>
                </td>
                <td class="px-8 py-5 text-gray-600">{{ record.date }}</td>
                <td class="px-8 py-5">
                  <span [ngClass]="{
                    'bg-green-50 text-green-700': record.status === 'Present',
                    'bg-red-50 text-red-700': record.status === 'Absent',
                    'bg-amber-50 text-amber-700': record.status === 'Late'
                  }" class="px-3 py-1 rounded-full text-xs font-bold">{{ record.status }}</span>
                </td>
                <td class="px-8 py-5">
                  <button (click)="deleteRecord(record.id!)" class="text-red-600 hover:text-red-900 font-bold">Delete</button>
                </td>
              </tr>
              <tr *ngIf="attendanceRecords.length === 0">
                <td colspan="4" class="px-8 py-10 text-center text-gray-500">No attendance records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AttendanceListComponent implements OnInit {
    attendanceRecords: Attendance[] = [];
    students: Student[] = [];
    newAttendance: Attendance = {
        studentId: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
    };

    constructor(
        private attendanceService: AttendanceService,
        private studentService: StudentService
    ) { }

    ngOnInit(): void {
        this.loadStudents();
        this.loadAttendance();
    }

    loadStudents(): void {
        this.studentService.getAll().subscribe(data => {
            this.students = data;
            if (this.students.length > 0) {
                this.newAttendance.studentId = this.students[0].id!;
            }
        });
    }

    loadAttendance(): void {
        this.attendanceService.getAll().subscribe(data => {
            this.attendanceRecords = data;
        });
    }

    recordAttendance(): void {
        this.attendanceService.create(this.newAttendance).subscribe(() => {
            this.loadAttendance();
        });
    }

    deleteRecord(id: number): void {
        if (confirm('Delete this record?')) {
            this.attendanceService.delete(id).subscribe(() => {
                this.loadAttendance();
            });
        }
    }

    getStudentName(id: number): string {
        const s = this.students.find(x => x.id === id);
        return s ? `${s.firstName} ${s.lastName}` : 'Unknown Student';
    }
}
