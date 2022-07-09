import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import BaseOptionChart from './options';

// ----------------------------------------------------------------------

interface ChartData {
    name: string,
    type: any,
    fill: any,
    data: number[],
}

interface AppWebsiteVisitsProps {
    title: string,
    subheader: string,
    chartData: ChartData[],
    chartLabels: string[],
}

export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, ...other }: AppWebsiteVisitsProps) {
  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y: number) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} Delivered Orders`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chartData} options={chartOptions as any} height={364} />
      </Box>
    </Card>
  );
}
