import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import axiosClient from "../api/axiosClient";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React from 'react';

interface ReportPieChartProps {
  keyValue: string | null;
}

interface PieDataStatusItem {
  label: string;
  value: number;
  percentage: number;
  total: number;
}

interface PieDataTypeItem {
  label: string;
  value: number;
  percentage: number;
  total: number;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3619a3cc',
      contrastText: '#FFFFFF'
    },
  },
});

type ViewType = 'status' | 'type';

export default function ReportPieChart({ keyValue }: ReportPieChartProps) {
  const [statusData, setStatusData] = useState<PieDataStatusItem[]>([]);
  const [typeData, setTypeData] = useState<PieDataTypeItem[]>([]);
  const [view, setView] = React.useState<ViewType>('status');

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: ViewType | null,
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const statusValueFormatter = (item: { value: number }) => `${item.value} out of ${(item as any).total} total cases (${(item as any).percentage}%)`;
  const typeValueFormatter = (item: { value: number }) => `In ${item.value} out of ${(item as any).total} positive cases (${(item as any).percentage}%)`;

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

  useEffect(() => {
    if (!keyValue) return;

    async function fetchTypeData() {
      try {
        const res = await axiosClient.get(`/report/fraud_type_breakdown/${keyValue}`, {
          headers: { Accept: "application/json" },
        });

        setTypeData(res.data);
      } catch (err) {
        console.error("Failed to fetch fraud data:", err);
      }
    }

    fetchTypeData();
  }, [keyValue]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box>
        <ToggleButtonGroup
          sx={{p:4}}
          size="small"
          value={view}
          exclusive
          onChange={handleViewChange}
        >
          <ToggleButton value="status">View by Fraud Status</ToggleButton>
          <ToggleButton value="type">View by Fraud Type</ToggleButton>
        </ToggleButtonGroup>
        <Box>
          {view === 'status' ? (
            <PieChart
              sx={{minHeight: 250, maxHeight: 400}}
              colors={['green', 'red']} 
              series={[
                {
                  data: statusData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: { innerRadius: 10, additionalRadius: -30, color: "gray" },  
                  //arcLabel: (item) =>
                  //`${item.label} (${(item as any).percentage.toFixed(2)}%)`, 
                  arcLabelMinAngle: 35,
                  arcLabelRadius: '40%',
                  valueFormatter: statusValueFormatter       
                },
              ]}
              //hideLegend
            />
          ) : (
            <PieChart
              //sx={{minHeight: 250, maxHeight:400}}
              series={[
                {
                  data: typeData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: { innerRadius: 10, additionalRadius: -30, color: "gray" },  
                  //arcLabel: (item) =>
                  //`${item.label} (${(item as any).percentage.toFixed(2)}%)`, 
                  arcLabelMinAngle: 35,
                  arcLabelRadius: '40%',
                  valueFormatter: typeValueFormatter       
                },
              ]}
              //hideLegend
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
