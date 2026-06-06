import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button';
import { ButtonTransparantComponent } from '../buttonTransparant/button-transparant';

export interface SearchFilterPayload {
  text: string;
  fromDate?: Date;
  toDate?: Date;
}

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ButtonTransparantComponent],
  templateUrl: './searchInput.html',
})
export class SearchInputComponent {

  @Input() showDateFilter = false;

  searchText: string = '';
  fromDate?: string;
  toDate?: string;

  @Output() search = new EventEmitter<SearchFilterPayload>();
  @Output() reset = new EventEmitter<void>();
  onSearch() {
    this.search.emit({
      text: this.searchText,
      fromDate: this.fromDate ? new Date(this.fromDate) : undefined,
      toDate: this.toDate ? new Date(this.toDate) : undefined
    });
  }

  onReset() {
    this.searchText = '';
    this.fromDate = undefined;
    this.toDate = undefined;

    this.search.emit({
      text: ''
    });
    this.reset.emit();
  }
}
