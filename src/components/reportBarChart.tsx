import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

interface ReportBarChartProps {
  keyValue: string | null;
}

interface BarDataTypeItem {
  label: string;
  value: number;
  percentage: number;
  total: number;
  [key:string]: string | number | undefined;
}

export default function ReportBarChart({ keyValue }: ReportBarChartProps) {
    const [typeData, setTypeData] = useState<BarDataTypeItem[]>([]);

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

    return(
        <Box sx={{height:300, width:1150}}>
            <BarChart
                dataset={typeData}
                yAxis={[{ scaleType: 'band', dataKey: 'label' ,width: 350}]}
                series={[{ dataKey: 'value', label: 'Possible Fraud Type Instances: ',color:'#6b35cb' }]}
                layout="horizontal"
            />
        </Box>
    );
}