import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Breadcrumb {
    label: string;
    url: string | null;
}
@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
    breadcrumbs$: Observable<Breadcrumb[]> = this.breadcrumbsSubject.asObservable();

    constructor() { }

    setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
        this.breadcrumbsSubject.next(breadcrumbs);
    }

    getBreadcrumbs(): Breadcrumb[] {
        return this.breadcrumbsSubject.getValue();
    }

    reset(): void {
        this.breadcrumbsSubject.next([]);
    }
}
