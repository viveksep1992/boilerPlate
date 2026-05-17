import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';

import * as echarts from 'echarts/core';

import {
  BarChart,
  LineChart,
  PieChart,
} from 'echarts/charts';

import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';


import {
  CanvasRenderer
} from 'echarts/renderers';
import { importProvidersFrom } from '@angular/core';

echarts.use([
  PieChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
  LineChart,
  BarChart
]);


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideEchartsCore({ echarts }),
    importProvidersFrom(NgxEchartsModule)
  ]
}).catch((error) => console.error(error));
