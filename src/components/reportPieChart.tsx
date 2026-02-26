import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import axiosClient from "../api/axiosClient";
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React from 'react';
import { BarChart, pieArcLabelClasses } from '@mui/x-charts';


interface ReportPieChartProps {
  keyValue: string | null;
}

interface PieDataStatusItem {
  label: string;
  value: number;
  percentage: number;
  total: number;
}

export default function ReportPieChart({ keyValue }: ReportPieChartProps) {
  const [statusData, setStatusData] = useState<PieDataStatusItem[]>([]);

  const statusValueFormatter = (item: { value: number }) => `${item.value} out of ${(item as any).total} total cases (${(item as any).percentage}%)`;

  useEffect(() => {
    if (!keyValue) return;

    async function fetchStatusData() {
      try {
        const res = await axiosClient.get(`/report/fraud_status_breakdown/${keyValue}`, {
          headers: { Accept: "application/json" },
        });

        setStatusData(res.data);
      } catch (err) {
        console.error("Failed to fetch fraud status data:", err);
      }
    }

    fetchStatusData();
  }, [keyValue]);

  return (
      
        <Box sx={{height:300}}>
            <PieChart
              slotProps={{
                legend:{
                  direction: 'horizontal',
                  sx: {
                    fontSize: 14,
                  }
                }
              }}
              sx={{ 
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: '#ffffff' ,
                  fontSize: 20
              }
              }}
              colors={['#6b35cb', 'red']} 
              series={[
                {
                  data: statusData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: { innerRadius: 10, additionalRadius: -30, color: "gray" },  
                  arcLabel: (item) =>
                  `${(item as any).percentage.toFixed(2)}%`, 
                  arcLabelMinAngle: 35,
                  arcLabelRadius: '55%',
                  valueFormatter: statusValueFormatter       
                },
              ]}
            />
        </Box>
      
  );
}
