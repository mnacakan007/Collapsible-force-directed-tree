import { AfterViewInit, Component, Inject, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";

import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements AfterViewInit, OnDestroy {
  private chart: am4plugins_wordCloud.WordCloud;

  constructor(@Inject(PLATFORM_ID) private platformId, private zone: NgZone) {}

  // Run the function only in the browser
  // tslint:disable-next-line:typedef
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit(): void {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      this.chartInit();
    });
  }

  chartInit(): void {
    const chart = am4core.create('chart', am4plugins_wordCloud.WordCloud);
    const series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

    series.accuracy = 4;
    series.step = 15;
    series.rotationThreshold = 0.7;
    series.maxCount = 200;
    series.minWordLength = 2;
    series.labels.template.margin(4, 4, 4, 4);
    series.maxFontSize = am4core.percent(30);

    series.text = 'Белеет парус одинокой\n' +
      'В тумане моря голубом!..\n' +
      'Что ищет он в стране далекой?\n' +
      'Что кинул он в краю родном?...\n' +
      '\n' +
      'Играют волны — ветер свищет,\n' +
      'И мачта гнется и скрыпит…\n' +
      'Увы! он счастия не ищет\n' +
      'И не от счастия бежит!\n' +
      '\n' +
      'Под ним струя светлей лазури,\n' +
      'Над ним луч солнца золотой…\n' +
      'А он, мятежный, просит бури,\n' +
      'Как будто в бурях есть покой!\n' +
      '\n' +
      '1832 г.';

    series.colors = new am4core.ColorSet();
    series.colors.passOptions = {}; // makes it loop

    series.angles = [0, -90];
    series.fontWeight = '700';

    setInterval(() => {
      series.dataItems
        .getIndex(Math.round(Math.random() * (series.dataItems.length - 1)))
        .setValue('value', Math.round(Math.random() * 10));
    }, 5000);

    this.chart = chart;
  }

  ngOnDestroy(): void {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
