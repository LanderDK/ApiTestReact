// import { Navigate, useLocation } from "react-router-dom";
// import { api } from "./API";

// export default function PrivateRoute({ children, role, ...rest }) {
//   const { pathname } = useLocation();

//   return (
//     <>
//       {api.Constants.isAuthed ? (
//         children
//       ) : (
//         <Navigate from={pathname} to="/login" />
//       )}
//     </>
//   );
// }

import { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../../contexts/AuthProvider";

export default function PrivateRoute({ children, role, ...rest }) {
  const { isAuthed, hasRole } = useSession();
  const { pathname } = useLocation();

  const canShowRoute = useMemo(() => {
    if (!role) return isAuthed;
    return isAuthed && hasRole(role);
  }, [isAuthed, role, hasRole]);

  return (
    <>{canShowRoute ? children : <Navigate from={pathname} to="/login" />}</>
  );
}
