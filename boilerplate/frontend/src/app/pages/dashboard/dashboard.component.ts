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
import { BreadcrumbService } from 'src/app/core/breadcrumb.service';
import { SdwanApiService } from 'src/app/core/sdwan-api.service';
import { DashboardSummary } from 'src/app/core/models';
import { forkJoin } from 'rxjs';
import { EdgeAvailPoint, SdwanDataService, SiteHealthPoint } from 'src/app/core/sdwan-data.service';


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

  chartsReady = false;

  siteDonutOptions: EChartsOption = {};
  deviceDonutOptions: EChartsOption = {};
  siteHealthOptions: EChartsOption = {};
  edgeAvailOptions: EChartsOption = {};

  totalHealthy = 0;
  totalDegraded = 0;
  totalDown = 0;

  totalOnline = 0;
  totalOffline = 0;

  private svc = inject(SdwanApiService);

  constructor(private router: Router, private sdwanSvc: SdwanDataService, private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.breadcrumbService.reset();
    this.getDashboardData();
  }

  private getDashboardData(): void {
    // this.svc.getDashboardSummary().subscribe(s => {
    //   this.summary = s;
    //   this.buildCharts(s);
    // });

    // this.svc
    //   .getSiteHealthTrend('30d', 'raw')
    //   .subscribe({
    //     next: (res) => {
    //       console.log(res);
    //     },
    //     error: (err) => {
    //       console.error(err);
    //     }
    //   });
    forkJoin({
      summary: this.svc.getDashboardSummary(),
      siteHealth: this.sdwanSvc.getSiteHealth(),
      edgeAvail: this.sdwanSvc.getEdgeAvailability(),
    }).subscribe(({ summary, siteHealth, edgeAvail }) => {
      this.summary = summary;

      this.totalHealthy = siteHealth.reduce((sum, p) => sum + p.healthy, 0);
      this.totalDegraded = siteHealth.reduce((sum, p) => sum + p.degraded, 0);
      this.totalDown = siteHealth.reduce((sum, p) => sum + p.down, 0);
      this.totalOnline = edgeAvail.reduce((sum, p) => sum + p.online, 0);
      this.totalOffline = edgeAvail.reduce((sum, p) => sum + p.offline, 0);
      this.buildDonutCharts();
      this.buildSiteHealthChart(siteHealth);
      this.buildEdgeAvailChart(edgeAvail);
      this.chartsReady = true;
    });
  }

  // private buildCharts(s: DashboardSummary) {
  //   this.siteChartOptions = {
  //     tooltip: { trigger: 'item' },
  //     legend: { bottom: 0 },
  //     series: [{
  //       name: 'Site Status',
  //       type: 'pie',
  //       radius: ['55%', '75%'],
  //       avoidLabelOverlap: false,
  //       itemStyle: {
  //         borderRadius: 10,
  //         borderColor: '#fff',
  //         borderWidth: 2
  //       },
  //       label: {
  //         show: true,
  //         position: 'center',
  //         formatter: `${s.totalSites}\nSites`,
  //         fontSize: 20,
  //         fontWeight: 'bold',
  //         lineHeight: 24,
  //       },
  //       emphasis: {
  //         label: { show: true, fontSize: 24 }
  //       },
  //       labelLine: { show: false },
  //       data: [
  //         { value: s.healthySites, name: 'Healthy', itemStyle: { color: '#22c55e' } },
  //         { value: s.degradedSites, name: 'Degraded', itemStyle: { color: '#f59e0b' } },
  //         { value: s.downSites, name: 'Down', itemStyle: { color: '#ef4444' } },
  //       ]
  //     }]
  //   };

  //   this.deviceChartOptions = {
  //     tooltip: { trigger: 'item' },
  //     legend: { bottom: 0 },
  //     series: [{
  //       name: 'Device Status',
  //       type: 'pie',
  //       radius: ['55%', '75%'],
  //       avoidLabelOverlap: false,
  //       itemStyle: {
  //         borderRadius: 10,
  //         borderColor: '#fff',
  //         borderWidth: 2
  //       },
  //       label: {
  //         show: true,
  //         position: 'center',
  //         formatter: `${s.totalEdgeDevices}\nDevices`,
  //         fontSize: 20,
  //         fontWeight: 'bold',
  //         lineHeight: 24,
  //       },
  //       emphasis: {
  //         label: { show: true, fontSize: 24 }
  //       },
  //       labelLine: { show: false },
  //       data: [
  //         { value: s.onlineDevices, name: 'Online', itemStyle: { color: '#22c55e' } },
  //         { value: s.offlineDevices, name: 'Offline', itemStyle: { color: '#ef4444' } },
  //       ]
  //     }]
  //   };
  // }

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
        value: (this.totalHealthy + this.totalDegraded + this.totalDown),
        color: ''
      },

      {
        label: 'Total Edge Devices',
        value: this.totalOnline + this.totalOffline,
        color: ''
      },

      {
        label: 'Healthy Sites',
        value: this.totalHealthy,
        color: 'green'
      },

      {
        label: 'Degraded Sites',
        value: this.totalDegraded,
        color: 'orange'
      },

      {
        label: 'Down Sites',
        value: this.totalDown,
        color: 'red'
      }
    ];
  }

  private buildDonutCharts(pts: SiteHealthPoint[] = [], s: EdgeAvailPoint[] = []) {
    this.siteDonutOptions = {
      tooltip: { trigger: 'item' },
      //legend: { bottom: 0, textStyle: { color: '#64748b', fontWeight: '600' } },
      series: [{
        name: 'Site Status',
        type: 'pie',
        radius: ['55%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: {
          show: true, position: 'center',
          formatter: `${this.totalHealthy + this.totalDegraded + this.totalDown}\nSites`,
          fontSize: 20, fontWeight: 'bold', lineHeight: 24, color: '#1a2c4e',
        },
        emphasis: { label: { show: true, fontSize: 22 } },
        labelLine: { show: false },
        data: [
          { value: this.totalHealthy, name: 'Healthy', itemStyle: { color: '#22c55e' } },
          { value: this.totalDegraded, name: 'Degraded', itemStyle: { color: '#f59e0b' } },
          { value: this.totalDown, name: 'Down', itemStyle: { color: '#ef4444' } },
        ]
      }]
    };

    this.deviceDonutOptions = {
      tooltip: { trigger: 'item' },
      //legend: { bottom: 0, textStyle: { color: '#64748b', fontWeight: '600' } },
      series: [{
        name: 'Device Status',
        type: 'pie',
        radius: ['55%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: {
          show: true, position: 'center',
          formatter: `${this.totalOnline + this.totalOffline}\nDevices`,
          fontSize: 20, fontWeight: 'bold', lineHeight: 24, color: '#1a2c4e',
        },
        emphasis: { label: { show: true, fontSize: 22 } },
        labelLine: { show: false },
        data: [
          { value: this.totalOnline, name: 'Online', itemStyle: { color: '#22c55e' } },
          { value: this.totalOffline, name: 'Offline', itemStyle: { color: '#ef4444' } },
        ],
      }],
    };
  }

  private buildSiteHealthChart(pts: SiteHealthPoint[]) {
    const labels = pts.map(p => this.fmtDate(p.t));
    this.siteHealthOptions = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } } },
      //legend: { top: 0, right: 0, textStyle: { color: '#64748b', fontWeight: '600' } },
      grid: { left: 0, right: 0, top: 40, bottom: 0, containLabel: true },
      xAxis: {
        type: 'category', boundaryGap: false, data: labels,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      series: [
        { name: 'Healthy', type: 'line', stack: 'total', smooth: true, symbol: 'none', lineStyle: { width: 0 }, areaStyle: { color: '#22c55e', opacity: 0.85 }, data: pts.map(p => p.healthy) },
        { name: 'Degraded', type: 'line', stack: 'total', smooth: true, symbol: 'none', lineStyle: { width: 0 }, areaStyle: { color: '#f59e0b', opacity: 0.85 }, data: pts.map(p => p.degraded) },
        { name: 'Down', type: 'line', stack: 'total', smooth: true, symbol: 'none', lineStyle: { width: 0 }, areaStyle: { color: '#ef4444', opacity: 0.85 }, data: pts.map(p => p.down) },
      ],
    };
  }

  private buildEdgeAvailChart(pts: EdgeAvailPoint[]) {
    const labels = pts.map(p => this.fmtDate(p.t));
    this.edgeAvailOptions = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      //legend: { top: 0, right: 0, textStyle: { color: '#64748b', fontWeight: '600' } },
      grid: { left: 0, right: 0, top: 40, bottom: 0, containLabel: true },
      xAxis: {
        type: 'category', data: labels,
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      series: [
        { name: 'Online', type: 'bar', stack: 'total', barMaxWidth: 20, itemStyle: { color: '#22c55e', borderRadius: [0, 0, 0, 0] }, data: pts.map(p => p.online) },
        { name: 'Offline', type: 'bar', stack: 'total', barMaxWidth: 20, itemStyle: { color: '#ef4444', borderRadius: [4, 4, 0, 0] }, data: pts.map(p => p.offline) },
      ],
    };
  }

  private fmtDate(ts: number): string {
    return new Date(ts).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }

}
