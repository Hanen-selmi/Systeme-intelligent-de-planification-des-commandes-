import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import {
  Box,
  Typography,
  lighten,
} from "@mui/material";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Breadcrumbs } from "@mui/material";
// Fonction pour couleur de statut
function getStatusColor(status) {
  switch (status) {
    case "validée":
      return "#4caf50";
    case "en production":
      return "#ff9800";
    case "rejetée":
      return "#f44336";
    case "en_attente":
      return "#9e9e9e";
    default:
      return "#757575";
  }
}

export default function CommandesTable() {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");

  // Récupération du nom complet depuis le token JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const nomComplet = `${decoded.firstname} ${decoded.lastname}`;
        setUsername(nomComplet);
      } catch (error) {
        console.error("Erreur décodage token :", error);
      }
    }
  }, []);

  // Récupération des commandes depuis l'API
  useEffect(() => {
    axios
      .get("http://localhost:8000/commandes")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  // Détermine la salutation selon l'heure actuelle
  const getSalutation = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  // Colonnes du tableau
  const columns = useMemo(
    () => [
      {
        header: "Commande ID",
        accessorKey: "id",
        size: 80,
      },
      {
        header: "Client",
        accessorKey: "client",
        size: 150,
      },
      {
        header: "Pièces",
        accessorFn: (row) =>
          row.lignes.map((l) => l.nom_piece || l.pieces).join(", "),
        id: "pieces",
        size: 200,
      },
      {
        header: "Statut",
        accessorKey: "statut",
        size: 100,
        Cell: ({ cell }) => (
          <Typography
            sx={{
              fontWeight: "bold",
              color: getStatusColor(cell.getValue()),
            }}
          >
            {cell.getValue()}
          </Typography>
        ),
      },
    ],
    []
  );

  // Configuration du tableau
  const table = useMaterialReactTable({
    columns,
    data,
    enableGlobalFilter: true,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableRowSelection: true,
    initialState: {
      showGlobalFilter: true,
      showColumnFilters: false,
    },
    muiSearchTextFieldProps: { size: "small", variant: "outlined" },
    renderTopToolbar: ({ table }) => (
      <Box
        sx={(theme) => ({
          backgroundColor: lighten(theme.palette.background.default, 0.05),
          display: "flex",
          justifyContent: "space-between",
          p: "8px",
        })}
      >
        <MRT_GlobalFilterTextField table={table} />
        <MRT_ToggleFiltersButton table={table} />
      </Box>
    ),
    renderDetailPanel: ({ row }) => {
      const cmd = row.original;
      const agents = [
        { key: "stock", label: "🤖 Agent Stock" },
        { key: "production", label: "⚙️ Agent Production" },
        { key: "machine", label: "🛠️ Agent Machine" },
        { key: "rh", label: "👷 Agent RH" },
        { key: "synthese", label: "📋 Agent Synthèse" },
      ];

      return (
        <Box sx={{ p: 2, bgcolor: "#f9fafb", borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="h6">🧾 Détails de commande</Typography>

          <Typography sx={{ mt: 1 }}>
            <strong>Date livraison :</strong> {cmd.date_livraison || "N/A"}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 1,
              my: 2,
            }}
          >
            <Typography fontWeight="bold">Nom de la pièce</Typography>
            <Typography fontWeight="bold">ID</Typography>
            <Typography fontWeight="bold">Quantité</Typography>
            {cmd.lignes.map((l, i) => (
              <React.Fragment key={i}>
                <Typography>{l.nom_piece || l.pieces || "N/A"}</Typography>
                <Typography>{l.pieces}</Typography>
                <Typography>{l.quantite_commandee} pcs</Typography>
              </React.Fragment>
            ))}
          </Box>

          {cmd.synthese_resultat && (
            <Box
              sx={{
                mt: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                p: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold" }}>
                🧠 Résultat d’analyse intelligente
              </Typography>

              <Box
                component="table"
                sx={{
                  width: "100%",
                  borderCollapse: "collapse",
                  "& td, & th": {
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  },
                  "& th": {
                    bgcolor: "#1976d2",
                    color: "white",
                  },
                }}
              >
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Résultat</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map(({ key, label }) => (
                    <tr key={key}>
                      <td>{label}</td>
                      <td>{cmd.synthese_resultat[key] || "Non disponible"}</td>
                    </tr>
                  ))}
                </tbody>
              </Box>

              <Typography
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                  textAlign: "right",
                  color: getStatusColor(cmd.synthese_resultat.statut),
                }}
              >
                ✅ Statut : {cmd.synthese_resultat.statut}
              </Typography>
            </Box>
          )}
        </Box>
      );
    },
  });

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography
  variant="h5"
  sx={{
    mb: 1,
    fontWeight: "medium",
    color: "#fff",
    bgcolor: 'primary.main',
    px: 3, // padding horizontal
    py: 1.5, // padding vertical
    borderRadius: 2,
    boxShadow: '0 4px 10px rgb(25 118 210 / 0.3)',
  
    mx: 'auto', // centrer horizontalement
    userSelect: 'none', // évite la sélection involontaire
  }}
>
   Suivi des Demandes Clients 
</Typography>

<Typography
  variant="h4"
  sx={{
    mb: 3,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1976d2",
  }}
>
  📋 Tableau de suivi des commandes 
</Typography>


      <MaterialReactTable table={table} />
    </Box>
  );
}
