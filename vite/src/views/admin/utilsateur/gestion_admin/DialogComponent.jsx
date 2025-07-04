import  { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  CircularProgress,

} from '@mui/material';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const DialogComponent = ({ open, onClose, actionType, item, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    role: 'admin',
    phone: '',
    address: '',
    date_naissance: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const formatDate = (isoDate) => {
    if (!isoDate) return ''; // Handle null or undefined dates
    const date = new Date(isoDate); // Create a Date object from ISO string
    
    // Format date as YYYY-MM-DD without timezone shifting
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust for local timezone offset
    return localDate.toISOString().split('T')[0]; // Return only the date part (YYYY-MM-DD)
  };
  const validate = () => {
    let newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = "Le nom est requis.";
    if (!formData.lastname.trim()) newErrors.lastname = "Le prénom est requis.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Email invalide.";
    if (!formData.phone.match(/^\d+$/)) newErrors.phone = "Le téléphone doit contenir uniquement des chiffres.";
    if (!formData.date_naissance) newErrors.date_naissance = "La date de naissance est requise.";
    if (!formData.address) newErrors.address = "L'adresse est requise.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    if (actionType === 'edit' && item) {
      setFormData({
        firstname: item.firstname,
        lastname: item.lastname,
        email: item.email,
        role: item.role || 'admin',
        phone: item.phone,
        address: item.address,
        date_naissance: item.date_naissance,
      });
    } else if (actionType === 'add') {
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        role: 'admin',
        phone: '',
        address: '',
        date_naissance: '',
      });
    }
  }, [actionType, item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (actionType === 'add') {
        const response = await axios.post(`http://localhost:8000/add_user`, formData);
        toast.success("admin ajouté avec succès !");
      } else if (actionType === 'edit') {
       await axios.put(`http://localhost:8000/update_user/${item.id}`, formData);
        toast.success("admin mis à jour avec succès !");
      }
      onSave(formData);
      onClose();
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Cet email est déjà utilisé. Veuillez en choisir un autre.",
        }));
        toast.error("Erreur : cet email est déjà utilisé.");
      } else {
        toast.error("Une erreur est survenue, veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/delete_user/${item.id}`);
      toast.success("Utilisateur supprimé avec succès !");
      onDelete(item.id);
      onClose();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {actionType === 'add' ? 'Ajouter admin' : actionType === 'edit' ? 'Modifier admin' : 'Supprimer admin'}
        </DialogTitle>
        <DialogContent dividers>
          {actionType === 'delete' ? (
            <p>Êtes-vous sûr de vouloir supprimer {item?.firstname} {item?.lastname} ?</p>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField  error={!!errors.firstname}
                  helperText={errors.firstname} name="firstname" label="Nom" value={formData.firstname} onChange={handleChange} fullWidth variant="outlined" autoFocus  color="secondary"/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField  error={!!errors.lastname}
                  helperText={errors.lastname} name="lastname" label="Prénom" value={formData.lastname} onChange={handleChange} fullWidth variant="outlined" color="secondary"/>
              </Grid>
              <Grid item xs={12}>
                <TextField   error={!!errors.email}
                  helperText={errors.email}  name="email" label="Email" type="email" value={formData.email} onChange={handleChange} fullWidth variant="outlined" color="secondary" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField  error={!!errors.phone}
                  helperText={errors.phone} name="phone" label="Téléphone" value={formData.phone} onChange={handleChange} fullWidth variant="outlined" color="secondary"/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField  error={!!errors.address}
                  helperText={errors.address} name="address" label="Adresse" value={formData.address} onChange={handleChange} fullWidth variant="outlined" color="secondary"/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField   error={!!errors.date_naissance}
                  helperText={errors.date_naissance} name="date_naissance" label="Date de Naissance" type="date" value={formatDate(formData.date_naissance)} onChange={handleChange} color="secondary" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="role" label="Rôle" value={formData.role} fullWidth variant="outlined" disabled />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined" color="dark" disabled={loading}>Annuler</Button>
          {actionType === 'delete' ? (
            <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>Supprimer</Button>
          ) : (
            <Button onClick={handleSubmit} variant="contained" color="secondary" disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : actionType === 'add' ? 'Ajouter' : 'Enregistrer'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
     
    </>
  );
};

export default DialogComponent;