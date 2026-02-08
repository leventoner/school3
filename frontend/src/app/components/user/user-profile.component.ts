import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/models';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-4xl mx-auto mt-12 animate-fade-in text-gray-200">
      <div class="glass-panel rounded-3xl p-8 relative overflow-hidden">
        <!-- Background Glow -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute -bottom-8 -left-8 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <!-- Avatar Section -->
            <div class="relative group">
                <div class="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 p-1 shadow-xl">
                    <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                         <span class="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-300">
                            {{ currentUser?.username?.charAt(0)?.toUpperCase() }}
                         </span>
                    </div>
                </div>
                <!-- Orbiting Electron Animation (CSS) -->
                <div class="absolute top-0 left-0 w-full h-full animate-spin-slow pointer-events-none">
                    <div class="w-3 h-3 bg-teal-400 rounded-full absolute -top-1 left-1/2 shadow-[0_0_10px_rgba(45,212,191,0.8)]"></div>
                </div>
            </div>

            <!-- Info Section -->
            <div class="flex-1 text-center md:text-left">
                <h1 class="text-4xl font-bold text-white mb-2">{{ currentUser?.username }}</h1>
                <p class="text-indigo-200 mb-6 flex items-center justify-center md:justify-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {{ currentUser?.email }}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                        <span class="text-xs uppercase tracking-wider text-slate-400">User ID</span>
                        <div class="text-xl font-mono text-teal-400">#{{ currentUser?.id }}</div>
                    </div>
                    <div class="bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                        <span class="text-xs uppercase tracking-wider text-slate-400">Role</span>
                        <div class="flex gap-2 mt-1">
                            <span *ngFor="let role of currentUser?.roles" class="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded border border-indigo-500/30">
                                {{ role }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <!-- Activity Section (Placeholder) -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div class="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
            <h3 class="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">Recent Logic</h3>
            <p class="text-slate-400 text-sm">No recent activity found.</p>
         </div>
         <div class="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/50 md:col-span-2">
            <h3 class="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">Settings</h3>
            <div class="flex items-center justify-between py-2">
                <span class="text-slate-300">Email Notifications</span>
                <div class="w-10 h-6 bg-teal-600 rounded-full relative cursor-pointer opacity-80 hover:opacity-100 transition">
                    <div class="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
            </div>
         </div>
      </div>
    </div>
  `
})
export class UserProfileComponent implements OnInit {
    currentUser: User | null = null;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }
}
