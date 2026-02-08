import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GradeService } from '../../services/grade.service';
import { StudentService } from '../../services/student.service';
import { StudentGrade, Student } from '../../models/models';

@Component({
    selector: 'app-grade-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="mt-8 space-y-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-6">Enter Grade</h2>
        <form (ngSubmit)="saveGrade()" #gradeForm="ngForm" class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div class="md:col-span-1">
            <label class="block text-sm font-bold text-gray-700 mb-2">Student</label>
            <select [(ngModel)]="newGrade.studentId" name="studentId" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
              <option *ngFor="let s of students" [value]="s.id">{{ s.firstName }} {{ s.lastName }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Subject</label>
            <input type="text" [(ngModel)]="newGrade.subject" name="subject" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Mathematics">
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Score</label>
            <input type="number" [(ngModel)]="newGrade.score" name="score" required min="0" max="100" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Date</label>
            <input type="date" [(ngModel)]="newGrade.examDate" name="examDate" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
          </div>
          <button type="submit" [disabled]="!gradeForm.form.valid" class="py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
            Save Grade
          </button>
        </form>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-8 border-b border-gray-100">
          <h2 class="text-2xl font-bold text-gray-900">Grade Records</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th class="px-8 py-4">Student</th>
                <th class="px-8 py-4">Subject</th>
                <th class="px-8 py-4">Score</th>
                <th class="px-8 py-4">Date</th>
                <th class="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let g of grades" class="hover:bg-gray-50 transition">
                <td class="px-8 py-5 font-bold text-gray-900">{{ getStudentName(g.studentId) }}</td>
                <td class="px-8 py-5 text-gray-700">{{ g.subject }}</td>
                <td class="px-8 py-5">
                   <span class="font-bold text-lg" [ngClass]="g.score >= 50 ? 'text-green-600' : 'text-red-600'">{{ g.score }}</span>
                </td>
                <td class="px-8 py-5 text-gray-500">{{ g.examDate }}</td>
                <td class="px-8 py-5 text-right">
                  <button (click)="deleteGrade(g.id!)" class="text-red-600 hover:text-red-900 font-bold">Remove</button>
                </td>
              </tr>
              <tr *ngIf="grades.length === 0">
                <td colspan="5" class="px-8 py-10 text-center text-gray-500">No grade records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class GradeListComponent implements OnInit {
    grades: StudentGrade[] = [];
    students: Student[] = [];
    newGrade: StudentGrade = {
        studentId: 0,
        subject: '',
        score: 0,
        examDate: new Date().toISOString().split('T')[0]
    };

    constructor(
        private gradeService: GradeService,
        private studentService: StudentService
    ) { }

    ngOnInit(): void {
        this.loadStudents();
        this.loadGrades();
    }

    loadStudents(): void {
        this.studentService.getAll().subscribe(data => {
            this.students = data;
            if (this.students.length > 0) {
                this.newGrade.studentId = this.students[0].id!;
            }
        });
    }

    loadGrades(): void {
        this.gradeService.getAll().subscribe(data => {
            this.grades = data;
        });
    }

    saveGrade(): void {
        this.gradeService.create(this.newGrade).subscribe(() => {
            this.loadGrades();
        });
    }

    deleteGrade(id: number): void {
        if (confirm('Are you sure?')) {
            this.gradeService.delete(id).subscribe(() => {
                this.loadGrades();
            });
        }
    }

    getStudentName(id: number): string {
        const s = this.students.find(x => x.id === id);
        return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
    }
}
