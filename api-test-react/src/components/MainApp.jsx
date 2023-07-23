import { useSession } from "../contexts/AuthProvider";
import { useEffect, useCallback, useState } from "react";
import { api } from "./Auth/api";

export const MainApp = () => {
  const { tokenValid, user } = useSession();
  const [qrCreated, setQRCreated] = useState(false);
  const [qrImg, setQRImg] = useState(null);
  const [code, setCode] = useState(null);

  const checkToken = useCallback(async () => {
    await tokenValid();
  }, [tokenValid]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const createQRCode = async () => {
    try {
      await tokenValid();
      const img = await api.createQRCode();
      setQRImg(img);
      setQRCreated(true);
    } catch (error) {
      console.error(error);
    }
  };

  const enable2FA = async () => {
    try {
      await tokenValid();
      await api.verify2FA(code);
    } catch (error) {
      console.error(error);
    }
  };

  const disable2FA = async () => {
    try {
      await tokenValid();
      await api.disable2FA(code);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Hello MainApp</h1>
      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Subscription Expiry: {user.expiryDate}</p>
      <p>Last Login: {user.lastLogin}</p>
      <p>IP: {user.lastIP}</p>
      <div>
        <h2>Enable 2FA</h2>
        <button onClick={createQRCode}>Create QR Code</button>
        <br />
        {qrCreated ? (
          <>
            <img src={qrImg} alt="qrImg" />
            <br />
            <input type="text" onChange={(e) => setCode(e.target.value)} />
            <button onClick={enable2FA}>Enable 2FA</button>
          </>
        ) : (
          <></>
        )}
      </div>
      <div>
        <h2>Disable 2FA</h2>
        <input type="text" onChange={(e) => setCode(e.target.value)} />
        <button onClick={disable2FA}>Disable 2FA</button>
      </div>
    </>
  );
};
