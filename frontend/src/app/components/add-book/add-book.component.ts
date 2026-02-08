import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LibraryService } from '../../services/library.service';
import { Book } from '../../models/models';

@Component({
    selector: 'app-add-book',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="max-w-2xl mx-auto mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div class="p-10">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900">{{ isEditMode ? 'Update' : 'Add New' }} Book</h2>
          <a routerLink="/library" class="text-gray-400 hover:text-gray-600 transition">
             <span class="text-sm font-bold">Cancel</span>
          </a>
        </div>

        <form (ngSubmit)="saveBook()" #bookForm="ngForm" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Book Title</label>
            <input type="text" [(ngModel)]="book.title" name="title" required
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none" placeholder="e.g. Introduction to Algorithms">
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Author</label>
              <input type="text" [(ngModel)]="book.author" name="author" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">ISBN</label>
              <input type="text" [(ngModel)]="book.isbn" name="isbn" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <input type="text" [(ngModel)]="book.category" name="category" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none" placeholder="e.g. Science, Novel">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select [(ngModel)]="book.status" name="status" required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none">
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
              </select>
            </div>
          </div>

          <button type="submit" [disabled]="!bookForm.form.valid"
            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-100 mt-4">
            {{ isEditMode ? 'Update Book Info' : 'Add to Library' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class AddBookComponent implements OnInit {
    book: Book = {
        title: '',
        author: '',
        isbn: '',
        category: '',
        status: 'Available'
    };
    isEditMode = false;
    bookId?: number;

    constructor(
        private libraryService: LibraryService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.bookId = this.route.snapshot.params['id'];
        if (this.bookId) {
            this.isEditMode = true;
            this.libraryService.get(this.bookId).subscribe(data => {
                this.book = data;
            });
        }
    }

    saveBook(): void {
        if (this.isEditMode) {
            this.libraryService.update(this.bookId!, this.book).subscribe(() => {
                this.router.navigate(['/library']);
            });
        } else {
            this.libraryService.create(this.book).subscribe(() => {
                this.router.navigate(['/library']);
            });
        }
    }
}
