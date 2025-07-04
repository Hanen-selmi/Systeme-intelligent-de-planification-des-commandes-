import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import jwt_decode from "jwt-decode";

export default function OrderForm() {
  const [client, setClient] = useState("");
  const [pieces, setPieces] = useState([]);
  const [pieceIds, setPieceIds] = useState([]); // Plusieurs pièces sélectionnées
  const [quantites, setQuantites] = useState({}); // Quantité par pièce
  const [dateLivraisonSouhaitee, setDateLivraisonSouhaitee] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailClient, setEmailClient] = useState("");

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt_decode(token);
      const fullname = `${decoded.firstname} ${decoded.lastname}`;
      setClient(fullname);

      // Ajoute cette ligne pour stocker l’email
      setEmailClient(decoded.sub);
    } catch (err) {
      console.error("Erreur décodage token :", err);
    }
  }

    // Récupération des pièces
    const fetchPieces = async () => {
      try {
        const res = await fetch("http://localhost:8000/pieces");
        const data = await res.json();
        console.log("Pieces récupérées :", data);
        setPieces(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des pièces :", err);
      }
    };
    fetchPieces();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const champsRemplis =
    client &&
    pieceIds.length > 0 &&
    dateLivraisonSouhaitee &&
    pieceIds.every((id) => quantites[id] && quantites[id] > 0);

  if (!champsRemplis) {
    setError("Veuillez remplir tous les champs et quantités.");
    setSuccess("");
    return;
  }

  const lignes = pieceIds.map((id) => ({
    piece_id: id,
    quantite_demandee: Number(quantites[id]),
  }));

  const data = {
    client_nom: client,
    date_livraison_prevue: dateLivraisonSouhaitee,
    lignes,
     email_client: emailClient,
  };

  try {
    const response = await fetch("http://localhost:8000/commande", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json(); 

    if (!response.ok) {
      throw new Error(result.detail || "Erreur serveur inconnue");
    }

    setSuccess(result.message || "Commande envoyée avec succès !");
    setError("");
    setPieceIds([]);
    setQuantites({});
    setDateLivraisonSouhaitee("");
  } catch (err) {
    setError(err.message || "Erreur lors de l'envoi.");
    setSuccess("");
  }
};


  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Passer une commande
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Nom du client"
          value={client}
          disabled
          margin="normal"
          required
        />

       
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="piece-select-label">Pièces</InputLabel>
          <Select
            labelId="piece-select-label"
            multiple
            value={pieceIds}
            onChange={(e) => setPieceIds(e.target.value)}
            renderValue={(selected) =>
              selected
                .map((id) => pieces.find((p) => p.piece_id === id)?.nom_piece)
                .join(", ")
            }
          >
            {pieces.map((piece) => (
              <MenuItem key={piece.piece_id} value={piece.piece_id}>
                {piece.nom_piece}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      
        {pieceIds.map((id) => {
          const piece = pieces.find((p) => p.piece_id === id);
          return (
            <TextField
              key={id}
              fullWidth
              label={`Quantité pour ${piece?.nom_piece}`}
              type="number"
              value={quantites[id] || ""}
              onChange={(e) =>
                setQuantites({ ...quantites, [id]: e.target.value })
              }
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
          );
        })}

        <TextField
          fullWidth
          label="Date de livraison souhaitée"
          type="date"
          value={dateLivraisonSouhaitee}
          onChange={(e) => setDateLivraisonSouhaitee(e.target.value)}
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 3 }}
        >
          Envoyer la commande
        </Button>
      </Box>
    </Container>
  );
}
