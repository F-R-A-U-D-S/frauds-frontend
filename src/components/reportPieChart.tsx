import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';

interface ReportPieChartProps {
  keyValue: string | null;
}

interface PieDataItem {
  label: string;
  value: number;
}

export default function ReportPieChart({ keyValue}:ReportPieChartProps) {

    const valueFormatter = (item: { value: number }) => `${item.value}`;
    
    const [data, setData] = useState<PieDataItem[]>([]);
    useEffect(() => {
    if (!keyValue) return;

    async function fetchData() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/report/fraud_breakdown/${keyValue}`, {
        method: "GET",
        headers: { "Accept": "application/json" },
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch fraud data:", err);
      }
    }

    fetchData();
    }, [keyValue]);

  return (
    <PieChart
      series={[
        {
          data: data,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 10, additionalRadius: -30, color: 'gray' },
          valueFormatter,
        },
      ]}
    />
  );
}