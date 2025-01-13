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

function createData(id, name,role, score) {
  return { id, name, role,score };
}

const rows = [
  createData(1, "John Doe", "Student", 85),
  createData(2, "Jane Smith", "Teacher", 92),
  createData(3, "Alice Johnson", "Student", 78),
  createData(4, "Bob Brown", "Teacher", 88),
  createData(5, "Charlie Davis", "Student", 91),
];


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
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

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
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
            padding={
              headCell.label === "Name"
                ? "2px"
                : headCell.disablePadding
                ? "none"
                : "normal"
            }
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                color: "white", 
                "& .MuiTableSortLabel-icon": {
                  color: "white"
                },
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


export default function EnhancedTableTest({rowData}) {
    console.log(rowData);
    
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("score");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const { id, setId } = useGlobeId();
    const handleRowClick = (row) => {
      setSelectedRow(row.id === selectedRow?.id ? null : row); // Toggle highlight
      setId(row.id);
      // Fetch row data (for example, you can make an API call here if needed)
    //   console.log("Selected Row Data:", row);
    };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (searchQuery === "") {
      return rowData; 
    }
    return rowData.filter(
      (row) =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.role.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
  }, [searchQuery,rowData]);

  const visibleRows = useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );
  console.log("Context",id);
  
  return (
    <>
      <>
        <div className="flex justify-between items-center mb-4 gap-4">
          <div className="text-2xl font-semibold text-center">
            Direct Reports
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
      </>

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 400 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={filteredRows.length}
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
}
