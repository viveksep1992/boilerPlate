import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { SiteDetailComponent } from './pages/site-detail/site-detail.component';
import { DeviceDetailComponent } from './pages/device-detail/device-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { breadcrumb: 'Overview' }
  },
  {
    path: 'organization',
    component: OrganizationComponent,
    data: { breadcrumb: 'Organization' }
  },
  {
    path: 'site/:siteId',
    component: SiteDetailComponent
  },
  {
    path: 'device/:deviceId',
    component: DeviceDetailComponent
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];