declare module 'react-apexcharts' {
  import { Component } from 'react';
  import { ApexOptions } from 'apexcharts';

  interface Props {
    type?:
      | 'line'
      | 'area'
      | 'bar'
      | 'pie'
      | 'donut'
      | 'radialBar'
      | 'scatter'
      | 'bubble'
      | 'heatmap'
      | 'candlestick'
      | 'boxPlot'
      | 'radar'
      | 'polarArea'
      | 'rangeBar'
      | 'rangeArea'
      | 'treemap';
    series?: Array<any>;
    width?: string | number;
    height?: string | number;
    options?: ApexOptions;
    [key: string]: any;
  }

  export default class ReactApexChart extends Component<Props> {}
}
