import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // adjust path

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  console.log("status:",isAuthenticated);

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default ProtectedRoute;
