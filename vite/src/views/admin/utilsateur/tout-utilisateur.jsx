import { useState, useEffect } from 'react';
import React from 'react'; 
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, FormControl, IconButton, Collapse, Box,
  Button, Select, MenuItem, Card, CardContent, Typography, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import dayjs from 'dayjs';
import {
  Badge as IdIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AdminPanelSettings as RoleIcon,
  VerifiedUser as StatusIcon,
  CalendarMonth as CreatedAtIcon,
  Build as ActionIcon
} from '@mui/icons-material';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50, align: 'center', icon: <IdIcon fontSize="small" /> },
  { id: 'firstname', label: 'Nom', minWidth: 100, align: 'center', icon: <PersonIcon fontSize="small" /> },
  { id: 'lastname', label: 'Prénom', minWidth: 100, align: 'center', icon: <PersonIcon fontSize="small" /> },
  { id: 'email', label: 'Email', minWidth: 150, align: 'center', icon: <EmailIcon fontSize="small" /> },
  { id: 'role', label: 'Rôle', minWidth: 100, align: 'center', icon: <RoleIcon fontSize="small" /> },
  { id: 'statue', label: 'Statut', minWidth: 100, align: 'center', icon: <StatusIcon fontSize="small" /> },
  { id: 'created_at', label: 'Créé le', minWidth: 120, align: 'center', icon: <CreatedAtIcon fontSize="small" /> },
  { id: 'actions', label: 'Actions', minWidth: 100, align: 'center', icon: <ActionIcon fontSize="small" /> }
];


export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterRole, setFilterRole] = useState('');
  const [searchText, setSearchText] = useState('');
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/fetch_user')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleStatusChange = (userId) => {
  const user = users.find(u => u.id === userId);
  const newStatus = user.statue === 'débloqué' ? 'bloqué' : 'débloqué';

  fetch(`http://127.0.0.1:8000/update_user_status/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ statue: newStatus }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.detail || 'Erreur inconnue') });
      }
      return response.json();
    })
    .then(() => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, statue: newStatus } : user
        )
      );
    })
    .catch((error) => {
      console.error('Error updating user status:', error);
      alert(`Erreur lors de la mise à jour: ${error.message}`);
    });
};
  const handleRowToggle = (userId) => {
    setOpenRow(openRow === userId ? null : userId);
  };

  const validUsers = Array.isArray(users) ? users : [];

  const filteredUsers = validUsers.filter(user =>
    (filterRole ? user.role === filterRole : true) &&

    (user.firstname?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()))
  );

  const getStatusColor = (status) => {
    return status === 'débloqué' ? 'green' : 'red';
  };

 

  

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Rechercher par nom, prénom ou email..."
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '45%' }}
        />
        <FormControl sx={{ width: '45%' }}>
          <Select
            id="role-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            displayEmpty
            sx={{ width: '100%' }}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon /> Filtrer par rôle
              </InputAdornment>
            }
          >
            <MenuItem value="">Tous les rôles</MenuItem>
            {[...new Set(users.map(user => user.role))].map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </Select>
        </FormControl>
     
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="users table">
        <TableHead>
  <TableRow >
    {columns.map((column) => (
      <TableCell
        key={column.id}
        align={column.align}
        style={{ minWidth: column.minWidth, fontWeight: 'bold' ,textAlign:'center'}}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          {column.icon}
          {column.label}
        </Box>
      </TableCell>
    ))}
  </TableRow>
</TableHead>

         <TableBody>
  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
    <React.Fragment key={user.id}>
      <TableRow tabIndex={-1}>
        {columns.map((column) => {
          if (column.id === 'created_at') {
            return (
              <TableCell key={column.id}>{dayjs(user.created_at).format('DD/MM/YYYY HH:mm')}</TableCell>
            );
          }
          if (column.id === 'statue') {
            return (
              <TableCell key={column.id} sx={{ color: getStatusColor(user.statue) }}>
                {user.statue}
              </TableCell>
            );
          }
          if (column.id === 'actions') {
            return (
              <TableCell key={column.id} align={column.align}>
                <Button
                  variant="outlined"
                  color={user.statue === 'débloqué' ? 'error' : 'success'}
                  onClick={() => handleStatusChange(user.id)}
                >
                  {user.statue === 'débloqué' ? 'bloqué' : 'débloqué'}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ ml: 1 }}
                  color="secondary"
                  onClick={() => handleRowToggle(user.id)}
                >
                  {openRow === user.id ? 'Masquer les détails' : 'Afficher les détails'}
                </Button>
              </TableCell>
            );
          }
          return <TableCell key={column.id}>{user[column.id]}</TableCell>;
        })}
      </TableRow>
      <TableRow>
        <TableCell colSpan={columns.length} sx={{ padding: 0 }}>
          <Collapse in={openRow === user.id} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, padding: 2 }}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6">Détails de l'utilisateur</Typography>
                  <Typography><strong>Nom :</strong> {user.firstname} {user.lastname}</Typography>
                  <Typography><strong>Email :</strong> {user.email}</Typography>
                  <Typography><strong>Créé le :</strong> {dayjs(user.created_at).format('DD/MM/YYYY HH:mm')}</Typography>
                </CardContent>
              </Card>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  ))}
</TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
  
          borderTop: '1px solid #ddd',
          padding: '8px 16px',
          justifyContent: 'center',
        }}
      />
    </Paper>
  );
}
