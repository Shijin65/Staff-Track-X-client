"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  Pagination,
  Box,
  Chip,
  alpha,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { EnhancedTableHead } from "./EnhancedTableHeader";
import { Button } from "../ui/button";

type Order = "asc" | "desc";

export interface Column<T> {
  id: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface EnhancedTableProps<T, K extends keyof T = keyof T> {
  rows: T[];
  columns: Column<T>[];
  idField: K;

  // Pagination
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  // Selection
  selected: T[K][];
  setSelected: React.Dispatch<React.SetStateAction<T[K][]>>;

  // Sorting
  order?: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
  orderBy?: keyof T;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof T>>;

  handleOpen?: (event: React.MouseEvent<HTMLButtonElement>, type: string, uid: Array<T[K]>) => void;
  handleViewDetails: (userId: string) => void;
  mainCol?: keyof T;
  limit?: number;
  totalPages?: number;
  totalItems?: number;
  hasSelection?: boolean;
  canDelete?: boolean;
  canView?: boolean;
}

export function EnhancedTable<T, K extends keyof T = keyof T>({
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
  hasSelection = true,
  canDelete = true,
  canView = true,
}: EnhancedTableProps<T, K>) {
  const isSelected = (id: T[K]) => (selected || []).includes(id);

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
  const handleClick = (_event: React.MouseEvent<HTMLTableRowElement>, id: T[K]) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: T[K][] = [];

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

  const isEmpty = rows?.length === 0;
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
            hasSelection={hasSelection}
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
                  sx={{ cursor: "pointer", backgroundColor: checked ? "var(--background)" : "white" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(e, id)
                  }}
                >
                  {/* Checkbox */}
                  {hasSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={checked}
                      />
                    </TableCell>
                  )}

                  {/* Data columns */}
                  {columns.map((col) => {
                    const value = row[col.id];
                    let content: React.ReactNode;

                    if (col.render) {
                      content = col.render(row);
                    }
                    else if (col.id === "status") {
                      const statusStr = String(value).toLowerCase();
                      let config = { bg: "#f5f5f5", color: "#9e9e9e" };
                      if (statusStr === "pending") config = { bg: alpha("#ff9800", 0.1), color: "#ed6c02" };
                      else if (statusStr === "confirmed") config = { bg: alpha("#4caf50", 0.1), color: "#2e7d32" };
                      else if (statusStr === "completed") config = { bg: alpha("#2196f3", 0.1), color: "#1976d2" };
                      else if (statusStr === "cancelled") config = { bg: alpha("#f44336", 0.1), color: "#d32f2f" };
                      content = (
                        <Chip
                          label={statusStr}
                          size="small"
                          sx={{
                            bgcolor: config.bg,
                            color: config.color,
                            fontWeight: 600,
                            borderRadius: "6px",
                            height: 24,
                            "& .MuiChip-label": { px: 1 }
                          }}
                        />
                      );
                    } else if (col.id === "isActive") {
                      content = (
                        <Chip
                          label={value ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            bgcolor: value ? alpha("#4caf50", 0.1) : alpha("#f44336", 0.1),
                            color: value ? "#2e7d32" : "#d32f2f",
                            fontWeight: 600,
                            borderRadius: "6px",
                            height: 24,
                            "& .MuiChip-label": { px: 1 }
                          }}
                        />
                      );
                    } else if (col.id === "isVerified") {
                      content = (
                        <Chip
                          label={value ? "Verified" : "Pending"}
                          size="small"
                          sx={{
                            bgcolor: value ? alpha("#2196f3", 0.1) : alpha("#ff9800", 0.1),
                            color: value ? "#1976d2" : "#ed6c02",
                            fontWeight: 600,
                            borderRadius: "6px",
                            height: 24,
                            "& .MuiChip-label": { px: 1 }
                          }}
                        />
                      );
                    } else {
                      content = String(value ?? "");
                    }

                    return (
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
                            ? { fontWeight: 600, textTransform: "capitalize", whiteSpace: "nowrap", color: "primary.main" }
                            : { color: "text.primary" }
                        }
                      >
                        {content}
                      </TableCell>
                    );
                  })}

                  {/* Actions */}
                  {canDelete && <TableCell align="right" sx={{ py: 0.25 }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen?.(e, "delete", [id]);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>}
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
        {selected?.length > 0 && canDelete && (
          <div className="text-white justify-between">
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={(e) => handleOpen?.(e, "delete", selected)}
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