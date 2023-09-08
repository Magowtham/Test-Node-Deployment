import React, { useState } from "react";

const data = [
  { id: "1", name: "Gowtham MA" },
  { id: "2", name: "Sathwik KD" },
  { id: "3", name: "Sumit" },
];
const TableCell = ({ isEditing, value, onChange }) => {
  if (isEditing) {
    return <input value={value} onChange={onChange} />;
  }
  return <td>{value}</td>;
};

const TableRow = ({ rowData, isEditing, onEditToggle, onValueChange }) => {
  const handleEditToggle = () => {
    onEditToggle(rowData.id);
  };

  const handleValueChange = (e) => {
    onValueChange(rowData.id, e.target.value);
  };

  return (
    <tr>
      <TableCell
        isEditing={isEditing}
        value={rowData.name}
        onChange={handleValueChange}
      />
      <TableCell
        isEditing={isEditing}
        value={rowData.age}
        onChange={handleValueChange}
      />
      <td>
        <button onClick={handleEditToggle}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </td>
    </tr>
  );
};

const Test2 = () => {
  const [editingRows, setEditingRows] = useState({});

  const handleEditToggle = (rowId) => {
    console.log(editingRows);
    setEditingRows((prevEditingRows) => ({
      ...prevEditingRows,
      [rowId]: !prevEditingRows[rowId],
    }));
  };

  const handleValueChange = (rowId, newValue) => {
    // Update the data or perform any necessary operations
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((rowData) => (
          <TableRow
            key={rowData.id}
            rowData={rowData}
            isEditing={editingRows[rowData.id]}
            onEditToggle={handleEditToggle}
            onValueChange={handleValueChange}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Test2;
