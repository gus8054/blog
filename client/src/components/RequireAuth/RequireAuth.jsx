import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user?.username) return <>{children}</>;

  return <Navigate to="/login" replace={true} />;
};

export default RequireAuth;
