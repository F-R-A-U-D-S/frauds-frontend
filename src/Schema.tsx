import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ColumnMappingTable from "./ColumnMappingTable";
import Layout from "./Layout";
import axiosClient from "./api/axiosClient";

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

      // save bank name so upload page uses it
      localStorage.setItem("bank_name", bankName);

      setSavedMapping(mapping);
      setStatus("Mapping saved successfully!");
      alert(res.data.message || "Schema saved!");

    } catch (error: any) {
      console.error("Schema save error:", error);

      const msg = error.response?.data?.detail || "Error saving schema.";
      alert(msg);
      setStatus("Error saving mapping.");
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <button
          onClick={() => navigate("/upload")}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          ← Back to Home
        </button>

        <h1 className="text-2xl font-bold mb-4">Transaction Schema Mapping</h1>

        <p className="mb-4 text-gray-700">
          Map your bank’s column names to the required transaction schema.
        </p>

        <ColumnMappingTable onSave={handleSaveMapping} />

        {status && <p className="mt-4 text-sm text-blue-700">{status}</p>}

        {savedMapping && (
          <pre className="mt-6 p-4 bg-gray-100 border rounded text-sm">
            {JSON.stringify(savedMapping, null, 2)}
          </pre>
        )}
      </div>
    </Layout>
  );
}
