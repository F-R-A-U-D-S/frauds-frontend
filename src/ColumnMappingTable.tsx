import { useState } from "react";

type ColumnMapping = {
  [requiredColumn: string]: string;
};

type ColumnMappingTableProps = {
  onSave: (bankName: string, mapping: ColumnMapping) => void;
};

const requiredColumns = ["timestamp", "merchant", "amount", "mcc", "city", "country", "channel"];

export default function ColumnMappingTable({ onSave }: ColumnMappingTableProps) {
  const [bankName, setBankName] = useState(""); 
  const [mapping, setMapping] = useState<ColumnMapping>(
    requiredColumns.reduce((acc, col) => ({ ...acc, [col]: "" }), {})
  );

  const handleChange = (col: string, value: string) => {
    setMapping({ ...mapping, [col]: value });
  };

  const handleSave = () => {
    onSave(bankName, mapping);
  };

  return (
    <div>
      {/* Bank Name Field */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Bank Name</label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="border px-2 py-1 w-full"
          placeholder="Enter bank name (e.g., RBC, TD, Scotiabank)"
        />
      </div>
      <table className="table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Required Column</th>
            <th className="border px-4 py-2">Bank Column Name</th>
          </tr>
        </thead>
        <tbody>
          {requiredColumns.map((col) => (
            <tr key={col}>
                <td className="border px-4 py-2">{col}</td>
                <td className="border px-4 py-2">
                <label className="sr-only" htmlFor={`input-${col}`}>
                    Bank column name for {col}
                </label>
                <input
                    id={`input-${col}`}
                    type="text"
                    value={mapping[col]}
                    onChange={(e) => handleChange(col, e.target.value)}
                    className="border px-2 py-1 w-full"
                    placeholder={`Enter bank column for ${col}`}
                />
                </td>
            </tr>
            ))}
        </tbody>
      </table>
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Mapping
      </button>
    </div>
  );
}
