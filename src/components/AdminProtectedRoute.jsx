
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminProtectedRoute() {
  const { user, loading } = useSelector(
    (state) => state.auth
  );

  const location = useLocation();

  // Wait while authentication is being checked
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // Check whether the user is logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check whether the logged-in user is an admin
  if (
    user.role !== "ADMIN" ||
    user.email?.toLowerCase() !==
      "vaishnaviboopathi12@gmail.com"
  ) {
    return <Navigate to="/" replace />;
  }

  // Allow admin to access protected pages
  return <Outlet />;
}

export default AdminProtectedRoute;
