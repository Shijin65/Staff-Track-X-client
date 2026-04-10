"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { EnhancedTableHead } from "./EnhancedTableHeader";

type Order = "asc" | "desc";

interface Column<T> {
  id: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}
interface EnhancedTableProps<T> {
  rows: T[];
  columns: Column<T>[];

  idField: keyof T;

  // Pagination
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;


  // Selection
  selected: T[keyof T][];
  setSelected: React.Dispatch<React.SetStateAction<T[keyof T][]>>;

  // Sorting
  order?: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;


  orderBy?: keyof T;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof T>>;

  handleOpen: (event: React.MouseEvent<HTMLButtonElement>, type: string, uid: T[keyof T]) => void;
  handleViewDetails: (userId: string) => void;
  mainCol?: keyof T;
}

export function EnhancedTable<T>({
  rows,
  columns,
  idField,
  page,
  setPage,
  selected = [],
  setSelected,
  order,
  setOrder,
  orderBy,
  handleOpen,
  handleViewDetails,
  mainCol
}: EnhancedTableProps<T>) {
  const isSelected = (id: T[keyof T]) => selected.includes(id);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = rows
      .map((row) => row[idField]);

    const allSelected = newRows.filter((id) => selected.indexOf(id) === -1);
    if (allSelected.length === 0) {
      setSelected(selected.filter((id) => newRows.indexOf(id) === -1));
      return;
    }
    if (event.target.checked) {
      const newSelected = rows
        .map((row) => row[idField]);

      setSelected(Array.from(new Set([...selected, ...newSelected])));
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<HTMLButtonElement>, id: T[keyof T]) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: T[keyof T][] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <TableContainer>
      <Table>
        <EnhancedTableHead
          columns={columns}
          hasSelection={!!selected}
          order={order}
          orderBy={orderBy}
          numSelected={selected.length}
          rowCount={rows.length}
          totalItems={rows.length}
          handleSelectAllClick={handleSelectAllClick}
        />
        <TableBody>
          {rows.map((row) => {
            const id = row[idField];
            const checked = isSelected(id);

            return (
              <TableRow key={String(id)} hover selected={checked} onClick={() => handleViewDetails(id as string)}>

                {selected && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={checked}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(e, id);
                      }}
                    />
                  </TableCell>
                )}

                {columns.map((col) => (
                  <TableCell
                    key={String(col.id)}
                    sx={col.id === mainCol ? {
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      whiteSpace: 'nowrap'
                    } : {}}
                  >
                    {col.id === mainCol ? (
                      <span style={{ fontWeight: 600 }}>
                        {col.render ? col.render(row) : String(row[col.id] ?? "")}
                      </span>
                    ) : (
                      col.render
                        ? col.render(row)
                        : String(row[col.id] ?? "")
                    )}
                  </TableCell>
                ))}


                <TableCell align="right">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    handleOpen(e, "delete", id)
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>


              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer >
  );
}