import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BandwidthPoint, DashboardSummary, EdgeDevice, HealthResponse, Organization, Site } from './models';
import { Observable } from 'rxjs/internal/Observable';
import { delay } from 'rxjs/internal/operators/delay';
import { of } from 'rxjs';

// ── Helpers ───────────────────────────────────────────────────────────────────

function genBandwidth(hours = 6): BandwidthPoint[] {
  const pts: BandwidthPoint[] = [];
  const now = Date.now();
  const step = (hours * 3600 * 1000) / 20;
  for (let i = 20; i >= 0; i--) {
    const t = new Date(now - i * step);
    pts.push({
      timestamp: t.toISOString(),
      wan1Mbps: +(50 + Math.random() * 60).toFixed(1),
      wan2Mbps: +(20 + Math.random() * 25).toFixed(1),
    });
  }
  return pts;
}

// ── Raw Data ──────────────────────────────────────────────────────────────────

const RAW: Organization = {
  id: 'org-1',
  name: 'Acme Corporation',
  totalSites: 5,
  healthySites: 3,
  degradedSites: 1,
  downSites: 1,
  totalEdgeDevices: 9,
  sites: [
    {
      id: 'site-mum',
      name: 'Mumbai-Branch',
      organizationId: 'org-1',
      status: 'HEALTHY',
      totalEdgeDevices: 2,
      onlineDevices: 2,
      offlineDevices: 0,
      healthyDevices: 2,
      degradedDevices: 0,
      downDevices: 0,
      edgeDevices: [
        {
          id: 'mum-edge-01',
          name: 'MUM-EDGE-01',
          siteId: 'site-mum',
          siteName: 'Mumbai-Branch',
          role: 'ACTIVE',
          status: 'ONLINE',
          uptime: '5d 14h 32m',
          systemIp: '10.1.1.1',
          model: 'vEdge Cloud',
          interfaces: [
            { name: 'WAN1', type: 'WAN', status: 'UP', ipAddress: '100.64.1.1' },
            { name: 'WAN2', type: 'WAN', status: 'UP', ipAddress: '100.64.2.1' },
            { name: 'LAN1', type: 'LAN', status: 'UP', ipAddress: '192.168.1.1/24' },
            { name: 'LAN2', type: 'LAN', status: 'UP', ipAddress: '192.168.2.1/24' },
            { name: 'LAN3', type: 'LAN', status: 'UP', ipAddress: '192.168.3.1/24' },
          ],
          bandwidthHistory: genBandwidth(6),
        },
        {
          id: 'mum-edge-02',
          name: 'MUM-EDGE-02',
          siteId: 'site-mum',
          siteName: 'Mumbai-Branch',
          role: 'STANDBY',
          status: 'ONLINE',
          uptime: '5d 14h 28m',
          systemIp: '10.1.1.2',
          model: 'vEdge Cloud',
          interfaces: [
            { name: 'WAN1', type: 'WAN', status: 'UP', ipAddress: '100.64.1.2' },
            { name: 'WAN2', type: 'WAN', status: 'UP', ipAddress: '100.64.2.2' },
            { name: 'LAN1', type: 'LAN', status: 'UP', ipAddress: '192.168.1.2/24' },
          ],
          bandwidthHistory: genBandwidth(6),
        },
      ],
    },
    {
      id: 'site-blr',
      name: 'Bangalore-Branch',
      organizationId: 'org-1',
      status: 'HEALTHY',
      totalEdgeDevices: 2,
      onlineDevices: 2,
      offlineDevices: 0,
      healthyDevices: 2,
      degradedDevices: 0,
      downDevices: 0,
      edgeDevices: [
        {
          id: 'blr-edge-01',
          name: 'BLR-EDGE-01',
          siteId: 'site-blr',
          siteName: 'Bangalore-Branch',
          role: 'ACTIVE',
          status: 'ONLINE',
          uptime: '3d 8h 15m',
          systemIp: '10.2.1.1',
          model: 'vEdge 1000',
          interfaces: [
            { name: 'WAN1', type: 'WAN', status: 'UP', ipAddress: '100.65.1.1' },
            { name: 'WAN2', type: 'WAN', status: 'UP', ipAddress: '100.65.2.1' },
            { name: 'LAN1', type: 'LAN', status: 'UP', ipAddress: '192.168.10.1/24' },
          ],
          bandwidthHistory: genBandwidth(6),
        },
        {
          id: 'blr-edge-02',
          name: 'BLR-EDGE-02',
          siteId: 'site-blr',
          siteName: 'Bangalore-Branch',
          role: 'STANDBY',
          status: 'ONLINE',
          uptime: '3d 8h 10m',
          systemIp: '10.2.1.2',
          model: 'vEdge 1000',
          interfaces: [
            { name: 'WAN1', type: 'WAN', status: 'UP', ipAddress: '100.65.1.2' },
            { name: 'LAN1', type: 'LAN', status: 'UP', ipAddress: '192.168.10.2/24' },
          ],
          bandwidthHistory: genBandwidth(6),
        },
      ],
    },
    {
      id: 'site-pun',
      name: 'Pune-Branch',
      organizationId: 'org-1',
      status: 'DEGRADED',
      totalEdgeDevices: 2,
      onlineDevices: 1,
      offlineDevices: 1,
      healthyDevices: 0,
      degradedDevices: 1,
      downDevices: 0,
      edgeDevices: [
        {
          id: 'pun-edge-01',
          name: 'PUN-EDGE-01',
          siteId: 'site-pun',
          siteName: 'Pune-Branch',
          role: 'ACTIVE',
          status: 'ONLINE',
          uptime: '1d 2h 45m',
          systemIp: '10.3.1.1',
          model: 'vEdge 2000',
          interfaces: [
            { name: 'WAN1', type: 'WAN', status: 'UP', ipAddress: '100.66.1.1' },
            { name: 'WAN2', type: 'WAN', status: 'DOWN', ipAddress: '100.66.2.1' },
            { name: 'LAN1', type: 'LAN', status: 'UP', ipAddress: '192.168.20.1/24' },
          ],
          bandwidthHistory: genBandwidth(6),
        },
        {
          id: 'pun-edge-02',
          name: 'PUN-EDGE-02',
          siteId: 'site-pun',
          siteName: 'Pune-Branch',
          role: 'STANDBY',
          status: 'OFFLINE',
          uptime: '0d 0h 0m',
          systemIp: '10.3.1.2',
          model: 'vEdge 2000',
          interfaces: [
            { name: 'WAN1', type: 'WAN', status: 'DOWN', ipAddress: '100.66.1.2' },
          ],
          bandwidthHistory: genBandwidth(6),
        },
      ],
    },
    {
      id: 'site-che',
      name: 'Chennai-Branch',
      organizationId: 'org-1',
      status: 'DOWN',
      totalEdgeDevices: 2,
      onlineDevices: 0,
      offlineDevices: 2,
      healthyDevices: 0,
      degradedDevices: 0,
      downDevices: 2,
      edgeDevices: [
        {
          id: 'che-edge-01',
          name: 'CHE-EDGE-01',
          siteId: 'site-che',
          siteName: 'Chennai-Branch',
          role: 'ACTIVE',
          status: 'OFFLINE',
          uptime: '0d 0h 0m',
          systemIp: '10.4.1.1',
          model: 'vEdge 1000',
          interfaces: [
            { name: 'WAN1', type: 'WAN', status: 'DOWN', ipAddress: '100.67.1.1' },
          ],
          bandwidthHistory: genBandwidth(6),
        },
        {
          id: 'che-edge-02',
          name: 'CHE-EDGE-02',
          siteId: 'site-che',
          siteName: 'Chennai-Branch',
          role: 'STANDBY',
          status: 'OFFLINE',
          uptime: '0d 0h 0m',
          systemIp: '10.4.1.2',
          model: 'vEdge 1000',
          interfaces: [
            { name: 'WAN1', type: 'WAN', status: 'DOWN', ipAddress: '100.67.1.2' },
          ],
          bandwidthHistory: genBandwidth(6),
        },
      ],
    },
    {
      id: 'site-hyd',
      name: 'Hyderabad-DC',
      organizationId: 'org-1',
      status: 'HEALTHY',
      totalEdgeDevices: 1,
      onlineDevices: 1,
      offlineDevices: 0,
      healthyDevices: 1,
      degradedDevices: 0,
      downDevices: 0,
      edgeDevices: [
        {
          id: 'hyd-edge-01',
          name: 'HYD-EDGE-01',
          siteId: 'site-hyd',
          siteName: 'Hyderabad-DC',
          role: 'ACTIVE',
          status: 'ONLINE',
          uptime: '12d 3h 10m',
          systemIp: '10.5.1.1',
          model: 'vEdge 5000',
          interfaces: [
            { name: 'WAN1', type: 'WAN', status: 'UP', ipAddress: '100.68.1.1' },
            { name: 'WAN2', type: 'WAN', status: 'UP', ipAddress: '100.68.2.1' },
            { name: 'LAN1', type: 'LAN', status: 'UP', ipAddress: '10.5.10.1/24' },
            { name: 'LAN2', type: 'LAN', status: 'UP', ipAddress: '10.5.11.1/24' },
          ],
          bandwidthHistory: genBandwidth(6),
        },
      ],
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class SdwanApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  getHealth() {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }

  private org = RAW;

  // Dashboard overview
  getDashboardSummary(): Observable<DashboardSummary> {
    const summary: DashboardSummary = {
      totalSites: this.org.totalSites,
      totalEdgeDevices: this.org.totalEdgeDevices,
      healthySites: this.org.healthySites,
      degradedSites: this.org.degradedSites,
      downSites: this.org.downSites,
      onlineDevices: this.org.sites.reduce((s, x) => s + x.onlineDevices, 0),
      offlineDevices: this.org.sites.reduce((s, x) => s + x.offlineDevices, 0),
      sites: this.org.sites.map(s => ({
        id: s.id,
        name: s.name,
        status: s.status,
        totalDevices: s.totalEdgeDevices,
        online: s.onlineDevices,
        offline: s.offlineDevices,
      })),
    };
    return of(summary).pipe(delay(200));
  }

  // Organization detail
  getOrganization(): Observable<Organization> {
    return of(this.org).pipe(delay(200));
  }

  // Site detail
  getSite(siteId: string): Observable<Site | undefined> {
    return of(this.org.sites.find(s => s.id === siteId)).pipe(delay(150));
  }

  // Edge device detail
  getEdgeDevice(deviceId: string): Observable<EdgeDevice | undefined> {
    for (const site of this.org.sites) {
      const dev = site.edgeDevices.find(d => d.id === deviceId);
      if (dev) return of(dev).pipe(delay(150));
    }
    return of(undefined);
  }

  // All sites (for nav / listing)
  getAllSites(): Observable<Site[]> {
    return of(this.org.sites).pipe(delay(150));
  }

}
