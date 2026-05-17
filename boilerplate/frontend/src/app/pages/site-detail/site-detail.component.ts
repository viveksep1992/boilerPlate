import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from 'src/app/shared/components/breadcrumb/breadcrumb.component';
import { StatCardComponent } from 'src/app/shared/components/stat-card/stat-card.component';
import { TableCardComponent } from 'src/app/shared/components/table-card/table-card.component';
import { StatusPillComponent } from 'src/app/shared/components/status-pill/status-pill.component';
import { BreadcrumbService } from 'src/app/core/breadcrumb.service';
import { Site } from 'src/app/core/models';
import { SdwanApiService } from 'src/app/core/sdwan-api.service';

@Component({
  selector: 'app-site-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent, StatCardComponent, TableCardComponent, StatusPillComponent],
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.css']
})
export class SiteDetailComponent implements OnInit {
  site: Site | null = null;
  lastUpdated = 'Just now';
  private svc = inject(SdwanApiService);
  tableColumns = [
    'Device Name',
    'Role',
    'Uptime',
    'Status',
    'System IP'
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService) { }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('siteId') ?? '';
      this.svc.getSite(id).subscribe(s => {
        (this.site = s ?? null);
        this.breadcrumbService.setBreadcrumbs([{
          label: 'Organization',
          url: '/organization'
        },
        {
          label: this.site?.name ?? 'Site',
          url: '/site'
        }]);
      });
    });
  }


  navigateToDeviceDetail(deviceDetail: any) {
    this.breadcrumbService.setBreadcrumbs([{
      label: 'Organization',
      url: '/organization'
    },
    {
      label: this.site?.name ?? 'Site',
      url: '/site'
    },
    {
      label: deviceDetail.name,
      url: null
    }]);
    this.router.navigate(['/device', deviceDetail.id]);
  }

  get stats() {
    return [{
      label: 'Total Edge Devices',
      value: this.site?.totalEdgeDevices ?? 0,
      color: ''
    },
    {
      label: 'Online',
      value: this.site?.onlineDevices ?? 0,
      color: 'green'
    },
    {
      label: 'Offline',
      value: this.site?.offlineDevices ?? 0,
      color: 'orange'
    }]
  }
}
