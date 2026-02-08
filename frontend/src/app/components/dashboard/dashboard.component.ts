import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-8 space-y-12 animate-fade-in">
      <!-- Hero / Welcome Section -->
      <div class="relative bg-gradient-to-r from-indigo-900 to-blue-800 rounded-3xl p-12 text-white shadow-2xl overflow-hidden">
        <!-- Abstract Science Background Pattern -->
        <div class="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <circle cx="80%" cy="50%" r="150" fill="white" fill-opacity="0.1" />
                <circle cx="20%" cy="80%" r="100" fill="white" fill-opacity="0.05" />
            </svg>
        </div>
        
        <div class="relative z-10 max-w-3xl">
          <span class="inline-block py-1 px-3 rounded-full bg-blue-500/30 text-blue-100 text-sm font-semibold mb-4 backdrop-blur-sm border border-blue-400/30">Academic Dashboard</span>
          <h1 class="text-5xl font-extrabold mb-6 tracking-tight leading-tight">Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-300">EduScience</span></h1>
          <p class="text-blue-100/90 text-xl font-light leading-relaxed">
            Empowering education through technology. Manage your scientific community with precision—from student grades to laboratory resources.
          </p>
          <div class="mt-8 flex gap-4">
            <button class="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition transform hover:-translate-y-1">Get Started</button>
            <button class="px-6 py-3 bg-indigo-700/50 text-white font-semibold rounded-xl border border-indigo-400/30 hover:bg-indigo-700/70 transition backdrop-blur-md">View Reports</button>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Students Card -->
        <div class="card group hover:border-blue-400/50 transition-all duration-300 animate-slide-in" style="animation-delay: 0.1s">
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span class="text-4xl font-black text-gray-800">{{ stats?.total_students || 0 }}</span>
          </div>
          <h3 class="text-gray-400 font-bold text-xs uppercase tracking-widest">Total Students</h3>
          <div class="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 w-3/4 rounded-full"></div>
          </div>
        </div>

        <!-- Teachers Card -->
        <div class="card group hover:border-teal-400/50 transition-all duration-300 animate-slide-in" style="animation-delay: 0.2s">
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-teal-50 text-teal-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <span class="text-4xl font-black text-gray-800">{{ stats?.total_teachers || 0 }}</span>
          </div>
          <h3 class="text-gray-400 font-bold text-xs uppercase tracking-widest">Faculty Members</h3>
           <div class="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-teal-500 w-2/3 rounded-full"></div>
          </div>
        </div>

        <!-- Classrooms Card -->
        <div class="card group hover:border-purple-400/50 transition-all duration-300 animate-slide-in" style="animation-delay: 0.3s">
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
             </svg>
            </div>
            <span class="text-4xl font-black text-gray-800">{{ stats?.total_classrooms || 0 }}</span>
          </div>
          <h3 class="text-gray-400 font-bold text-xs uppercase tracking-widest">Labs & Rooms</h3>
           <div class="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-purple-500 w-1/2 rounded-full"></div>
          </div>
        </div>

        <!-- Books Card -->
        <div class="card group hover:border-amber-400/50 transition-all duration-300 animate-slide-in" style="animation-delay: 0.4s">
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://Frontend/www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-4xl font-black text-gray-800">{{ stats?.total_books || 0 }}</span>
          </div>
          <h3 class="text-gray-400 font-bold text-xs uppercase tracking-widest">Library Assets</h3>
           <div class="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 w-4/5 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions (New Section) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-in" style="animation-delay: 0.5s">
         <div class="card bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
            <div class="flex items-center justify-between">
                <div>
                   <h3 class="text-xl font-bold">New Admission</h3>
                   <p class="text-indigo-100 text-sm mt-1">Register a new student</p>
                </div>
                <div class="bg-white/20 p-3 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                   </svg>
                </div>
            </div>
         </div>
         
         <div class="card bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
            <div class="flex items-center justify-between">
                <div>
                   <h3 class="text-xl font-bold">Record Grades</h3>
                   <p class="text-teal-100 text-sm mt-1">Enter exam results</p>
                </div>
                <div class="bg-white/20 p-3 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                </div>
            </div>
         </div>
         
         <div class="card bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
            <div class="flex items-center justify-between">
                <div>
                   <h3 class="text-xl font-bold">Check Attendance</h3>
                   <p class="text-pink-100 text-sm mt-1">Daily roll call</p>
                </div>
                <div class="bg-white/20 p-3 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
            </div>
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
