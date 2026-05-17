import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { BreadcrumbService } from 'src/app/core/breadcrumb.service';
import { EdgeDevice, EdgeInterface } from 'src/app/core/models';
import { SdwanApiService } from 'src/app/core/sdwan-api.service';
import { BreadcrumbComponent } from 'src/app/shared/components/breadcrumb/breadcrumb.component';
import { ChartCardComponent } from 'src/app/shared/components/chart-card/chart-card.component';
import { StatCardComponent } from 'src/app/shared/components/stat-card/stat-card.component';
import { StatusPillComponent } from 'src/app/shared/components/status-pill/status-pill.component';
import { TableCardComponent } from 'src/app/shared/components/table-card/table-card.component';

@Component({
  selector: 'app-device-detail',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective, ChartCardComponent, StatCardComponent, StatusPillComponent, TableCardComponent, BreadcrumbComponent, FormsModule],
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {
  lastUpdated = 'Just now';
  private svc = inject(SdwanApiService);
  device: EdgeDevice | null = null;
  selectedRange = 'Last 6 Hours';
  ranges = ['Last 1 Hour', 'Last 6 Hours', 'Last 24 Hours', 'Last 7 Days'];
  bandwidthChart: EChartsOption = {};
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService) { }

  get wanInterfaces(): EdgeInterface[] {
    return this.device?.interfaces.filter(i => i.type === 'WAN') ?? [];
  }
  get lanInterfaces(): EdgeInterface[] {
    return this.device?.interfaces.filter(i => i.type === 'LAN') ?? [];
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('deviceId') ?? '';
      this.svc.getEdgeDevice(id).subscribe(d => {
        this.device = d ?? null;
        this.breadcrumbService.setBreadcrumbs([{
          label: 'Organization',
          url: '/organization'
        },
        {
          label: this.device?.siteName ?? 'Device',
          url: '/site/' + this.device?.siteId
        }, {
          label: this.device?.name ?? 'Site',
          url: 'null'
        }]);
        //if (d) this.buildChart(d.bandwidthHistory);
      });
    });
  }

  get stats() {
    return [{
      label: 'Role',
      value: this.device?.role ?? '',
      color: ''
    },
    {
      label: 'Status',
      value: this.device?.status ?? '',
      color: ''
    },
    {
      label: 'Uptime',
      value: this.device?.uptime ?? '',
      color: ''
    },
    {
      label: 'System IP',
      value: this.device?.systemIp ?? '',
      color: ''
    },
    {
      label: 'Model',
      value: this.device?.model ?? '',
      color: ''
    },
    {
      label: 'Site',
      value: this.device?.siteName ?? '',
      color: ''
    }]
  }


  tableColumns = [
    'Interface',
    'Status',
    'IP Address'
  ];

  // private buildChart(d) {
  //   tooltip: {
  //     trigger: 'axis'
  //   },

  //   legend: {
  //     top: 0,
  //       right: 0,
  //         textStyle: {
  //       color: '#64748b',
  //         fontWeight: 600
  //     }
  //   },

  //   grid: {
  //     left: 0,
  //       right: 0,
  //         top: 50,
  //           bottom: 20,
  //             containLabel: true
  //   },

  //   xAxis: {
  //     type: 'category',

  //       boundaryGap: false,

  //         data: [
  //           '08:15',
  //           '09:00',
  //           '09:45',
  //           '10:30',
  //           '11:15',
  //           '12:00',
  //           '12:45',
  //           '13:55'
  //         ],

  //           axisLine: {
  //       show: false
  //     },

  //     axisTick: {
  //       show: false
  //     },

  //     axisLabel: {
  //       color: '#64748b'
  //     }
  //   },

  //   yAxis: {
  //     type: 'value',

  //       splitLine: {
  //       lineStyle: {
  //         color: '#e2e8f0'
  //       }
  //     },

  //     axisLine: {
  //       show: false
  //     },

  //     axisTick: {
  //       show: false
  //     },

  //     axisLabel: {
  //       show: false
  //     }
  //   },

  //   series: [

  //     {
  //       name: 'WAN1',

  //       type: 'line',

  //       smooth: true,

  //       symbol: 'none',

  //       lineStyle: {
  //         width: 4,
  //         color: '#4f77ff'
  //       },

  //       areaStyle: {
  //         opacity: 0
  //       },

  //       data: [40, 52, 48, 61, 42, 58, 44, 57]
  //     },

  //     {
  //       name: 'WAN2',

  //       type: 'line',

  //       smooth: true,

  //       symbol: 'none',

  //       lineStyle: {
  //         width: 4,
  //         color: '#4ea463'
  //       },

  //       areaStyle: {
  //         opacity: 0
  //       },

  //       data: [18, 27, 22, 31, 24, 29, 20, 28]
  //     }
  //   ]
  // }

}
