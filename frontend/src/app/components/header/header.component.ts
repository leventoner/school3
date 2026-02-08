import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="glass-header text-gray-800 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Brand / Logo -->
        <a routerLink="/" class="text-2xl font-bold tracking-tight flex items-center space-x-2 text-indigo-700 hover:text-indigo-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-teal-500">EduScience</span>
        </a>

        <!-- Navigation -->
        <nav class="hidden md:block">
          <ul class="flex space-x-1 items-center font-medium">
            <li><a routerLink="/students" routerLinkActive="text-teal-600 bg-teal-50" class="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50 transition">Students</a></li>
            <li><a routerLink="/teachers" routerLinkActive="text-teal-600 bg-teal-50" class="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50 transition">Teachers</a></li>
            <li><a routerLink="/classrooms" routerLinkActive="text-teal-600 bg-teal-50" class="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50 transition">Classrooms</a></li>
            <li><a routerLink="/library" routerLinkActive="text-teal-600 bg-teal-50" class="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50 transition">Library</a></li>
            <li><a routerLink="/attendance" routerLinkActive="text-teal-600 bg-teal-50" class="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50 transition">Attendance</a></li>
            <li><a routerLink="/grades" routerLinkActive="text-teal-600 bg-teal-50" class="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50 transition">Grades</a></li>
            
            <li *ngIf="showAdminBoard"><a routerLink="/add" routerLinkActive="text-teal-600 bg-teal-50" class="px-3 py-2 rounded-lg hover:text-teal-600 hover:bg-teal-50 transition">Add Student</a></li>
            
            <!-- Auth Buttons -->
            <li *ngIf="!currentUser" class="ml-6 flex items-center space-x-3 border-l pl-6 border-gray-200">
              <a routerLink="/login" class="px-4 py-2 text-indigo-700 hover:bg-indigo-50 rounded-lg transition">Log in</a>
              <a routerLink="/register" class="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition transform hover:-translate-y-0.5">Sign up</a>
            </li>
            
            <li *ngIf="currentUser" class="ml-6 flex items-center space-x-4 border-l pl-6 border-gray-200">
               <div class="flex flex-col text-right">
                  <span class="text-xs text-gray-500 uppercase font-bold tracking-wider">User</span>
                  <span class="text-sm font-semibold text-gray-800 leading-none">{{ currentUser.username }}</span>
               </div>
              <button (click)="logout()" class="p-2 text-gray-400 hover:text-red-600 transition" title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  showAdminBoard = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.showAdminBoard = user?.roles.includes('ROLE_ADMIN') || user?.roles.includes('ROLE_MODERATOR') || false;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
