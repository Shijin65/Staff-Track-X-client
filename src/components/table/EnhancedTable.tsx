"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  IconButton,
  Pagination,
  Box,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { EnhancedTableHead } from "./EnhancedTableHeader";
import { Button } from "../ui/button";

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

  handleOpen: (event: React.MouseEvent<HTMLButtonElement>, type: string, uid: Array<T[keyof T]>) => void;
  handleViewDetails: (userId: string) => void;
  mainCol?: keyof T;
  limit?: number;
  totalPages?: number;
  totalItems?: number;
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
  mainCol,
  totalPages = 1,
  totalItems = 0,
}: EnhancedTableProps<T>) {
  const isSelected = (id: T[keyof T]) => selected.includes(id);

  // ── Select all on current page ──────────────────────────────────────────────
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pageIds = rows.map((row) => row[idField]);
    const unselectedOnPage = pageIds.filter((id) => !selected.includes(id));

    if (unselectedOnPage.length === 0) {
      setSelected(selected.filter((id) => !pageIds.includes(id)));
    } else if (event.target.checked) {
      setSelected(Array.from(new Set([...selected, ...pageIds])));
    } else {
      setSelected([]);
    }
  };

  // ── Row checkbox toggle ─────────────────────────────────────────────────────
  const handleClick = (_event: React.MouseEvent<HTMLTableRowElement>, id: T[keyof T]) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: T[keyof T][] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((_, i) => i !== selectedIndex);
    }
    setSelected(newSelected);
  };

  // ── Page change ─────────────────────────────────────────────────────────────
  const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const rowStart = totalItems === 0 ? 0 : (page - 1) * rows.length + 1;
  const rowEnd = Math.min(page * rows.length, totalItems);
  const isEmpty = rows.length === 0;
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <TableContainer>
        <Table
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              py: 1.5,       // increased vertical padding (from 0.75)
              fontSize: "0.875rem", // slightly larger font,
            },
            "& .MuiTableCell-head": {
              py: 1,
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "text.secondary",
              bgcolor: "action.hover",
            },
          }}
        >
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
            {isEmpty ? (
              <TableRow
                style={{
                  height: 65,
                  backgroundColor: "var(--background)",
                  margin: "20px",
                }}
              >
                <TableCell
                  colSpan={columns.length + 4}
                  align="center"
                >
                  <span className="w-5 h-5 min-w-[1rem] text-gray-600">
                    There are no items to display.
                  </span>
                </TableCell>
              </TableRow>
            ) : rows.map((row) => {
              const id = row[idField];
              const checked = isSelected(id);

              return (
                <TableRow
                  key={String(id)}
                  hover
                  selected={checked}
                  sx={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(e, id)
                  }}
                >
                  {/* Checkbox */}
                  {selected && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={checked}
                      />
                    </TableCell>
                  )}

                  {/* Data columns */}
                  {columns.map((col) => (
                    <TableCell
                      onClick={(e) => {
                        if (col.id === mainCol) {
                          e.stopPropagation();
                          handleViewDetails(id as string)
                        }
                      }}
                      key={String(col.id)}
                      sx={
                        col.id === mainCol
                          ? { fontWeight: 600, textTransform: "capitalize", whiteSpace: "nowrap" }
                          : {}
                      }
                    >
                      {col.render ? col.render(row) : String(row[col.id] ?? "")}
                    </TableCell>
                  ))}

                  {/* Actions */}
                  {/* <TableCell align="right" sx={{ py: 0.25 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(e, "edit", [id]);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(e, "delete", [id]);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Pagination bar ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          borderTop: "1px solid",
          borderColor: "divider",
          mt: "auto",
        }}
      >
        {selected?.length > 0 && (
          <div className="text-white justify-between">
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={(e) => handleOpen(e, "delete", selected)}
              startIcon={<DeleteIcon className="w-5 h-5 text-white " />}
            >
              Delete
            </Button>
          </div>
        )}

        {page && <Pagination
          sx={{ ml: "auto", py: "5px" }}
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          size="small"
          shape="rounded"
          color="primary"
          siblingCount={1}
          boundaryCount={1}
        />}
      </Box>
    </Box>
  );
}