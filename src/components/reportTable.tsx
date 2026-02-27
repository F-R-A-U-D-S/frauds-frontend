import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Paper from "@mui/material/Paper";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Box from "@mui/material/Box";
import type { DateTimeInputProps } from "react-admin";

interface ReportTableProps {
    keyValue: string | null;
}

interface TableDataItem {
    id: number
    timestamp: string
    merchant: string
    amount: number
    mcc: string
    city: string
    country: string
    channel: string
    reasoning: string
    [key:string]: string | number | DateTimeInputProps | undefined;
}

const paginationModel = { page: 0, pageSize: 5 };

const columns: GridColDef[] = [
    { field: 'timestamp', headerName: 'Timestamp', width: 180 },
    { field: 'merchant', headerName: 'Merchant', width: 150},
    { field: 'amount', headerName: 'Amount', type: 'number', width: 70, align: 'right', headerAlign: 'right'},
    { field: 'mcc', headerName: 'MCC', width: 70 },
    { field: 'city', headerName: 'City', width: 70 },
    { field: 'country', headerName: 'Country', width: 70 },
    { field: 'channel', headerName: 'Channel', width: 70},
    { field: 'reasoning', headerName: 'Reasoning', width: 650},
]

export default function ReportTable({ keyValue }: ReportTableProps) {
    const [tableData, setTableData] = useState<TableDataItem[]>([]);

    useEffect(() => {
        if (!keyValue) return;
    
        async function fetchTableData() {
          try {
            const res = await axiosClient.get(`/report/fraud_table_breakdown/${keyValue}`, {
              headers: { Accept: "application/json" },
            });
    
            setTableData(res.data);
          } catch (err) {
            console.error("Failed to fetch fraud status data:", err);
          }
        }
    
        fetchTableData();
      }, [keyValue]);

    return(
            <Box>
                <Paper sx={{ height: 400, width: 1130 }}>
                    <DataGrid
                        rows={tableData}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        sx={{ border: 0 }}
                        disableRowSelectionOnClick
                    />
                </Paper>
            </Box>
    );
}