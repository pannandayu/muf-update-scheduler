import { motion } from "framer-motion";
import { Column, useSortBy, useTable } from "react-table";

interface ReactTableProps<T extends object> {
  inputData: T[];
  inputColumns: Column<T>[];
  className: string;
  tableKey: string;
}

const ReactTable: <T extends object>({
  inputData,
  inputColumns,
  className,
  tableKey,
}: ReactTableProps<T>) => React.ReactElement = ({
  inputData,
  inputColumns,
  className,
  tableKey,
}) => {
  const table = useTable({ data: inputData, columns: inputColumns }, useSortBy);
  return (
    <motion.table
      layout
      key={tableKey}
      className={className}
      {...table.getTableProps()}
    >
      <thead>
        {table.headerGroups.map((headerGroup) => {
          return (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => {
                return (
                  // @ts-ignore
                  <th {...col.getHeaderProps(col.getSortByToggleProps())}>
                    {col.render("Header")}
                    <span>
                      {/* @ts-ignore */}
                      {col.isSorted ? (col.isSortedDesc ? " 🔽" : " 🔼") : ""}
                    </span>
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...table.getTableBodyProps()}>
        {table.rows.map((row) => {
          table.prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <motion.td
                    initial={{ x: -15, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </motion.td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </motion.table>
  );
};

export default ReactTable;
