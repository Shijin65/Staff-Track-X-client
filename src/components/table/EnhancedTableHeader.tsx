import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Checkbox,
} from "@mui/material";

type Order = "asc" | "desc";

interface Column<T> {
  id: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}
interface TableHeadProps<T> {
  columns: Column<T>[];
  hasSelection?: boolean;
  hasActions?: boolean;

  order?: Order;
  orderBy?: keyof T;
  onSort?: (key: keyof T) => void;

  numSelected: number;
  rowCount: number;
  totalItems: number;
  handleSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EnhancedTableHead<T>({
  columns,
  hasSelection,
  order,
  orderBy,
  onSort,
  numSelected,
  rowCount,
  totalItems,
  handleSelectAllClick,
}: TableHeadProps<T>) {
  return (
    <TableHead>
      <TableRow>
        {hasSelection && (
          <TableCell padding="checkbox">
            <Checkbox indeterminate={
              numSelected > 0 && totalItems > 0 && numSelected < totalItems
            }
              checked={
                rowCount > 0 && totalItems > 0 && numSelected === totalItems
              } onChange={handleSelectAllClick} />
          </TableCell>
        )}

        {columns.map((col) => (
          <TableCell key={String(col.id)}>
            {onSort ? (
              <TableSortLabel
                active={orderBy === col.id}
                direction={orderBy === col.id ? order : "asc"}
                onClick={() => onSort(col.id)}
              >
                {col.label}
              </TableSortLabel>
            ) : (
              col.label
            )}
          </TableCell>
        ))}

        <TableCell align="right"></TableCell>
      </TableRow>
    </TableHead>
  );
}