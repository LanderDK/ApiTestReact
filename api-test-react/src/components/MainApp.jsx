import { useSession } from "../contexts/AuthProvider";
import { useEffect, useCallback } from "react";

export const MainApp = () => {
  const { tokenValid, user } = useSession();

  const checkToken = useCallback(async () => {
    await tokenValid();
  }, [tokenValid]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return (
    <>
      <h1>Hello MainApp</h1>
      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Subscription Expiry: {user.expiryDate}</p>
      <p>Last Login: {user.lastLogin}</p>
      <p>IP: {user.lastIP}</p>
    </>
  );
};
