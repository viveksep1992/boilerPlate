export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
  assignment: string;
}

// ── Enums ─────────────────────────────────────────────────────────────────────

export type SiteStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN';
export type DeviceStatus = 'ONLINE' | 'OFFLINE';
export type DeviceRole = 'ACTIVE' | 'STANDBY' | 'CONTROLLER';
export type InterfaceStatus = 'UP' | 'DOWN';
export type InterfaceType = 'WAN' | 'LAN';

// ── Interface ──────────────────────────────────────────────────────────────────

export interface EdgeInterface {
  name: string;
  type: InterfaceType;
  status: InterfaceStatus;
  ipAddress: string;
}

// ── Edge Device ───────────────────────────────────────────────────────────────

export interface BandwidthPoint {
  timestamp: string;     // ISO string
  wan1Mbps: number;
  wan2Mbps: number;
}

export interface EdgeDevice {
  id: string;            // e.g. "mum-edge-01"
  name: string;          // e.g. "MUM-EDGE-01"
  siteId: string;
  siteName: string;
  role: DeviceRole;
  status: DeviceStatus;
  uptime: string;        // human-readable "5d 14h 32m"
  systemIp: string;
  model: string;
  interfaces: EdgeInterface[];
  bandwidthHistory: BandwidthPoint[];
}

// ── Site ──────────────────────────────────────────────────────────────────────

export interface Site {
  id: string;
  name: string;
  organizationId: string;
  status: SiteStatus;
  edgeDevices: EdgeDevice[];
  // computed
  totalEdgeDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  healthyDevices: number;
  degradedDevices: number;
  downDevices: number;
}

// ── Organization ──────────────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  sites: Site[];
  totalSites: number;
  healthySites: number;
  degradedSites: number;
  downSites: number;
  totalEdgeDevices: number;
}

// ── Dashboard Summary ─────────────────────────────────────────────────────────

export interface DashboardSummary {
  totalSites: number;
  totalEdgeDevices: number;
  healthySites: number;
  degradedSites: number;
  downSites: number;
  onlineDevices: number;
  offlineDevices: number;
  sites: SiteSummary[];
}

export interface SiteSummary {
  id: string;
  name: string;
  status: SiteStatus;
  totalDevices: number;
  online: number;
  offline: number;
}
