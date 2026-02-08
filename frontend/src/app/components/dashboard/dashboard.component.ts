import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="mt-12 space-y-12">
      <!-- Welcome Section -->
      <div class="bg-indigo-600 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10">
          <h1 class="text-4xl font-extrabold mb-4">Welcome to School Management System</h1>
          <p class="text-indigo-100 text-lg max-w-2xl">Manage your students, teachers, classrooms, library, attendance, and grades all in one place. Efficient, fast, and secure.</p>
        </div>
        <div class="absolute right-0 top-0 h-full w-1/3 bg-indigo-500 transform skew-x-12 opacity-50"></div>
        <div class="absolute right-20 top-0 h-full w-1/3 bg-indigo-400 transform skew-x-12 opacity-30"></div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Students Card -->
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span class="text-3xl font-extrabold text-gray-900">{{ stats?.total_students || 0 }}</span>
          </div>
          <h3 class="text-gray-500 font-bold text-sm uppercase tracking-wider">Total Students</h3>
        </div>

        <!-- Teachers Card -->
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-50 text-green-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-3xl font-extrabold text-gray-900">{{ stats?.total_teachers || 0 }}</span>
          </div>
          <h3 class="text-gray-500 font-bold text-sm uppercase tracking-wider">Total Teachers</h3>
        </div>

        <!-- Classrooms Card -->
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span class="text-3xl font-extrabold text-gray-900">{{ stats?.total_classrooms || 0 }}</span>
          </div>
          <h3 class="text-gray-500 font-bold text-sm uppercase tracking-wider">Classrooms</h3>
        </div>

        <!-- Books Card -->
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-3xl font-extrabold text-gray-900">{{ stats?.total_books || 0 }}</span>
          </div>
          <h3 class="text-gray-500 font-bold text-sm uppercase tracking-wider">Total Books</h3>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
    stats?: DashboardStats;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getStats().subscribe(data => {
            this.stats = data;
        });
    }
}
