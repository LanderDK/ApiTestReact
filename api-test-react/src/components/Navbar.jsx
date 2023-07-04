import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useCallback } from "react";
import { api } from "./Auth/api";
import { useLogout, useSession } from "../contexts/AuthProvider";

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthed } = useSession();
  const logout = useLogout();

  const handleLogin = useCallback(async () => {
    navigate("/login");
  }, [navigate]);

  const handleRegister = useCallback(async () => {
    navigate("/register");
  }, [navigate]);

  const handleExtend = useCallback(async () => {
    navigate("/extend");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <header>
      <div>
        <Link to="/">
          <h1>BlitzWare</h1>
        </Link>
      </div>
      <nav>
        <ul className="listNav">
          <li className="listItemNav">
            <Link to="/">Home</Link>
          </li>
          <li className="listItemNav">
            <Link to="/main">MainApp</Link>
          </li>
          <li className="listItemNav">
            {!isAuthed ? (
              <>
                <button onClick={handleLogin}>Sign In</button>
                <button onClick={handleRegister}>Sign Up</button>
                {!api.ApplicationSettings.freeMode ? (
                  <button onClick={handleExtend}>Extend Sub</button>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <button onClick={handleLogout}>Sign Out</button>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};
