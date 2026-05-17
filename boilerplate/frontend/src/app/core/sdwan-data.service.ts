// src/app/services/sdwan-data.service.ts
// Angular 17 — inject this service into any component via inject()

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, tap } from 'rxjs';

// ── Raw JSON shape ────────────────────────────────────────────────────────────

export interface SiteHealthPoint { t: number; healthy: number; degraded: number; down: number; }
export interface EdgeAvailPoint { t: number; online: number; offline: number; }
export interface WanBandwidthPoint { t: number; wan1: number; wan2: number; }
export interface LatencyPoint { t: number; latencyMs: number; }
export interface PacketLossPoint { t: number; packetLossPct: number; }

export type ChartType = 'stacked-area' | 'stacked-bar' | 'dual-line' | 'line';

export interface DatasetMeta<T> {
    api: string;
    chartType: ChartType;
    pointCount: number;
    stepMs: number;
    points: T[];
}

export interface SdwanDatasets {
    siteHealthTrend100k: DatasetMeta<SiteHealthPoint>;
    edgeAvailabilityTrend100k: DatasetMeta<EdgeAvailPoint>;
    wanBandwidthTrend100k: DatasetMeta<WanBandwidthPoint>;
    latencyTrend100k: DatasetMeta<LatencyPoint>;
    packetLossTrend100k: DatasetMeta<PacketLossPoint>;
    wanBandwidthTrend200k: DatasetMeta<WanBandwidthPoint>;
}

export interface SdwanPayload {
    generatedAt: string;
    description: string;
    notes: string[];
    datasets: SdwanDatasets;
}

// ── Downsampler (LTTB-lite: every-nth for performance) ───────────────────────

function downsample<T>(points: T[], maxPoints: number): T[] {
    if (points.length <= maxPoints) return points;
    const step = Math.ceil(points.length / maxPoints);
    return points.filter((_, i) => i % step === 0).slice(0, maxPoints);
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SdwanDataService {
    private http = inject(HttpClient);

    /**
     * Fetch the full JSON from assets (copy chart-api-datasets.json to
     * src/assets/sdwan-datasets.json) and return the parsed payload.
     * The result is shared/replayed so the file is fetched only once.
     */
    private payload$: Observable<SdwanPayload> = this.http
        .get<SdwanPayload>('/assets/sdwan-datasets.json')
        .pipe(tap(raw => console.log('[ChartDataService] raw response:', raw)),  // ← add this
            shareReplay(1));

    /** Raw payload — use when you need all metadata */
    getPayload(): Observable<SdwanPayload> {
        return this.payload$;
    }

    /** Site-health stacked-area data, downsampled to `maxPoints` */
    getSiteHealth(maxPoints = 500): Observable<SiteHealthPoint[]> {
        return this.payload$.pipe(
            map(p => downsample(p.datasets.siteHealthTrend100k.points, maxPoints))
        );
    }

    /** Edge-availability stacked-bar data */
    getEdgeAvailability(maxPoints = 500): Observable<EdgeAvailPoint[]> {
        return this.payload$.pipe(
            map(p => downsample(p.datasets.edgeAvailabilityTrend100k.points, maxPoints))
        );
    }

    /** WAN bandwidth (100k dataset) */
    getWanBandwidth100k(maxPoints = 500): Observable<WanBandwidthPoint[]> {
        return this.payload$.pipe(
            map(p => downsample(p.datasets.wanBandwidthTrend100k.points, maxPoints))
        );
    }

    /** WAN bandwidth (200k stress-test dataset) */
    getWanBandwidth200k(maxPoints = 500): Observable<WanBandwidthPoint[]> {
        return this.payload$.pipe(
            map(p => downsample(p.datasets.wanBandwidthTrend200k.points, maxPoints))
        );
    }

    /** Latency trend */
    getLatency(maxPoints = 500): Observable<LatencyPoint[]> {
        return this.payload$.pipe(
            map(p => downsample(p.datasets.latencyTrend100k.points, maxPoints))
        );
    }

    /** Packet-loss trend */
    getPacketLoss(maxPoints = 500): Observable<PacketLossPoint[]> {
        return this.payload$.pipe(
            map(p => downsample(p.datasets.packetLossTrend100k.points, maxPoints))
        );
    }
}