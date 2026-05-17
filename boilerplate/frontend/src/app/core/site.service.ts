import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SiteService {
    private siteSubject = new BehaviorSubject<any>(null);
    site$: Observable<any> = this.siteSubject.asObservable();
    private deviceSubject = new BehaviorSubject<any>(null);
    device$: Observable<any> = this.deviceSubject.asObservable();

    constructor() { }

    setSite(site: any): void {
        this.siteSubject.next(site);
    }

    getSite(): any {
        return this.siteSubject.getValue();
    }

    setDevice(device: any): void {
        this.deviceSubject.next(device);
    }

    getDevice(): any {
        return this.deviceSubject.getValue();
    }
}
