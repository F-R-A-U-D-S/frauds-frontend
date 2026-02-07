import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import axiosClient from "../api/axiosClient";
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface ReportPieChartProps {
  keyValue: string | null;
}

interface PieDataItem {
  label: string;
  value: number;
  percentage: number;
  total: number;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function ReportPieChart({ keyValue }: ReportPieChartProps) {
  const [data, setData] = useState<PieDataItem[]>([]);

  const valueFormatter = (item: { value: number }) => `${item.value} out of ${(item as any).total} (${(item as any).percentage}%)`;

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
    <ThemeProvider theme={darkTheme}>
      <PieChart
      series={[
        {
          data: data,
          highlightScope: { fade: "global", highlight: "item" },
          faded: { innerRadius: 10, additionalRadius: -30, color: "gray" },   
          valueFormatter       
        },
      ]}
    />
    </ThemeProvider>
  );
}
