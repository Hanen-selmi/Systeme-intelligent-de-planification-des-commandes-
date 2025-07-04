import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import DialogComponent from './DialogComponent';
import axios from 'axios';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const CrudComponent = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState('add');
  const [selectedItem, setSelectedItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('firstname'); // Default filter is by 'firstname'

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const formatDate = (isoDate) => {
    if (!isoDate) return ''; // Handle null or undefined dates
    const date = new Date(isoDate); // Create a Date object from ISO string
    
    // Format date as YYYY-MM-DD without timezone shifting
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust for local timezone offset
    return localDate.toISOString().split('T')[0]; // Return only the date part (YYYY-MM-DD)
  };
  useEffect(() => {
    // Fetch data from the API
     axios.get('http://127.0.0.1:8000/fetch_user')
      .then(response => {
        // Filter users to only include admins
        const admins = response.data.filter(user => user.role === 'admin');
        setUsers(admins); // Set only users with the role 'admin'
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleOpenDialog = (type, item = null) => {
    setActionType(type);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

 const handleSaveItem = (itemData) => {
  if (actionType === 'add') {
    setUsers([...users, { ...itemData}]); 
    
  } else if (actionType === 'edit' && selectedItem) {
    setUsers(users.map(user => user.id === selectedItem.id ? { ...user, ...itemData } : user));
  }
};

  const handleDeleteItem = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Reset page to 0 when search query changes
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterCriteria(event.target.value);
    setPage(0);
  };

  const filteredUsers = users.filter(user => {
    const searchValue = user[filterCriteria]?.toLowerCase() || '';
    return searchValue.includes(searchQuery.toLowerCase());
  });

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get the users for the current page
  const displayedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box p={3}>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            variant="outlined"
            size="small"
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
          />
          <FormControl variant="outlined" size="small">
            <InputLabel>Filter by</InputLabel>
            <Select
              value={filterCriteria}
              onChange={handleFilterChange}
              label="Filter by"
            >
              <MenuItem value="firstname">Nom</MenuItem>
              <MenuItem value="lastname">Prenom</MenuItem>
              <MenuItem value="email">Email</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenDialog('add')}
          startIcon={<AddIcon />}
        >
         Ajouter admin
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
  <Table>
  <TableHead>
  <TableRow>
    <TableCell style={{ textAlign: 'center' }}>
      <PersonIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
      Nom
    </TableCell>
    <TableCell style={{ textAlign: 'center' }}>
      <PersonIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
      Prénom
    </TableCell>
    <TableCell style={{ textAlign: 'center' }}>
      <EmailIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
      Email
    </TableCell>
    <TableCell style={{ textAlign: 'center' }}>
      <PhoneIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
      Téléphone
    </TableCell>
    <TableCell style={{ textAlign: 'center' }}>
      <LocationOnIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
      Adresse
    </TableCell>
    <TableCell style={{ textAlign: 'center' }}>
      <CalendarIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: 4 }} />
      Date de naissance
    </TableCell>
    <TableCell style={{ textAlign: 'center' }}>
      Actions
    </TableCell>
  </TableRow>
</TableHead>

    <TableBody>
      {displayedUsers.map((user) => (
        <TableRow key={user.id}>
        
          <TableCell style={{ textAlign: 'center' }}>{user.firstname}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{user.lastname}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{user.email}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{user.phone}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{user.address}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{formatDate(user.date_naissance)}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>
            <Box display="flex" gap={1} justifyContent="center">
              <Button
                color="dark"
                onClick={() => handleOpenDialog('edit', user)}
                startIcon={<EditIcon />}
                size="small"
              >
                Edit
              </Button>
              <Button
                color="secondary"
                onClick={() => handleOpenDialog('delete', user)}
                startIcon={<DeleteIcon />}
                size="small"
              >
                Delete
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  {/* Pagination */}
  <TablePagination
    component="div"
    count={filteredUsers.length}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[5, 10, 25]}
  />
</TableContainer>


      <DialogComponent
        open={openDialog}
        onClose={handleCloseDialog}
        actionType={actionType}
        item={selectedItem}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />
    </Box>
  );
};

export default CrudComponent;
