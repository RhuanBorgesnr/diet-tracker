import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface DailyMacrosData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

const DailyMacrosPage: React.FC = () => {
  const dailyMacrosData: DailyMacrosData = {
    calories: 1398.875,
    carbs: 139.88750000000002,
    protein: 104.91562499999999,
    fat: 46.62916666666666,
  };

  const chartOptions = {
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Daily Macros',
    },
    series: [
      {
        type: 'pie', // Add the 'type' property here
        name: 'Macro',
        colorByPoint: true,
        data: [
          { name: 'Carbs', y: dailyMacrosData.carbs },
          { name: 'Protein', y: dailyMacrosData.protein },
          { name: 'Fat', y: dailyMacrosData.fat },
        ],
      },
    ],
  };

  return (
    <div>
      <h1>Daily Macros</h1>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default DailyMacrosPage;
