import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/shared/services/user.service';
import { Compresor } from 'src/app/shared/Constants/compresorConstants';
import * as date_fns from 'date-fns';
import { StatsService } from 'src/app/shared/services/server-connection/stats.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { Constants } from 'src/app/shared/Constants/Constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  compressorConstants = Compresor;
  records: any[] = [];
  currentRecordLength: number;
  customDate: Date;

  dataInitialized: boolean = false;
  dateFormat: string = Constants.DateFormat;
  dateFilter: string;
  datePlaceholder: string;
  selectOptions = [
    'Aplicación',
    'Refrigerante',
    'HP'];
  dataArray = [];
  filterData: {
    username: string,
    compareDateBiggerThan: Date,
    compareDateLesserThan: Date
  };
  filterForm: FormGroup;
  formChanges: Subscription;
  // CHART DISPLAY SETTINGS
  dataset: any;
  chartOptionsValue: any;
  chartType: any;
  chartPlugins = [DataLabelsPlugin];
  chartColors = ["#0284C7", "#059669", "#CA8A04"] as any;

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: this.chartColors,

    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        ticks: {
          font: {
            size: 8
          }
        }
      },
      y: {
        suggestedMax:50,
        beginAtZero: true,
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: function (value) {
          return Math.round(value);
        },
        font: {
          weight: 'bold',
          size: 12,
        }
      }
    }
  };

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

  barChartType: ChartType = 'bar';

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: []
  };

  get user() {
    return this.userService.user;
  }

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    private statsService: StatsService,
    private formBuilder: FormBuilder
  ) {
  }


  async ngOnInit() {
    this.filterData = null;
    this.spinnerService.show();
    this.dataInitialized = false;
    this.createFilterForm();
    this.formChanges = this.filterForm.valueChanges.subscribe(() => {
      this.changeFilterValue();
    })
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const initialData = {
      username: this.user.username,
      compareDateBiggerThan: firstDay,
      compareDateLesserThan: lastDay
    };
    this.filterData = initialData;
    this.records = (await this.statsService.getFilteredStats(initialData)).result;
    this.currentRecordLength = this.records.length;
    this.setPieChartValues(this.filterForm.controls.filter.value);
    this.dataInitialized = true;
    this.chart?.update();
    this.spinnerService.hide();
  }

  ngOnDestroy(): void {
    if (this.formChanges) {
      this.formChanges.unsubscribe();
    }
  }

  createFilterForm() {
    this.filterForm = this.formBuilder.group({
      filter: ['Aplicación']
    });
  }

  changeFilterValue() {
    switch (this.filterForm.controls.filter.value) {
      case 'Aplicación':
        this.setPieChartValues(this.filterForm.controls.filter.value);
        break;
      case 'Refrigerante':
        this.setPieChartValues(this.filterForm.controls.filter.value);
        break;
      case 'HP':
        this.setBarChartValues();
        break;
      default:
        break;
    }
  }

  async setupRecordData(initialData) {
    this.filterData = initialData;
    this.records = (await this.statsService.getFilteredStats(initialData)).result;
    if (this.filterForm.controls.filter.value === 'Aplicación' || this.filterForm.controls.filter.value === 'Refrigerante') {
      this.setPieChartValues(this.filterForm.controls.filter.value);
    }
    if (this.filterForm.controls.filter.value === 'HP') {
      this.setBarChartValues();
    }
    this.currentRecordLength = this.records.length;
  }

  async onTotalSelected() {
    this.spinnerService.show();
    const longTimeBack = new Date('1/1/2000');
    const today = new Date();
    const initialData = {
      username: this.user.username,
      compareDateBiggerThan: longTimeBack,
      compareDateLesserThan: today
    };
    await this.setupRecordData(initialData);
    this.chart?.update();
    this.spinnerService.hide();
  }

  async onYearSelected(event: any) {
    this.spinnerService.show();
    const startOfYear = date_fns.startOfYear(event);
    const endOfYear = date_fns.endOfYear(event);
    const initialData = {
      username: this.user.username,
      compareDateBiggerThan: startOfYear,
      compareDateLesserThan: endOfYear
    };
    await this.setupRecordData(initialData);
    this.chart?.update();
    this.spinnerService.hide();
  }

  async onMonthSelected(event: any) {
    this.spinnerService.show();
    const startOfMonth = date_fns.startOfMonth(event);
    const endOfMonth = date_fns.endOfMonth(event);
    const initialData = {
      username: this.user.username,
      compareDateBiggerThan: startOfMonth,
      compareDateLesserThan: endOfMonth
    };
    await this.setupRecordData(initialData);
    this.chart?.update();
    this.spinnerService.hide();
  }


  setPieChartValues(type: string) {
    this.spinnerService.show();
    this.pieChartData.datasets[0] = { data: [] };
    this.pieChartData.labels = [];
    if (type === 'Refrigerante') {
      this.compressorConstants.Refrigerante.forEach((val) => {
        if (!this.pieChartData.labels?.find(l => l === val)) {
          this.pieChartData.labels.push(val);
        }
        this.pieChartData.datasets[0].data.push(this.records.filter(r => r.refrigerante === val).length);
      });
    }
    if (type === 'Aplicación') {
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
        this.pieChartData.datasets[0].data.push(this.records.filter(r => r.aplicacion === val).length);
      });
    }

    this.dataset = this.pieChartData;
    this.chartOptionsValue = this.pieChartOptions;
    this.chartType = 'pie';
    this.chart?.update();
    this.spinnerService.hide();
  }

  setBarChartValues() {
    this.spinnerService.show();
    this.dataArray = [];
    this.barChartData.datasets[0] = { data: [] };
    this.barChartData.labels = [];
    this.compressorConstants.HP.forEach((val) => {
        if (!this.barChartData.labels?.find(l => l === val)) {
          this.barChartData.labels.push(val);
        }
        this.barChartData.datasets[0].data.push(this.records.filter(r => r.hp === val).length);
    });
     
    this.dataset = this.barChartData;
    this.chartOptionsValue = this.chartOptions;
    let maxData = Math.round((Math.max(...this.barChartData.datasets[0].data.map(o => o)) + 8) / 10);
    this.chartOptionsValue.scales.y.max = maxData*10;
    this.chartType = this.barChartType;
    this.chart?.update();
    this.spinnerService.hide();
  }

  async changeDateFilter(event: any) {
    this.dateFilter = event.detail.value;
    if (this.dateFilter === 'month') {
      this.datePlaceholder = 'Elegir un mes';
    }
    if (this.dateFilter === 'year') {
      this.datePlaceholder = 'Elegir un año';
    }
    if (this.dateFilter === 'total') {
      this.datePlaceholder = null;
      await this.onTotalSelected();
    }
  }

  exit() {
    this.navCtrl.navigateBack('hub');
  }

}
