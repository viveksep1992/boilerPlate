import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { BreadcrumbComponent } from 'src/app/shared/components/breadcrumb/breadcrumb.component';
import { ChartCardComponent } from 'src/app/shared/components/chart-card/chart-card.component';
import { StatCardComponent } from 'src/app/shared/components/stat-card/stat-card.component';
import { StatusPillComponent } from 'src/app/shared/components/status-pill/status-pill.component';
import { TableCardComponent } from 'src/app/shared/components/table-card/table-card.component';
import { EChartsOption } from 'echarts';
import { Router, RouterModule } from '@angular/router';
import { SiteService } from 'src/app/core/site.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb.service';
import { SdwanApiService } from 'src/app/core/sdwan-api.service';
import { DashboardSummary } from 'src/app/core/models';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    BreadcrumbComponent,
    StatCardComponent,
    ChartCardComponent,
    TableCardComponent,
    StatusPillComponent,
    NgxEchartsModule,
    RouterModule,
    BreadcrumbComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  summary: DashboardSummary | null = null;
  lastUpdated = 'Just now';

  siteChartOptions: EChartsOption = {};
  deviceChartOptions: EChartsOption = {};

  private svc = inject(SdwanApiService);

  constructor(private router: Router, private siteService: SiteService, private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.breadcrumbService.reset();
    this.getDashboardData();
  }

  private getDashboardData(): void {
    this.svc.getDashboardSummary().subscribe(s => {
      this.summary = s;
      this.buildCharts(s);
    });
  }

  private buildCharts(s: DashboardSummary) {
    this.siteChartOptions = {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [{
        name: 'Site Status',
        type: 'pie',
        radius: ['55%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'center',
          formatter: `${s.totalSites}\nSites`,
          fontSize: 20,
          fontWeight: 'bold',
          lineHeight: 24,
        },
        emphasis: {
          label: { show: true, fontSize: 24 }
        },
        labelLine: { show: false },
        data: [
          { value: s.healthySites, name: 'Healthy', itemStyle: { color: '#22c55e' } },
          { value: s.degradedSites, name: 'Degraded', itemStyle: { color: '#f59e0b' } },
          { value: s.downSites, name: 'Down', itemStyle: { color: '#ef4444' } },
        ]
      }]
    };

    this.deviceChartOptions = {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [{
        name: 'Device Status',
        type: 'pie',
        radius: ['55%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'center',
          formatter: `${s.totalEdgeDevices}\nDevices`,
          fontSize: 20,
          fontWeight: 'bold',
          lineHeight: 24,
        },
        emphasis: {
          label: { show: true, fontSize: 24 }
        },
        labelLine: { show: false },
        data: [
          { value: s.onlineDevices, name: 'Online', itemStyle: { color: '#22c55e' } },
          { value: s.offlineDevices, name: 'Offline', itemStyle: { color: '#ef4444' } },
        ]
      }]
    };
  }

  // navigateToSite(site: any) {
  //   this.siteService.setSite(site);
  //   this.breadcrumbService.setBreadcrumbs(['Organization', site.name]);
  //   this.router.navigate(['/site', site.id]);
  // }


  tableColumns = [
    'Site Name',
    'Status',
    'Total Devices',
    'Online',
    'Offline'
  ];


  get stats() {
    return [
      {
        label: 'Total Sites',
        value: this.summary?.totalSites ?? 0,
        color: ''
      },

      {
        label: 'Total Edge Devices',
        value: this.summary?.totalEdgeDevices ?? 0,
        color: ''
      },

      {
        label: 'Healthy Sites',
        value: this.summary?.healthySites ?? 0,
        color: 'green'
      },

      {
        label: 'Degraded Sites',
        value: this.summary?.degradedSites ?? 0,
        color: 'orange'
      },

      {
        label: 'Down Sites',
        value: this.summary?.downSites ?? 0,
        color: 'red'
      }
    ];
  }

}
