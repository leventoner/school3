import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { AuthService } from '../../services/auth.service';
import { Teacher } from '../../models/models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-teacher-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900">Teachers</h2>
          <p class="text-gray-500 mt-1">Manage all faculty members</p>
        </div>
        <a *ngIf="canEdit" routerLink="/add-teacher" class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
          Add Teacher
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th class="px-8 py-4">ID</th>
              <th class="px-8 py-4">Name</th>
              <th class="px-8 py-4">Specialization</th>
              <th class="px-8 py-4">Contact</th>
              <th class="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let teacher of teachers" class="hover:bg-gray-50 transition">
              <td class="px-8 py-5 text-gray-500 font-medium">{{ teacher.id }}</td>
              <td class="px-8 py-5">
                <div class="font-bold text-gray-900">{{ teacher.firstName }} {{ teacher.lastName }}</div>
              </td>
              <td class="px-8 py-5">
                <span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">{{ teacher.specialization }}</span>
              </td>
              <td class="px-8 py-5 text-gray-600 text-sm">
                <div>{{ teacher.email }}</div>
                <div class="text-gray-400 mt-0.5">{{ teacher.phone }}</div>
              </td>
              <td class="px-8 py-5">
                <div class="flex space-x-3">
                  <ng-container *ngIf="canEdit">
                    <a [routerLink]="['/update-teacher', teacher.id]" class="text-amber-600 hover:text-amber-900 font-bold">Edit</a>
                    <button (click)="deleteTeacher(teacher.id!)" class="text-red-600 hover:text-red-900 font-bold">Delete</button>
                  </ng-container>
                </div>
              </td>
            </tr>
            <tr *ngIf="teachers.length === 0">
              <td colspan="5" class="px-8 py-10 text-center text-gray-500">No teachers found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class TeacherListComponent implements OnInit {
    teachers: Teacher[] = [];
    canEdit = false;

    constructor(
        private teacherService: TeacherService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const user = this.authService.currentUserValue;
        this.canEdit = user?.roles.includes('ROLE_ADMIN') || user?.roles.includes('ROLE_MODERATOR') || false;
        this.loadTeachers();
    }

    loadTeachers(): void {
        this.teacherService.getAll().subscribe(data => {
            this.teachers = data;
        });
    }

    deleteTeacher(id: number): void {
        if (confirm('Are you sure you want to delete this teacher?')) {
            this.teacherService.delete(id).subscribe(() => {
                this.loadTeachers();
            });
        }
    }
}
