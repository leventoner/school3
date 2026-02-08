import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentDetailComponent } from './components/student-detail/student-detail.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { UpdateStudentComponent } from './components/update-student/update-student.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './helpers/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'students', component: StudentListComponent, canActivate: [AuthGuard] },
    { path: 'student/:id', component: StudentDetailComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'add', component: AddStudentComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_MODERATOR'] } },
    { path: 'update/:id', component: UpdateStudentComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_MODERATOR'] } },
    { path: 'teachers', loadComponent: () => import('./components/teacher-list/teacher-list.component').then(m => m.TeacherListComponent), canActivate: [AuthGuard] },
    { path: 'add-teacher', loadComponent: () => import('./components/add-teacher/add-teacher.component').then(m => m.AddTeacherComponent), canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_MODERATOR'] } },
    { path: 'update-teacher/:id', loadComponent: () => import('./components/add-teacher/add-teacher.component').then(m => m.AddTeacherComponent), canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_MODERATOR'] } },
    { path: 'classrooms', loadComponent: () => import('./components/classroom-list/classroom-list.component').then(m => m.ClassroomListComponent), canActivate: [AuthGuard] },
    { path: 'add-classroom', loadComponent: () => import('./components/add-classroom/add-classroom.component').then(m => m.AddClassroomComponent), canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_MODERATOR'] } },
    { path: 'update-classroom/:id', loadComponent: () => import('./components/add-classroom/add-classroom.component').then(m => m.AddClassroomComponent), canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_MODERATOR'] } },
    { path: 'library', loadComponent: () => import('./components/book-list/book-list.component').then(m => m.BookListComponent), canActivate: [AuthGuard] },
    { path: 'add-book', loadComponent: () => import('./components/add-book/add-book.component').then(m => m.AddBookComponent), canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_MODERATOR'] } },
    { path: 'update-book/:id', loadComponent: () => import('./components/add-book/add-book.component').then(m => m.AddBookComponent), canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_MODERATOR'] } },
    { path: 'attendance', loadComponent: () => import('./components/attendance-list/attendance-list.component').then(m => m.AttendanceListComponent), canActivate: [AuthGuard] },
    { path: 'grades', loadComponent: () => import('./components/grade-list/grade-list.component').then(m => m.GradeListComponent), canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home' }
];
