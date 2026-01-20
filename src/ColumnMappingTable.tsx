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
      <div className="schema-form-group">
        <label className="schema-label">Bank Name</label>
        <input
          type="text"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="schema-input"
          placeholder="Enter bank name (e.g., RBC, TD, Scotiabank)"
        />
      </div>

      <div className="schema-table-wrapper">
        <table className="schema-table">
          <thead>
            <tr>
              <th>Required Column</th>
              <th>Bank Column Name</th>
            </tr>
          </thead>
          <tbody>
            {requiredColumns.map((col) => (
              <tr key={col}>
                <td>{col}</td>
                <td>
                  <label className="sr-only" htmlFor={`input-${col}`}>
                    Bank column name for {col}
                  </label>
                  <input
                    id={`input-${col}`}
                    type="text"
                    value={mapping[col]}
                    onChange={(e) => handleChange(col, e.target.value)}
                    className="schema-input"
                    placeholder={`Enter bank column for ${col}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <button
          onClick={handleSave}
          className="schema-btn schema-btn-primary"
        >
          Save Mapping
        </button>
      </div>
    </div>
  );
}
