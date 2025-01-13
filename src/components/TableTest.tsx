import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useGlobeId } from "../context/GlobeIdContext";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface RowData {
  id: number;
  name: string;
  role: string;
  score: number;
}

interface EnhancedTableTestProps {
  rowData: RowData[];
}

function descendingComparator(a: RowData, b: RowData, orderBy: keyof RowData): number {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: "asc" | "desc", orderBy: keyof RowData) {
  return order === "desc"
    ? (a: RowData, b: RowData) => descendingComparator(a, b, orderBy)
    : (a: RowData, b: RowData) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "score",
    numeric: true,
    disablePadding: false,
    label: "Score",
  },
];

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
}: {
  order: "asc" | "desc";
  orderBy: keyof RowData;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof RowData) => void;
}) {
  const createSortHandler = (property: keyof RowData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className="bg-[#1F509A]">
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={
              headCell.label === "Name"
                ? "left"
                : headCell.label === "Score"
                ? "right"
                : "center"
            }
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id as keyof RowData)}
              sx={{
                color: "white",
                "& .MuiTableSortLabel-icon": {
                  color: "white",
                },
                paddingLeft:"12px"
              }}
            >
              <div className="text-white">{headCell.label}</div>
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTableTest({ rowData }: EnhancedTableTestProps) {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof RowData>("score");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(8);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const { id, setId } = useGlobeId();

  const handleRowClick = (row: RowData) => {
    setSelectedRow(row.id === selectedRow?.id ? null : row); // Toggle highlight
    setId(row.id);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof RowData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

const handleChangePage = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, 
  newPage: number
) => {
  setPage(newPage);
};




  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredRows = useMemo(() => {
    if (searchQuery === "") {
      return rowData;
    }
    return rowData.filter(
      (row) =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, rowData]);

  const visibleRows = useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="text-2xl font-semibold text-center">
          Direct Reports {rowData.length}
        </div>
        <div className="w-36">
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
          />
        </div>
      </div>

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 400 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    sx={{
                      backgroundColor:
                        selectedRow?.id === row.id ? "#D4EBF8" : "transparent", // Highlight selected row
                      cursor: "pointer",
                    }}
                  >
                    <TableCell
                      component="th"
                      id={`enhanced-table-checkbox-${row.id}`}
                      scope="row"
                      padding="none"
                      align="left"
                    >
                      <div className="pl-3">
                        {row.name}
                        <span className="block text-xs mt-0.5">{row.role}</span>
                      </div>
                    </TableCell>
                    <TableCell align="right">{row.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <Stack spacing={2}>
            <Pagination count={rowData.length / 8} size="small" />
          </Stack> */}
          <TablePagination
            rowsPerPageOptions={[]} // Remove dropdown by passing an empty array
            component="div"
            count={filteredRows.length}
            rowsPerPage={8} // Set a fixed number of rows per page
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </Box>
    </>
  );
}
