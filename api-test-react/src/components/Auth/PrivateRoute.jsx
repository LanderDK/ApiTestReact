import { Navigate, useLocation } from "react-router-dom";
import { api } from "./API";

export default function PrivateRoute({ children, role, ...rest }) {
  const { pathname } = useLocation();

  return (
    <>
      {api.Constants.isAuthed ? (
        children
      ) : (
        <Navigate from={pathname} to="/login" />
      )}
    </>
  );
}
