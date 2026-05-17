import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './table-card.component.html',
  styleUrl: './table-card.component.css'
})
export class TableCardComponent {
  @Input() title = '';
  @Input() columns: string[] = [];
  @Input() rows: any[] = [];
  @ContentChild('tableRow', { static: false })
  rowTemplate!: TemplateRef<any>;
}
