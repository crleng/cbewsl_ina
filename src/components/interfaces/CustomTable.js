import MaterialReactTable from "material-react-table";
import React from "react";

const CustomTable = (props) => {
  const { data, options, onView, onEdit, onDelete, buttons } = props;
  const { columns, rows } = data;

  return <MaterialReactTable columns={columns} data={rows} />;
};

export default CustomTable;
