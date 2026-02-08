import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-8 space-y-12 animate-fade-in text-gray-100">
      <!-- Hero / Welcome Section -->
      <div class="relative bg-gradient-to-r from-slate-800 to-indigo-900 rounded-3xl p-12 shadow-2xl overflow-hidden group">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <!-- Floating Atom -->
            <div class="absolute top-10 right-20 animate-float opacity-20">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" class="text-teal-400">
                    <circle cx="50" cy="50" r="10" fill="currentColor" />
                    <ellipse cx="50" cy="50" rx="40" ry="10" stroke-width="2" class="animate-spin-slow" style="transform-origin: center;" />
                    <ellipse cx="50" cy="50" rx="40" ry="10" stroke-width="2" class="animate-spin-slow" style="transform-origin: center; animation-duration: 7s; transform: rotate(60deg);" />
                    <ellipse cx="50" cy="50" rx="40" ry="10" stroke-width="2" class="animate-spin-slow" style="transform-origin: center; animation-duration: 5s; transform: rotate(-60deg);" />
                </svg>
            </div>
            
            <!-- Floating Math Symbols -->
            <div class="absolute bottom-10 right-1/3 animate-float opacity-10 text-4xl text-indigo-300 font-serif" style="animation-delay: 1s;">∑</div>
            <div class="absolute top-1/4 left-10 animate-float opacity-10 text-3xl text-purple-300 font-serif" style="animation-delay: 2s;">π</div>
            <div class="absolute bottom-20 left-1/4 animate-float opacity-10 text-4xl text-pink-300 font-serif" style="animation-delay: 1.5s;">√</div>
        </div>
        
        <div class="relative z-10 max-w-3xl">
          <span class="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-semibold mb-4 backdrop-blur-sm border border-indigo-500/30">Academic Dashboard</span>
          <h1 class="text-5xl font-extrabold mb-6 tracking-tight leading-tight text-white">Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400 animate-pulse-glow">EduScience</span></h1>
          <p class="text-slate-300 text-xl font-light leading-relaxed mb-8">
            Empowering education through technology. Manage your scientific community with precision—from student grades to laboratory resources.
          </p>
          <div class="flex gap-4">
            <button class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-500 transition transform hover:-translate-y-1">Get Started</button>
            <button class="px-6 py-3 bg-slate-700/50 text-white font-semibold rounded-xl border border-slate-600 hover:bg-slate-700 transition backdrop-blur-md">View Reports</button>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Students Card -->
        <div class="card bg-slate-800 border-slate-700 group hover:border-indigo-500/50 transition-all duration-300 animate-slide-in" style="animation-delay: 0.1s">
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span class="text-4xl font-black text-white">{{ stats?.total_students || 0 }}</span>
          </div>
          <h3 class="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Students</h3>
          <div class="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 w-3/4 rounded-full"></div>
          </div>
        </div>

        <!-- Teachers Card -->
        <div class="card bg-slate-800 border-slate-700 group hover:border-teal-500/50 transition-all duration-300 animate-slide-in" style="animation-delay: 0.2s">
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-teal-500/10 text-teal-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <span class="text-4xl font-black text-white">{{ stats?.total_teachers || 0 }}</span>
          </div>
          <h3 class="text-slate-400 font-bold text-xs uppercase tracking-widest">Faculty Members</h3>
           <div class="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-teal-500 w-2/3 rounded-full"></div>
          </div>
        </div>

        <!-- Classrooms Card -->
        <div class="card bg-slate-800 border-slate-700 group hover:border-purple-500/50 transition-all duration-300 animate-slide-in" style="animation-delay: 0.3s">
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
             </svg>
            </div>
            <span class="text-4xl font-black text-white">{{ stats?.total_classrooms || 0 }}</span>
          </div>
          <h3 class="text-slate-400 font-bold text-xs uppercase tracking-widest">Labs & Rooms</h3>
           <div class="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-purple-500 w-1/2 rounded-full"></div>
          </div>
        </div>

        <!-- Books Card -->
        <div class="card bg-slate-800 border-slate-700 group hover:border-amber-500/50 transition-all duration-300 animate-slide-in" style="animation-delay: 0.4s">
          <div class="flex items-center justify-between mb-4">
            <div class="p-4 bg-amber-500/10 text-amber-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://Frontend/www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span class="text-4xl font-black text-white">{{ stats?.total_books || 0 }}</span>
          </div>
          <h3 class="text-slate-400 font-bold text-xs uppercase tracking-widest">Library Assets</h3>
           <div class="mt-4 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 w-4/5 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-in" style="animation-delay: 0.5s">
         <div class="card bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-2xl cursor-pointer border-indigo-500/30">
            <div class="flex items-center justify-between">
                <div>
                   <h3 class="text-xl font-bold">New Admission</h3>
                   <p class="text-indigo-200 text-sm mt-1">Register a new student</p>
                </div>
                <div class="bg-white/10 p-3 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                   </svg>
                </div>
            </div>
         </div>
         
         <div class="card bg-gradient-to-br from-teal-600 to-teal-800 text-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-2xl cursor-pointer border-teal-500/30">
            <div class="flex items-center justify-between">
                <div>
                   <h3 class="text-xl font-bold">Record Grades</h3>
                   <p class="text-teal-200 text-sm mt-1">Enter exam results</p>
                </div>
                <div class="bg-white/10 p-3 rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                </div>
            </div>
         </div>
         
         <div class="card bg-gradient-to-br from-pink-600 to-pink-800 text-white p-6 rounded-2xl shadow-lg transform transition hover:-translate-y-1 hover:shadow-2xl cursor-pointer border-pink-500/30">
            <div class="flex items-center justify-between">
                <div>
                   <h3 class="text-xl font-bold">Check Attendance</h3>
                   <p class="text-pink-200 text-sm mt-1">Daily roll call</p>
                </div>
                <div class="bg-white/10 p-3 rounded-full">
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
