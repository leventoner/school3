import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassroomService } from '../../services/classroom.service';
import { Classroom } from '../../models/models';

@Component({
    selector: 'app-add-classroom',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="max-w-2xl mx-auto mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="p-10">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900">{{ isEditMode ? 'Update' : 'Add New' }} Classroom</h2>
          <a routerLink="/classrooms" class="text-gray-400 hover:text-gray-600 transition">
             <span class="text-sm font-bold">Cancel</span>
          </a>
        </div>

        <form (ngSubmit)="saveClassroom()" #roomForm="ngForm" class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Room Number</label>
              <input type="text" [(ngModel)]="room.roomNumber" name="roomNumber" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none" placeholder="e.g. 101, Lab-A">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
              <input type="number" [(ngModel)]="room.capacity" name="capacity" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Room Type</label>
            <select [(ngModel)]="room.roomType" name="roomType" required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="Science Lab">Science Lab</option>
              <option value="Library">Library</option>
              <option value="Gymnasium">Gymnasium</option>
              <option value="Art Studio">Art Studio</option>
              <option value="Office">Office</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Floor</label>
            <input type="number" [(ngModel)]="room.floor" name="floor" required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
          </div>

          <button type="submit" [disabled]="!roomForm.form.valid"
            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-100 mt-4">
            {{ isEditMode ? 'Update Classroom' : 'Create Classroom' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class AddClassroomComponent implements OnInit {
    room: Classroom = {
        roomNumber: '',
        capacity: 30,
        roomType: 'Lecture Hall',
        floor: 0
    };
    isEditMode = false;
    roomId?: number;

    constructor(
        private classroomService: ClassroomService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.roomId = this.route.snapshot.params['id'];
        if (this.roomId) {
            this.isEditMode = true;
            this.classroomService.get(this.roomId).subscribe(data => {
                this.room = data;
            });
        }
    }

    saveClassroom(): void {
        if (this.isEditMode) {
            this.classroomService.update(this.roomId!, this.room).subscribe(() => {
                this.router.navigate(['/classrooms']);
            });
        } else {
            this.classroomService.create(this.room).subscribe(() => {
                this.router.navigate(['/classrooms']);
            });
        }
    }
}
