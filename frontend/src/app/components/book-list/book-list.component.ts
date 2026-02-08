import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-book-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900">Library</h2>
          <p class="text-gray-500 mt-1">Explore and manage school books</p>
        </div>
        <a *ngIf="canEdit" routerLink="/add-book" class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
          Add Book
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th class="px-8 py-4">Title</th>
              <th class="px-8 py-4">Author</th>
              <th class="px-8 py-4">ISBN</th>
              <th class="px-8 py-4">Status</th>
              <th class="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let book of books" class="hover:bg-gray-50 transition">
              <td class="px-8 py-5">
                <div class="font-bold text-gray-900">{{ book.title }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ book.category }}</div>
              </td>
              <td class="px-8 py-5 text-gray-600 font-medium">{{ book.author }}</td>
              <td class="px-8 py-5 text-gray-500">{{ book.isbn }}</td>
              <td class="px-8 py-5">
                <span [ngClass]="{
                  'bg-green-50 text-green-700': book.status === 'Available',
                  'bg-amber-50 text-amber-700': book.status === 'Borrowed'
                }" class="px-3 py-1 rounded-full text-xs font-bold">{{ book.status }}</span>
              </td>
              <td class="px-8 py-5">
                <div class="flex space-x-3">
                  <ng-container *ngIf="canEdit">
                    <a [routerLink]="['/update-book', book.id]" class="text-amber-600 hover:text-amber-900 font-bold">Edit</a>
                    <button (click)="deleteBook(book.id!)" class="text-red-600 hover:text-red-900 font-bold">Delete</button>
                  </ng-container>
                </div>
              </td>
            </tr>
            <tr *ngIf="books.length === 0">
              <td colspan="5" class="px-8 py-10 text-center text-gray-500">No books found in the library.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class BookListComponent implements OnInit {
    books: Book[] = [];
    canEdit = false;

    constructor(
        private libraryService: LibraryService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const user = this.authService.currentUserValue;
        this.canEdit = user?.roles.includes('ROLE_ADMIN') || user?.roles.includes('ROLE_MODERATOR') || false;
        this.loadBooks();
    }

    loadBooks(): void {
        this.libraryService.getAll().subscribe(data => {
            this.books = data;
        });
    }

    deleteBook(id: number): void {
        if (confirm('Are you sure you want to delete this book?')) {
            this.libraryService.delete(id).subscribe(() => {
                this.loadBooks();
            });
        }
    }
}
