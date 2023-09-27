import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface Student {
  id: number;
  name: string;
  weight_loss: number;
}

interface DietProgressChartProps {
  studentData: Student[];
}

const DietProgressChart: React.FC<DietProgressChartProps> = ({ studentData }) => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartOptions({
      chart: {
        type: 'column',
      },
      title: {
        text: 'Progresso na Perda de Peso',
      },
      xAxis: {
        categories: studentData.map((student) => student.name),
      },
      yAxis: {
        title: {
          text: 'Peso Perdido (kg)',
        },
      },
      series: [
        {
          name: 'Peso Perdido',
          data: studentData.map((student) => student.weight_loss),
        },
      ],
    });
  }, [studentData]);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default DietProgressChart;
