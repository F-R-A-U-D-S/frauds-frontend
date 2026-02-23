import type { ReactNode } from "react";
import { Layout as RALayout, AppBar } from "react-admin";
import { Typography } from "@mui/material";
import "./adminLayout.css";

const CustomAppBar = (props: any) => (
  <AppBar {...props} elevation={0}>
    <Typography
      variant="h6"
      color="inherit"
      sx={{
        flex: 1,
        fontWeight: 800,
        background: 'linear-gradient(to right, #22d3ee, #6366f1, #d946ef)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '1px'
      }}
    >
      F.R.A.U.D.S Admin
    </Typography>
  </AppBar>
);

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="admin-container">
    <div className="admin-shape admin-shape-1"></div>
    <div className="admin-shape admin-shape-2"></div>
    <div className="admin-shape admin-shape-3"></div>
    <RALayout appBar={CustomAppBar} className="RaLayout-root">
      {children}
    </RALayout>
  </div>
);