import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import axiosClient from "../api/axiosClient";

interface ReportPieChartProps {
  keyValue: string | null;
}

interface PieDataItem {
  label: string;
  value: number;
}

export default function ReportPieChart({ keyValue }: ReportPieChartProps) {
  const [data, setData] = useState<PieDataItem[]>([]);

  const valueFormatter = (item: { value: number }) => `${item.value}`;

  useEffect(() => {
    if (!keyValue) return;

    async function fetchData() {
      try {
        const res = await axiosClient.get(`/report/fraud_breakdown/${keyValue}`, {
          headers: { Accept: "application/json" },
        });

        setData(res.data);
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
          highlightScope: { fade: "global", highlight: "item" },
          faded: { innerRadius: 10, additionalRadius: -30, color: "gray" },
          valueFormatter,
        },
      ]}
    />
  );
}
