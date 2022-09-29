import { Component, Input, Output, EventEmitter, OnChanges, OnInit, ViewChild } from "@angular/core";
import { ChartConfiguration, ChartData } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { Compresor } from '../../Constants/compresorConstants';
import { Constants } from '../../Constants/Constants';

@Component({
  selector: "app-stats-tile",
  templateUrl: "./stats-tile.component.html",
  styleUrls: ["./stats-tile.component.scss"],
})
export class StatsTileComponent implements OnInit, OnChanges {
  @Output() goToStatsClicked = new EventEmitter();
  @Input() isLoading: boolean;
  @Input() recordStats = [];
  @Input() compareDateBiggerThan: Date;
  @Input() compareDateLesserThan: Date;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  dataset: any;
  compressorConstants = Compresor;
  dateFormat: string = Constants.DateFormat;
  dataInitialized: boolean = false;
  chartOptionsValue: any;
  chartType: any;

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        formatter: function (value) {
          return Math.round(value);
        },
      },
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: []
  };

  chartPlugins = [DataLabelsPlugin];
  chartColors = ["#0284C7", "#059669", "#CA8A04"] as any;

  ngOnChanges() {
    this.dataInitialized = false;
    this.setPieChartValues();
    this.dataInitialized = true;
  }

  ngOnInit() {

  }

  setPieChartValues() {
    this.pieChartData.datasets[0] = { data: [] };
    this.pieChartData.labels = [];
    this.compressorConstants.Aplicacion.forEach((val) => {
      if (!this.pieChartData.labels?.find(l => l === val)) {
        if (val === 'REFRIGERACIÓN BAJA TEMPERATURA') {
          this.pieChartData.labels.push('BAJA TEMPERATURA');
        }
        if (val === 'REFRIGERACIÓN MEDIA TEMPERATURA') {
          this.pieChartData.labels.push('MEDIA TEMPERATURA');
        }
        if (val === 'AIRE ACONDICIONADO') {
          this.pieChartData.labels.push('AIRE ACONDICIONADO');
        }
      }
      this.pieChartData.datasets[0].data.push(this.recordStats.filter(r => r.aplicacion === val).length);
    });
    this.dataset = this.pieChartData;
    this.chartOptionsValue = this.pieChartOptions;
    this.chartType = 'pie';
    this.chart?.update();
  }

  goToStats() {
    this.goToStatsClicked.emit();
  }

}
