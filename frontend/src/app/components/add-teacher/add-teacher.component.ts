import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/models';

@Component({
    selector: 'app-add-teacher',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="max-w-2xl mx-auto mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="p-10">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900">{{ isEditMode ? 'Update' : 'Add New' }} Teacher</h2>
          <a routerLink="/teachers" class="text-gray-400 hover:text-gray-600 transition">
             <span class="text-sm font-bold">Cancel</span>
          </a>
        </div>

        <form (ngSubmit)="saveTeacher()" #teacherForm="ngForm" class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">First Name</label>
              <input type="text" [(ngModel)]="teacher.firstName" name="firstName" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
              <input type="text" [(ngModel)]="teacher.lastName" name="lastName" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input type="email" [(ngModel)]="teacher.email" name="email" required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input type="text" [(ngModel)]="teacher.phone" name="phone" required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Specialization (Branch)</label>
            <input type="text" [(ngModel)]="teacher.specialization" name="specialization" required placeholder="e.g. Mathematics"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
          </div>

          <button type="submit" [disabled]="!teacherForm.form.valid"
            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-100 mt-4">
            {{ isEditMode ? 'Update Teacher Profile' : 'Register Teacher' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class AddTeacherComponent implements OnInit {
    teacher: Teacher = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: ''
    };
    isEditMode = false;
    teacherId?: number;

    constructor(
        private teacherService: TeacherService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.teacherId = this.route.snapshot.params['id'];
        if (this.teacherId) {
            this.isEditMode = true;
            this.teacherService.get(this.teacherId).subscribe(data => {
                this.teacher = data;
            });
        }
    }

    saveTeacher(): void {
        if (this.isEditMode) {
            this.teacherService.update(this.teacherId!, this.teacher).subscribe(() => {
                this.router.navigate(['/teachers']);
            });
        } else {
            this.teacherService.create(this.teacher).subscribe(() => {
                this.router.navigate(['/teachers']);
            });
        }
    }
}
