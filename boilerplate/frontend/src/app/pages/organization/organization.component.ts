import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StatCardComponent } from 'src/app/shared/components/stat-card/stat-card.component';
import { TableCardComponent } from 'src/app/shared/components/table-card/table-card.component';
import { StatusPillComponent } from 'src/app/shared/components/status-pill/status-pill.component';
import { BreadcrumbComponent } from 'src/app/shared/components/breadcrumb/breadcrumb.component';
import { SiteService } from 'src/app/core/site.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb.service';
import { DashboardSummary, Organization } from 'src/app/core/models';
import { SdwanApiService } from 'src/app/core/sdwan-api.service';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule, RouterModule, StatCardComponent, TableCardComponent, StatusPillComponent, BreadcrumbComponent],
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  summary: DashboardSummary | null = null;
  lastUpdated = 'Just now';
  org: Organization | null = null;
  private svc = inject(SdwanApiService);

  constructor(private router: Router, private siteService: SiteService, private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.breadcrumbService.reset();
    this.getOrganizationData();
  }

  getOrganizationData(): void {
    this.svc.getOrganization().subscribe(o => (this.org = o));
  }

  navigateToSite(site: any) {
    this.siteService.setSite(site);
    this.breadcrumbService.setBreadcrumbs([{ label: 'Organization', url: '/organization' }, { label: site.name, url: null }]);
    this.router.navigate(['/site', site.id]);
  }

  tableColumns = [
    'Site Name',
    'Total Edge Devices',
    'Status',
    'Healthy',
    'Degraded',
    'Down'
  ];

  get stats() {
    return [{
      label: 'Total Sites',
      value: this.org?.totalSites ?? 0,
      color: ''
    },
    {
      label: 'Healthy Sites',
      value: this.org?.healthySites ?? 0,
      color: 'green'
    },
    {
      label: 'Degraded Sites',
      value: this.org?.degradedSites ?? 0,
      color: 'orange'
    },
    {
      label: 'Down Sites',
      value: this.org?.downSites ?? 0,
      color: 'red'
    },
    {
      label: 'Total Devices',
      value: this.org?.totalEdgeDevices ?? 0,
      color: ''
    }]
  }
}
