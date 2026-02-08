import { Component, OnInit } from '@angular/core';
import { ClassroomService } from '../../services/classroom.service';
import { AuthService } from '../../services/auth.service';
import { Classroom } from '../../models/models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-classroom-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900">Classrooms</h2>
          <p class="text-gray-500 mt-1">Manage physical space and resources</p>
        </div>
        <a *ngIf="canEdit" routerLink="/add-classroom" class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
          Add Classroom
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th class="px-8 py-4">Room No</th>
              <th class="px-8 py-4">Type</th>
              <th class="px-8 py-4">Capacity</th>
              <th class="px-8 py-4">Floor</th>
              <th class="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let room of classrooms" class="hover:bg-gray-50 transition">
              <td class="px-8 py-5">
                <div class="font-bold text-gray-900">{{ room.roomNumber }}</div>
              </td>
              <td class="px-8 py-5">
                <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">{{ room.roomType }}</span>
              </td>
              <td class="px-8 py-5 text-gray-600 font-medium">{{ room.capacity }} Seats</td>
              <td class="px-8 py-5 text-gray-500">{{ room.floor }}</td>
              <td class="px-8 py-5">
                <div class="flex space-x-3">
                  <ng-container *ngIf="canEdit">
                    <a [routerLink]="['/update-classroom', room.id]" class="text-amber-600 hover:text-amber-900 font-bold">Edit</a>
                    <button (click)="deleteClassroom(room.id!)" class="text-red-600 hover:text-red-900 font-bold">Delete</button>
                  </ng-container>
                </div>
              </td>
            </tr>
            <tr *ngIf="classrooms.length === 0">
              <td colspan="5" class="px-8 py-10 text-center text-gray-500">No classrooms found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClassroomListComponent implements OnInit {
    classrooms: Classroom[] = [];
    canEdit = false;

    constructor(
        private classroomService: ClassroomService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const user = this.authService.currentUserValue;
        this.canEdit = user?.roles.includes('ROLE_ADMIN') || user?.roles.includes('ROLE_MODERATOR') || false;
        this.loadClassrooms();
    }

    loadClassrooms(): void {
        this.classroomService.getAll().subscribe(data => {
            this.classrooms = data;
        });
    }

    deleteClassroom(id: number): void {
        if (confirm('Are you sure you want to delete this classroom?')) {
            this.classroomService.delete(id).subscribe(() => {
                this.loadClassrooms();
            });
        }
    }
}
