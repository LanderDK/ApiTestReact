import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";
import * as userAPI from "../components/Auth/api";
import * as API from "../components/Auth";
import config from "../config.json";
import { Buffer } from "buffer";

const JWT_TOKEN_KEY = config.token_key;
const AuthContext = createContext();

function parseJwt(token) {
  try {
    if (!token) return {};
    const base64Url = token.split(".")[1];
    const payload = Buffer.from(base64Url, "base64");
    const jsonPayload = payload.toString("ascii");
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error(error);
  }
}

function parseExp(exp) {
  if (!exp) return null;
  if (typeof exp !== "number") exp = Number(exp);
  if (isNaN(exp)) return null;
  return new Date(exp * 1000);
}

const useAuth = () => useContext(AuthContext);

export const useSession = () => {
  const { stateToken, user, ready, loading, error, hasRole, tokenValid } =
    useAuth();

  const { roles, username, id } = parseJwt(localStorage.getItem(JWT_TOKEN_KEY));

  return {
    stateToken,
    user,
    ready,
    error,
    loading,
    isAuthed: Boolean(stateToken),
    hasRole,
    roles,
    username,
    accId: id,
    tokenValid,
  };
};

export const useLogin = () => {
  const { login } = useAuth();
  return login;
};

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};

export const useRegister = () => {
  const { register } = useAuth();
  return register;
};

export const useExtend = () => {
  const { extend } = useAuth();
  return extend;
};

export const AuthProvider = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stateToken, setStateToken] = useState(
    localStorage.getItem(JWT_TOKEN_KEY)
  );
  const [user, setUser] = useState(null);

  const tokenValid = useCallback(
    async (token = stateToken) => {
      const { exp, id } = parseJwt(token);
      const expiry = parseExp(exp);
      const stillValid = expiry >= new Date();

      if (stillValid) {
        localStorage.setItem(JWT_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(JWT_TOKEN_KEY);
        token = null;
      }

      API.setAuthToken(token);
      setStateToken(token);
      setReady(token && stillValid);

      return { stillValid, id };
    },
    [stateToken]
  );

  const setSession = useCallback(
    async (token, user) => {
      const { stillValid, id } = await tokenValid(token);
      if (!user && stillValid) {
        user = await userAPI.api.getById(id);
      }
      setUser(user);
    },
    [tokenValid]
  );

  useEffect(() => {
    setSession(stateToken);
  }, [stateToken, setSession]);

  const login = useCallback(
    async (username, password) => {
      try {
        setLoading(true);
        setError(null);
        const success = await userAPI.api.Login(username, password);

        if (success) {
          await setSession(userAPI.api.User.AuthToken, userAPI.api.User);
          return { booleanValue: true, stringValue: "" };
        } else {
          setSession(null, null);
          return { booleanValue: false, stringValue: "" };
        }
      } catch (error) {
        return {
          booleanValue: false,
          stringValue: "Login failed, try again",
        };
      } finally {
        setLoading(false);
      }
    },
    [setSession]
  );

  const register = useCallback(
    async (username, email, password, license) => {
      try {
        setLoading(true);
        setError(null);
        const { token, user } = await userAPI.api.Register(
          username,
          password,
          email,
          license
        );
        await setSession(token, user);
        return true;
      } catch (error) {
        let response;
        let data;
        let message;
        try {
          response = error.response;
          data = response.data;
          message = data.message;
        } catch (error) {
          setError("Registration failed, try again");
          return false;
        }
        if (Object.keys(message).length !== 0) setError(message);
        else setError("Registration failed, try again");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setSession]
  );

  const extend = useCallback(
    async (username, password, license) => {
      try {
        setLoading(true);
        setError(null);
        const { token, user } = await userAPI.api.ExtendSub(
          username,
          password,
          license
        );
        await setSession(token, user);
        return true;
      } catch (error) {
        let response;
        let data;
        let message;
        try {
          response = error.response;
          data = response.data;
          message = data.message;
        } catch (error) {
          setError("Extend failed, try again");
          return false;
        }
        if (Object.keys(message).length !== 0) setError(message);
        else setError("Extend failed, try again");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setSession]
  );

  const logout = useCallback(() => {
    setSession(null, null);
  }, [setSession]);

  const hasRole = useCallback(
    (role) => {
      if (!user) return false;
      return user.roles.includes(role);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      stateToken,
      user,
      ready,
      loading,
      error,
      login,
      logout,
      register,
      extend,
      hasRole,
      tokenValid,
    }),
    [
      stateToken,
      user,
      ready,
      loading,
      error,
      login,
      logout,
      register,
      extend,
      hasRole,
      tokenValid,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
