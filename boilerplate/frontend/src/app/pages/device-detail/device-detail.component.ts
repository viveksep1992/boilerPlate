import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { BreadcrumbService } from 'src/app/core/breadcrumb.service';
import { EdgeDevice, EdgeInterface } from 'src/app/core/models';
import { SdwanApiService } from 'src/app/core/sdwan-api.service';
import { SdwanDataService, WanBandwidthPoint } from 'src/app/core/sdwan-data.service';
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
  chartsReady = false;
  //selectedRange = 'Last 6 Hours';
  ranges = ['Last 1 Hour', 'Last 6 Hours', 'Last 24 Hours', 'Last 7 Days'];
  bandwidthChartOptions: EChartsOption = {};
  wan1Avg = 0; wan1Peak = 0; wan1Current = 0;
  wan2Avg = 0; wan2Peak = 0; wan2Current = 0;
  private readonly rangePointsMap: Record<string, number> = {
    'Last 1 Hour': 12,
    'Last 6 Hours': 72,
    'Last 24 Hours': 288,
    'Last 7 Days': 300,
  };

  private allBandwidthPts: WanBandwidthPoint[] = [];
  private _selectedRange = 'Last 6 Hours';


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService, private sdwanSvc: SdwanDataService) { }

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
        // if (d) this.buildChart(d.bandwidthHistory);
      });

      forkJoin({
        device: this.svc.getEdgeDevice(id),
        bandwidth: this.sdwanSvc.getWanBandwidth100k(),
      }).subscribe(({ device, bandwidth }) => {
        this.device = device ?? null;
        this.allBandwidthPts = bandwidth;
        console.log('bandwidth points:', bandwidth);
        this.buildBandwidthChart(bandwidth);
        this.applyRange();
        this.chartsReady = true;
      });
    });
  }

  get selectedRange(): string {
    return this._selectedRange;
  }

  set selectedRange(value: string) {
    this._selectedRange = value;
    this.applyRange();   // ← rebuild charts whenever dropdown changes
  }

  private applyRange() {
    const n = this.rangePointsMap[this._selectedRange] ?? 300;
    this.buildBandwidthChart(this.allBandwidthPts.slice(-n));

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

  // private buildChart(pts: BandwidthPoint[]) {
  //   if (!pts.length) return;

  //   // X-axis labels from real timestamps
  //   const labels = pts.map(p =>
  //     new Date(p.timestamp).toLocaleTimeString('en-IN', {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: false,
  //     })
  //   );

  //   const wan1Data = pts.map(p => p.wan1Mbps);
  //   const wan2Data = pts.map(p => p.wan2Mbps);

  //   // Stats
  //   const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b) / arr.length);
  //   this.wan1Avg = avg(wan1Data);
  //   this.wan1Peak = Math.round(Math.max(...wan1Data));
  //   this.wan1Current = Math.round(wan1Data[wan1Data.length - 1]);
  //   this.wan2Avg = avg(wan2Data);
  //   this.wan2Peak = Math.round(Math.max(...wan2Data));
  //   this.wan2Current = Math.round(wan2Data[wan2Data.length - 1]);

  //   this.bandwidthChartOptions = {
  //     tooltip: {
  //       trigger: 'axis',
  //       formatter: (params: any) => {
  //         const [w1, w2] = params;
  //         return `
  //           <div style="font-size:12px;line-height:1.8">
  //             <strong>${w1.axisValue}</strong><br/>
  //             <span style="color:#4f77ff">● WAN1</span> ${w1.value} Mbps<br/>
  //             <span style="color:#4ea463">● WAN2</span> ${w2.value} Mbps
  //           </div>`;
  //       }
  //     },

  //     legend: {
  //       top: 0,
  //       right: 0,
  //       textStyle: {
  //         color: '#64748b',
  //         fontWeight: 600,
  //       }
  //     },

  //     grid: {
  //       left: 0,
  //       right: 0,
  //       top: 50,
  //       bottom: 20,
  //       containLabel: true,
  //     },

  //     xAxis: {
  //       type: 'category',
  //       boundaryGap: false,
  //       data: labels,
  //       axisLine: { show: false },
  //       axisTick: { show: false },
  //       axisLabel: { color: '#64748b' },
  //     },

  //     yAxis: {
  //       type: 'value',
  //       splitLine: { lineStyle: { color: '#e2e8f0' } },
  //       axisLine: { show: false },
  //       axisTick: { show: false },
  //       axisLabel: { show: false },
  //     },

  //     series: [
  //       {
  //         name: 'WAN1',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         lineStyle: { width: 4, color: '#4f77ff' },
  //         areaStyle: { opacity: 0 },
  //         data: wan1Data,
  //       },
  //       {
  //         name: 'WAN2',
  //         type: 'line',
  //         smooth: true,
  //         symbol: 'none',
  //         lineStyle: { width: 4, color: '#4ea463' },
  //         areaStyle: { opacity: 0 },
  //         data: wan2Data,
  //       },
  //     ],
  //   };
  // }

  private buildBandwidthChart(pts: WanBandwidthPoint[]) {
    if (!pts?.length) return;
    this.bandwidthChartOptions = { ...this.bandwidthChartOptions };
    const labels = pts.map(p => this.fmtTime(p.t));
    const wan1Data = pts.map(p => +p.wan1.toFixed(1));
    const wan2Data = pts.map(p => +p.wan2.toFixed(1));

    const avg = (arr: number[]) => +(arr.reduce((a, b) => a + b) / arr.length).toFixed(1);
    const peak = (arr: number[]) => +Math.max(...arr).toFixed(1);

    this.wan1Avg = avg(wan1Data);
    this.wan1Peak = peak(wan1Data);
    this.wan1Current = wan1Data[wan1Data.length - 1];
    this.wan2Avg = avg(wan2Data);
    this.wan2Peak = peak(wan2Data);
    this.wan2Current = wan2Data[wan2Data.length - 1];

    this.bandwidthChartOptions = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const [w1, w2] = params;
          return `<div style="font-size:12px;line-height:2">
            <strong>${w1.axisValue}</strong><br/>
            <span style="color:#4f77ff">● WAN1</span> ${w1.value} Mbps<br/>
            <span style="color:#4ea463">● WAN2</span> ${w2.value} Mbps
          </div>`;
        },
      },
      // legend: {
      //   top: 0, right: 0,
      //   textStyle: { color: '#64748b', fontWeight: '600' },
      // },
      grid: { left: 0, right: 0, top: 40, bottom: 20, containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#64748b', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#e2e8f0' } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
      },
      series: [
        {
          name: 'WAN1',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 4, color: '#4f77ff' },
          areaStyle: { opacity: 0 },
          data: wan1Data,
        },
        {
          name: 'WAN2',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 4, color: '#4ea463' },
          areaStyle: { opacity: 0 },
          data: wan2Data,
        },
      ],
    };
  }

  private fmtTime(ts: number): string {
    return new Date(ts).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
  }

}
