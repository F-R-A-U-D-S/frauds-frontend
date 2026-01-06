import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ColumnMappingTable from "./ColumnMappingTable";
import Layout from "./Layout";
import axiosClient from "./api/axiosClient";

import "./Schema.css";

export default function Schema() {
  const [savedMapping, setSavedMapping] = useState<any>(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSaveMapping = async (bankName: string, mapping: any) => {
    try {
      setStatus("Saving...");

      const res = await axiosClient.post(
        "/schema/save",
        {
          bank_name: bankName,
          mapping: mapping,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log('Save response:', res.data);

      localStorage.setItem("bank_name", bankName);
      setSavedMapping(mapping);
      setStatus("Mapping saved successfully!");
      // alert(res.data.message || "Schema saved!"); // Removed alert for cleaner UI

    } catch (error: any) {
      console.error("Schema save error:", error);
      const msg = error.response?.data?.detail || "Error saving schema.";
      // alert(msg);
      setStatus(`Error: ${msg}`);
    }
  };

  return (
    <Layout>
      <div className="schema-container">
        {/* Animated Background Shapes */}
        <div className="schema-shape schema-shape-1"></div>
        <div className="schema-shape schema-shape-2"></div>

        <div className="schema-card">
          <div className="schema-header">
            <div>
              <h1 className="schema-title">Transaction Schema Mapping</h1>
              <p className="schema-subtitle">
                Map your bank’s column names to the required transaction schema.
              </p>
            </div>

            <button
              onClick={() => navigate("/upload")}
              className="schema-btn schema-btn-secondary"
            >
              ← Back to Upload
            </button>
          </div>

          <ColumnMappingTable onSave={handleSaveMapping} />

          {status && <div className="schema-status">{status}</div>}

          {savedMapping && (
            <div className="schema-code-block">
              {JSON.stringify(savedMapping, null, 2)}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
