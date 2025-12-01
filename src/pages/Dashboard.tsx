import Layout from "../Layout";
import App from "../App";
import Schema from "../Schema";
import { Routes, Route } from "react-router-dom";

export default function Dashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/schema" element={<Schema />} />
      </Routes>
    </Layout>
  );
}

