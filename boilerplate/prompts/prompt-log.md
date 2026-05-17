# Prompt Log

Use this file to document meaningful AI interactions during the assignment.

## Entry Template

### Date

`2026-05-14`

### Goal

Set up the local development environment and understand the starter project structure.

### Exact Prompt

```text
I need to complete a task and I need to install these

- Java 17+
- Maven 3.9+
- Node.js 20+
- npm 10+

do we have any online portal for that or I need to download ??
```

### Files / Context Provided

- `boilerplate\boilerplate\README.md`
- `boilerplate\boilerplate\instruction.md`

### Output Summary

The AI explained the required installations, environment variable setup, and how to verify Java, Maven, Node.js, and npm versions locally.

### What I Kept

- Version verification commands
- PATH setup guidance
- Local setup sequence

### What I Changed Manually

- Installed tools based on my Windows setup
- Adjusted environment variables manually

### What AI Missed Or Got Wrong

- Needed additional clarification for Angular CLI installation
- Maven PATH setup required extra troubleshooting

### Reusable?

`yes`, because the setup steps are reusable for similar Angular + Spring Boot projects..

---


### Date

`2026-05-14`

### Goal

Fix Angular CLI issues and generate initial shared components.

### Exact Prompt

```C:\Users\DELLSC\Downloads\boilerplate\boilerplate\frontend\src\app\shared>ng g c sidebar
'ng' is not recognized as an internal or external command,
operable program or batch file..
```

### Files / Context Provided

- `frontend/package.json`
- `boilerplate/instruction.md`

### Output Summary

The AI suggested installing Angular CLI globally and validating the installation using version commands.

### What I Kept

- Angular CLI installation command
- Verification approach using ng version

### What I Changed Manually

- Restarted terminal after PATH update
- Installed project dependencies before generating components

### What AI Missed Or Got Wrong

- Needed reminder to restart VS Code terminal after installation

### Reusable?

`yes` because Angular CLI issues are common during fresh setup.

### Date

`2026-05-15`

### Goal

Plan the SD-WAN dashboard frontend structure and initial UI flow.

### Exact Prompt

```I have a minimal Angular + Spring Boot starter for an SD-WAN dashboard assignment.
Help me define:
- backend contracts for organization, site, and device views
- the first Angular routes/screens to implement
- the smallest useful validation steps after each slice

Use deterministic mock data and include the site health aggregation rules.
```

### Files / Context Provided

- `frontend/src/app/app.component.ts`
- `instruction.md`

### Output Summary

The AI suggested dashboard flow, endpoint separation, mock data strategy, and incremental UI implementation steps.

### What I Kept

- Incremental screen-building order
- Mock data approach
- Site health aggregation idea

### What I Changed Manually

- Simplified some API response fields
- Adjusted naming conventions to match project structure

### What AI Missed Or Got Wrong

- Needed more explicit WAN device filtering logic
- Error-state handling needed refinement

### Reusable?

`yes` because it provided a good foundation for the assignment flow.

### Date

`2026-05-15`

### Goal

Design the dashboard header and breadcrumb section.

### Exact Prompt

```make a div in which it should look like

Overview -> color grey small font
SD-WAN Dashboard -> black font h3 or h2

Add breadcrumb arrows or slash.
```

### Files / Context Provided

- `frontend/src/app/shared/breadcrumb`
- `frontend/src/app/dashboard`

### Output Summary

The AI suggested a breadcrumb layout using flex styling, typography hierarchy, and reusable Angular HTML structure.

### What I Kept

- Breadcrumb structure
- Typography spacing
- Flex alignment approach

### What I Changed Manually

- Reused existing breadcrumb component
- Updated spacing and colors to match the dashboard theme

### What AI Missed Or Got Wrong

- Initial spacing looked too large for compact dashboard layout
- Error-state handling needed refinement

### Reusable?

`yes` because breadcrumb styling can be reused across components.

### Date

`2026-05-16`

### Goal

Implement site health charts and calculate aggregated totals dynamically.

### Exact Prompt

```I need total online offline from below code

as x label is printing data only that time on sum I need
```

### Files / Context Provided

- `frontend/src/app/dashboard/site-detail.component.ts`

### Output Summary

The AI suggested using reduce() to calculate totals from chart data and recommended reusable helper methods for aggregation.

### What I Kept

- reduce() based aggregation logic
- Reusable total helper function
- Safer TypeScript typing approach

### What I Changed Manually

- Added stricter TypeScript types
- Integrated totals with chart label rendering
- Adjusted formatting for current visible range only

### What AI Missed Or Got Wrong

- Initial implementation caused TypeScript indexing issues
- Needed explicit union type for chart keys

### Reusable?

`yes` because the aggregation helper can be reused for multiple dashboard widgets.

### Date

`2026-05-16`

### Goal

Filter chart data by date range and display only selected duration totals..

### Exact Prompt

```any best way to find out only particular duration as coming as {t: 1767225600000, online: 686, offline: 43}

t should be time
```

### Files / Context Provided

- `frontend/src/app/dashboard/dashboard.component.ts`

### Output Summary

The AI suggested filtering timestamp-based data using start and end dates before calculating totals..

### What I Kept

- Timestamp filtering approach
- Date range helper function
- reduce() after filtering

### What I Changed Manually

- Adjusted formatting using existing utility methods
- Linked filtering with selected UI range buttons

### What AI Missed Or Got Wrong

- Needed better timezone handling consideration

### Reusable?

`yes` because date-range filtering logic applies to all time-series widgets.

### Date
 
`2026-05-14`
 
### Goal
 
Process a large SD-WAN JSON dataset and display it in an Angular 17 dashboard.
 
### Exact Prompt
 
```
I need to process this file — I need to read this file and use it in Angular 17 for showing data.
[Uploaded: chart-api-datasets.json]
```
 
### Files / Context Provided
 
- `chart-api-datasets.json` (uploaded)
### Output Summary
 
Analysed the JSON structure (6 datasets, 100k–200k points each). Downsampled each dataset to 500 points using every-nth sampling and wrote a compact `data.json`. Generated a standalone `index.html` dashboard with Chart.js, an Angular 17 data service (`sdwan-data.service.ts`) with typed Observables, and a full dashboard component with stacked-area, stacked-bar, and dual-line charts.
 
### What I Kept
 
- `SdwanDataService` with `shareReplay(1)` caching
- `downsample()` utility function
- Typed interfaces for all 6 datasets
### What I Changed Manually
 
- Renamed dataset keys to shorter aliases in the asset file
- Adjusted chart heights to fit the project layout
### What AI Missed Or Got Wrong
 
- Initial standalone HTML used `fetch()` which fails when opened as a `file://` URL — needed a follow-up fix to embed data inline.
### Reusable?
 
`yes` — the downsampling pattern and typed service are reusable for any large time-series JSON.
 
---

### Date
 
`2026-05-14`
 
### Goal
 
Fix the standalone `index.html` — it crashed with "Failed to fetch" when opened directly from the filesystem.
 
### Exact Prompt
 
```
When I click on index.html I get:
ERROR: Failed to fetch. Make sure data.json is in the same folder.
```
 
### Files / Context Provided
 
- `index.html` (previously generated)
- `data.json`
### Output Summary
 
Identified that `fetch()` is blocked on `file://` URLs due to browser CORS policy. Patched `index.html` by embedding the entire `data.json` as an inline JavaScript variable (`__INLINE_DATA__`) inside a `<script>` tag, replacing the fetch call with a direct reference. Final file size was ~162 KB and works by double-clicking.
 
### What I Kept
 
- The inline data embedding approach
- All chart logic remained unchanged
### What I Changed Manually
 
- Nothing in the chart code — only the data-loading mechanism was replaced
### What AI Missed Or Got Wrong
 
- Should have anticipated the `file://` restriction upfront and offered the inline approach as the default for a standalone file.
### Reusable?
 
`yes` — the inline embedding pattern is useful for any single-file demo that needs to ship with data.
 
---

### Date
 
`2026-05-14`
 
### Goal
 
Resolve `ng2-charts` peer dependency conflict when installing on an Angular 17 project.
 
### Exact Prompt
 
```
npm install chart.js ng2-charts
npm error ERESOLVE unable to resolve dependency tree
Found: @angular/common@17.3.12
peer @angular/common@"^21.0.0 || ^22.0.0" from ng2-charts@10.0.0
```
 
### Files / Context Provided
 
- `package.json` (implied from error output)
### Output Summary
 
Explained that `ng2-charts@10` requires Angular 21+. Provided a version compatibility table and the correct install command: `npm install chart.js ng2-charts@6` — the version built for Angular 16–17. Also provided `NgChartsModule` setup in `app.config.ts` and a `--legacy-peer-deps` fallback.
 
### What I Kept
 
- `npm install chart.js ng2-charts@6`
- `NgChartsModule` registration via `importProvidersFrom`
### What I Changed Manually
 
- Nothing — the suggestion worked as-is
### What AI Missed Or Got Wrong
 
- Did not proactively warn about this version mismatch when `ng2-charts` was first recommended.
### Reusable?
 
`yes` — the Angular / ng2-charts compatibility table is useful for any Angular version upgrade scenario.
 
---

### Date
 
`2026-05-15`
 
### Goal
 
Scaffold all 4 pages of the SD-WAN dashboard matching provided design screenshots.
 
### Exact Prompt
 
```
I need to make these pages — do one by one.
[Uploaded: final-overview.png, final-organization.png, final-site.png, final-edge.png]
```
 
### Files / Context Provided
 
- `final-overview.png`
- `final-organization.png`
- `final-site.png`
- `final-edge.png`
### Output Summary
 
Generated 22 files covering the full `src/app` structure: TypeScript models (`sdwan.models.ts`), `MockDataService` with 5 sites and 9 devices, app routes with lazy loading, `ShellComponent` (sidebar + topbar), shared `StatusBadgeComponent`, and all 4 feature components — `DashboardComponent` (donut charts + site table), `OrganizationComponent` (KPI cards + sites table), `SiteComponent` (edge device table), `DeviceComponent` (port status tables + SVG bandwidth chart). Global SCSS and `styles.scss` also included.
 
### What I Kept
 
- All 22 files — models, service, shell, status badge, and all 4 feature components used directly
### What I Changed Manually
 
- Renamed `DeviceComponent` selector and file to `device-detail` per project convention
- Adjusted SCSS colour variables to match existing project theme
### What AI Missed Or Got Wrong
 
- SVG bandwidth chart in `DeviceComponent` was later replaced with ECharts — should have used ECharts from the start.
### Reusable?
 
`yes` — the shell layout, status badge, and model structure are reusable across any Angular dashboard project.
 
---
### Date
 
`2026-05-15`
 
### Goal
 
Replace SVG donut charts in `DashboardComponent` with ECharts pie charts using `ngx-echarts`.
 
### Exact Prompt
 
```typescript
deviceChartOptions: EChartsOption = {
  tooltip: { trigger: 'item' },
  series: [{
    name: 'Device Status',
    type: 'pie',
    radius: ['55%', '75%'],
    label: {
      formatter: `${this.summary?.totalEdgeDevices ?? 0}\nDevices`
    },
    data: [
      { value: this.summary?.onlineDevices ?? 0, name: 'Online' },
      { value: this.summary?.offlineDevices ?? 0, name: 'Offline' }
    ]
  }]
};
```
 
### Files / Context Provided
 
- `dashboard.component.ts` (existing)
### Output Summary
 
Identified the bug: `deviceChartOptions` was initialised as a class field, so `this.summary` was still `null` at that point and the formatter always rendered `0`. Moved chart building into a `buildCharts()` method called after data arrives in `ngOnInit`. Provided updated component with both `siteChartOptions` and `deviceChartOptions`, plus simplified HTML using the `echarts` directive.
 
### What I Kept
 
- ECharts config structure, `buildCharts()` pattern, `NgxEchartsDirective` import
### What I Changed Manually
 
- Added `lineHeight: 24` to the center label so the two-line text stacks cleanly
### What AI Missed Or Got Wrong
 
- Did not mention that `ngx-echarts` needs `provideEcharts()` in the initial scaffold — required a follow-up.
### Reusable?
 
`yes` — the `buildCharts()`-after-subscribe pattern avoids null reference bugs in any component that builds charts from async data.
 
---
### Date
 
`2026-05-15`
 
### Goal
 
Replace SVG line chart in `DeviceComponent` with ECharts dual-line bandwidth chart.
 
### Exact Prompt
 
```typescript
private buildChart(d) {
  tooltip: { trigger: 'axis' },
  series: [
    { name: 'WAN1', type: 'line', smooth: true, data: [40, 52, 48, 61, 42, 58, 44, 57] },
    { name: 'WAN2', type: 'line', smooth: true, data: [18, 27, 22, 31, 24, 29, 20, 28] }
  ]
}
```
 
### Files / Context Provided
 
- `device.component.ts` (existing)
- `device.component.html` (existing)
### Output Summary
 
Fixed two bugs in the provided snippet: the object literal was not assigned to anything (missing return / assignment), and data arrays were hardcoded. Rewrote `buildBandwidthChart()` to derive labels from real `BandwidthPoint` timestamps, compute stats from live data, and assign to `this.bandwidthChartOptions`. Added `FormsModule` for the range selector.
 
### What I Kept
 
- ECharts config structure (tooltip axis, grid containLabel, smooth line series)
- Stats cards below the chart
### What I Changed Manually
 
- Data arrays now come from `pts: WanBandwidthPoint[]` parameter
- Labels generated from real timestamps using `toLocaleTimeString`
### What AI Missed Or Got Wrong
 
- The `(change)` handler for the range dropdown was not wired — chart did not react to range changes until the next session.
### Reusable?
 
`yes` — the pattern of deriving labels and data arrays from a typed points array is reusable for any time-series line chart.

### Date
 
`2026-05-15`
 
### Goal
 
Make the Time Range dropdown actually update the bandwidth chart.
 
### Exact Prompt
 
```
In device component if user changes the value of selectedRange — what will happen?
<select [(ngModel)]="selectedRange">
  <option *ngFor="let r of ranges">{{ r }}</option>
</select>
```
 
### Files / Context Provided
 
- `device.component.ts` (existing)
- `device.component.html` (existing)
### Output Summary
 
Explained that nothing happened — `selectedRange` updated in the model but no code reacted. Implemented a getter/setter pattern where `set selectedRange(value)` calls `applyRange()`, which slices the last `n` points from stored full datasets and rebuilds all 3 charts. Added `rangePointsMap` to translate label strings to point counts.
 
### What I Kept
 
- Getter/setter pattern for `selectedRange`
- `rangePointsMap`, `applyRange()` method
- Stored full dataset arrays on the component
### What I Changed Manually
 
- Nothing — implemented as suggested
### What AI Missed Or Got Wrong
 
- Did not anticipate the edge case where `slice(-0)` returns the full array — caught in the next session.
### Reusable?
 
`yes` — the getter/setter approach for triggering chart updates on model changes avoids `(change)` event clutter in templates.
 
---

### Date
 
`2026-05-15`
 
### Goal
 
Fix "Reduce of empty array with no initial value" crash when changing the time range dropdown.
 
### Exact Prompt
 
```
ERROR TypeError: Reduce of empty array with no initial value
    at avg (device-detail.component.ts:215:42)
    at _DeviceDetailComponent.buildBandwidthChart
```
 
### Files / Context Provided
 
- `device.component.ts` (existing)
### Output Summary
 
Identified two causes: `.reduce((a, b) => a + b)` with no initial value crashes on empty arrays, and `slice(-n)` where `n >= array.length` returns empty in edge cases. Fixed by adding `, 0` as the initial value to all `reduce()` calls, adding `if (!pts?.length) return` guards, and clamping `n` with `Math.min` in `applyRange()`.
 
### What I Kept
 
- All three fixes applied together
### What I Changed Manually
 
- Nothing beyond the suggested fixes
### What AI Missed Or Got Wrong
 
- The `slice(-0)` edge case should have been caught when `rangePointsMap` was first introduced.
### Reusable?
 
`yes` — always provide an initial value to `reduce()` and guard chart-build methods against empty arrays.

---

### Date
 
`2026-05-16`
 
### Goal
 
Replace hardcoded KPI numbers (`totalSites: 5`, `totalEdgeDevices: 9`) with values computed dynamically from the sites array.
 
### Exact Prompt
 
```
Why does it always show 5 sites and 9 devices?
```
 
### Files / Context Provided
 
- `mock-data.service.ts` (existing)
- `sdwan.models.ts` (existing)
### Output Summary
 
Explained that `totalSites`, `healthySites`, `degradedSites`, `downSites`, and `totalEdgeDevices` were hardcoded in the `RAW` constant and copied directly into `getDashboardSummary()` without reading the actual arrays. Removed those 5 fields from the `Organization` interface and `RAW` object, and rewrote the service methods to compute all counts dynamically using `sites.length`, `sites.filter()`, and `sites.reduce()`.
 
### What I Kept
 
- Dynamic computation in `getDashboardSummary()` and `getOrganization()`
- Removed hardcoded fields entirely
### What I Changed Manually
 
- Also removed redundant computed fields from the `Site` interface since those are also derivable
### What AI Missed Or Got Wrong
 
- Should have made all counts computed from the start — hardcoding them was a shortcut that created confusion.
### Reusable?
 
`yes` — always derive aggregate counts from the source array rather than maintaining them as separate fields.
 
---

### Date
 
`2026-05-16`
 
### Goal
 
Load chart data from the attached `sdwan-datasets.json` file instead of mock bandwidth history.
 
### Exact Prompt
 
```
Now tell me — all code is working fine with mock data, right?
Can we use this attached JSON file to show graphs in Dashboard and Device component?
[Uploaded: sdwan-datasets.json]
```
 
### Files / Context Provided
 
- `sdwan-datasets.json` (uploaded)
- `dashboard.component.ts`
- `device.component.ts`
- `mock-data.service.ts`
### Output Summary
 
Analysed the JSON (6 datasets with 100k–200k points). Downsampled each to 300 points and wrote `sdwan-chart-data.json`. Created `chart-data.models.ts` with typed interfaces and `chart-data.service.ts` using `HttpClient` with `shareReplay(1)` and `catchError`. Updated `DashboardComponent` with `forkJoin` loading both mock summary and JSON chart data in parallel, adding a stacked-area site health trend and stacked-bar edge availability chart. Updated `DeviceComponent` with 3 JSON-powered charts: bandwidth (dual-line), latency, and packet loss.
 
### What I Kept
 
- `ChartDataService` with `shareReplay` caching
- `forkJoin` parallel loading pattern
- All 3 device charts and typed models
### What I Changed Manually
 
- Adjusted chart colours to match the existing dashboard theme
### What AI Missed Or Got Wrong
 
- The `sdwan-chart-data.json` file copy to `src/assets/` was not included as an explicit step — caused the next debugging session.
### Reusable?
 
`yes` — the `ChartDataService` pattern with `shareReplay(1)` and `catchError` is the standard approach for loading static JSON chart data in Angular.
 
---

### Date
 
`2026-05-16`
 
### Goal
 
Fix bandwidth chart showing blank with 0 Mbps stats after switching to JSON data.
 
### Exact Prompt
 
```
Graph is not rendering.
[Screenshot: blank chart area, WAN1 0 Mbps, WAN2 0 Mbps]
bandwidth points: coming as []
```
 
### Files / Context Provided
 
- `device.component.ts`
- `chart-data.service.ts`
- `src/assets/sdwan-chart-data.json`
### Output Summary
 
Added `tap()` logging in the service to inspect the raw HTTP response. Diagnosed that the asset file in `src/assets/` was the original undownsampled file with different key names (`wanBandwidthTrend100k` vs `wanBandwidth`). Provided the fix: replace the asset file with the correctly downsampled version, and add `[initOpts]="{ width: 'auto', height: 220 }"` to the `echarts` directive to prevent blank chart rendering when the container height is resolved after init.
 
### What I Kept
 
- The `tap()` debug logging approach
- The `[initOpts]` fix on the `echarts` directive
### What I Changed Manually
 
- Replaced the asset file with the correctly downsampled `sdwan-chart-data.json`
### What AI Missed Or Got Wrong
 
- The asset file copy step should have been included as an explicit instruction in the previous session.
### Reusable?
 
`yes` — always add `[initOpts]` with explicit height to `ngx-echarts` directives to prevent blank chart rendering.
 
---

### Date
 
`2026-05-16`
 
### Goal
 
Add a total sites line to the Site Health Trend chart showing the sum of healthy + degraded + down at each timestamp.
 
### Exact Prompt
 
```
In buildSiteHealthChart I need the total of all healthy, degraded and down sites
at a particular time displayed in the graph.
```
 
### Files / Context Provided
 
- `dashboard.component.ts` — existing `buildSiteHealthChart` method
### Output Summary
 
Added a `totalData` computed array: `pts.map(p => p.healthy + p.degraded + p.down)`. Added a fourth series (`Total`) as a dashed dark line with no `stack` property so it floats above the stacked areas at the correct sum value. Updated the tooltip formatter to display all four values on hover.
 
### What I Kept
 
- `totalData` computation
- The unstacked `Total` series with dashed line style
- Custom tooltip formatter showing breakdown + total
### What I Changed Manually
 
- Adjusted the dashed line colour to a slightly lighter shade for better contrast
### What AI Missed Or Got Wrong
 
- Nothing significant.
### Reusable?
 
`yes` — the pattern of adding an unstacked total series on top of stacked series is applicable to any stacked chart that needs a visible sum line.

