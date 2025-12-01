import { useState } from "react";
import ColumnMappingTable from "./ColumnMappingTable";

export default function Schema() {
  const [savedMapping, setSavedMapping] = useState<any>(null);
  const [status, setStatus] = useState("");

  const handleSaveMapping = async (mapping: any) => {
    try {
      setStatus("Saving...");

      const res = await fetch("http://127.0.0.1:8000/schema/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mapping }),
        
      });

        
      const data = await res.json();
      setSavedMapping(mapping);
      setStatus("Mapping saved successfully!");
      alert(data.message);
    } 
    catch (error) {
        alert("Error saving schema");
        setStatus("Error saving mapping.");
    }
  };

  return (
    <div className="p-6">
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
  );
}
