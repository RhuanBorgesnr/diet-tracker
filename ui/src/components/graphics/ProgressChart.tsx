import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface ProgressData {
  date: string;
  currentWeight: number;
  idealWeight: number;
}

const ProgressChart = ({ data }: { data: ProgressData[] }) => {
  const categories = data.map((item) => item.date);
  const currentWeights = data.map((item) => item.currentWeight);
  const idealWeights = data.map((item) => item.idealWeight);

  const options = {
    title: {
      text: 'Progresso da Perda de Peso',
      align: 'left',
    },
    yAxis: {
      title: {
        text: 'Peso (kg)',
      },
    },
    xAxis: {
      accessibility: {
        rangeDescription: 'Range: 2010 to 2020',
      },
      categories: categories,
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
    },
    series: [
      {
        name: 'Peso Atual',
        data: currentWeights,
      },
      {
        name: 'Peso Ideal',
        data: Array(currentWeights.length).fill(idealWeights[0]),
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ProgressChart;