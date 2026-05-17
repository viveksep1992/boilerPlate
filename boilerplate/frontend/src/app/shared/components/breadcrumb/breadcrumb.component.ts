import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { BreadcrumbService } from 'src/app/core/breadcrumb.service';

interface Breadcrumb {
  label: string;
  url: string | null;
}
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {

  @Input() items?: string[];

  breadcrumbs: Breadcrumb[] = [];
  dynamicItems: Breadcrumb[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    // Subscribe to dynamic breadcrumbs from service
    this.breadcrumbService.breadcrumbs$.subscribe(items => {
      this.dynamicItems = items;
    });

    this.breadcrumbs = this.buildBreadcrumb(this.route.root);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumb(this.route.root);
      });
  }

  private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {

    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {

      const routeURL = child.snapshot.url.map(segment => segment.path).join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];

      if (label) {
        breadcrumbs.push({
          label,
          url
        });
      }

      return this.buildBreadcrumb(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
