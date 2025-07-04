import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode'; // Pour décoder le token

const RoleGuard = ({ children, roles = [] }) => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation(); // Pour capturer la route actuelle

  // Rediriger si le token n'existe pas
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  let userRole;
  try {
    // Décoder le token pour obtenir le rôle de l'utilisateur
    const decodedToken = jwt_decode(token);
    userRole = decodedToken.role;
  } catch (error) {
    console.error('Invalid token:', error);
    return <Navigate to="/auth/login" replace />;
  }

  // Vérifiez si le rôle de l'utilisateur est autorisé
  if (!roles.includes(userRole)) {
    // Rediriger l'utilisateur vers sa page par défaut en fonction de son rôle
    if (userRole === 'admin') {
      return <Navigate to="/dashboard" replace state={{ from: location }} />;
    } else if (userRole === 'user') {
      return <Navigate to="/passer_commande" replace state={{ from: location }} />;
    } 

    else {
      return <Navigate to="/auth/login" replace />;
    }
  }

  return children; // Si tout est correct, rendre les enfants protégés
};

export default RoleGuard;
