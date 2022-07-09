import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// components
import BaseOptionChart from './options';

// ----------------------------------------------------------------------

interface ChartData {
    label: string,
    value: number
}

interface AppConversionRatesProps {
    title: string,
    subheader: string,
    chartData: ChartData[]
}

export default function AppConversionRates({ title, subheader, chartData, ...other }: AppConversionRatesProps) {
  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName: number) => `₱ ${seriesName.toFixed(2)}`,
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 },
    },
    xaxis: {
      categories: chartLabels,
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions as any} height={364} />
      </Box>
    </Card>
  );
}
