export const commonChartOptions: any = {
  chart: { foreColor: '#a1a5b7', toolbar: { show: false } },
  tooltip: { theme: 'dark' },
  grid: { borderColor: 'rgba(255,255,255,0.05)', strokeDashArray: 4 },
};

export const contactsChart = {
  options: {
    ...commonChartOptions,
    chart: { type: 'bar' as const, sparkline: { enabled: true } },
    plotOptions: { bar: { borderRadius: 2, columnWidth: '60%' } },
    colors: ['#5955D1'],
    xaxis: { crosshairs: { width: 1 } },
  },
  series: [{ data: [12, 14, 25, 42, 28, 45, 30] }]
};

export const leadChart = {
  options: {
    ...commonChartOptions,
    chart: { type: 'line' as const, sparkline: { enabled: true } },
    stroke: { curve: 'smooth' as const, width: 2 },
    colors: ['#5955D1'],
  },
  series: [{ data: [20, 25, 22, 30, 28, 35, 32] }]
};

export const tasksChart = {
  options: {
    ...commonChartOptions,
    chart: { type: 'donut' as const },
    labels: ['Follow-ups', 'In Progress', 'Pending'],
    colors: ['#5955D1', '#423eb3', '#2a2880'],
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: { show: true, name: { show: false }, value: { show: true, color: '#fff', fontSize: '24px', fontWeight: 600 } }
        }
      }
    }
  },
  series: [45, 30, 25]
};

export const trafficChart = {
  options: {
    ...commonChartOptions,
    chart: { type: 'bar' as const, stacked: true },
    plotOptions: { bar: { horizontal: true, borderRadius: 2, barHeight: '20%' } },
    colors: ['#5955D1', '#423eb3', '#2a2880', '#1c1b5e'],
    xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false },
    grid: { show: false },
    legend: { show: false },
    dataLabels: { enabled: false }
  },
  series: [
    { name: 'Organic', data: [41.5] },
    { name: 'Direct', data: [27] },
    { name: 'Referral', data: [18] },
    { name: 'Social', data: [13.5] }
  ]
};

export const revenueChart = {
  options: {
    ...commonChartOptions,
    chart: { type: 'bar' as const },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
    colors: ['#5955D1'],
    dataLabels: { enabled: false },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    yaxis: { labels: { formatter: (val: number) => val + 'K' } }
  },
  series: [{ name: 'Revenue', data: [100, 250, 480, 150, 200, 150, 300, 200, 400, 250, 150, 300] }]
};

export const retentionChart = {
  options: {
    ...commonChartOptions,
    chart: { type: 'bar' as const, stacked: true },
    plotOptions: { bar: { borderRadius: 2, columnWidth: '40%' } },
    colors: ['#5955D1', '#423eb3', '#2a2880'],
    dataLabels: { enabled: false },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    legend: { show: true, position: 'bottom' as const }
  },
  series: [
    { name: 'SMEs', data: [40, 50, 60, 40, 50, 40] },
    { name: 'Startups', data: [20, 30, 40, 30, 20, 30] },
    { name: 'Enterprises', data: [10, 15, 20, 15, 10, 15] }
  ]
};

export const earningChart = {
  options: {
    ...commonChartOptions,
    chart: { type: 'radialBar' as const },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: '60%' },
        track: { background: 'rgba(255,255,255,0.1)' },
        dataLabels: {
          name: { show: false },
          value: { fontSize: '30px', color: '#fff', fontWeight: 700, offsetY: 0, formatter: function (_val: any) { return "$5.7m" } }
        }
      }
    },
    colors: ['#fff'],
    stroke: { lineCap: 'round' as const }
  },
  series: [75]
};

export const heatmapChart = {
  options: {
    ...commonChartOptions,
    chart: { type: 'heatmap' as const, toolbar: { show: false } },
    dataLabels: { enabled: false },
    colors: ['#5955D1'],
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], labels: { style: { fontSize: '10px' } } },
    yaxis: { labels: { style: { fontSize: '10px' } } },
    plotOptions: { heatmap: { radius: 2, colorScale: { ranges: [{ from: 0, to: 20, color: '#e5e7eb' }, { from: 21, to: 100, color: '#5955D1' }] } } }
  },
  series: [
    { name: '4pm', data: [10, 20, 30, 10, 50, 10, 20] },
    { name: '2pm', data: [40, 10, 20, 80, 10, 30, 10] },
    { name: '12pm', data: [20, 50, 10, 20, 30, 10, 40] },
    { name: '10am', data: [10, 20, 60, 10, 20, 50, 10] },
    { name: '8am', data: [30, 10, 20, 40, 10, 20, 30] },
  ]
};
