import { api } from "./Auth/API";

export const MainApp = () => {
  return (
    <>
      <h1>Hello MainApp</h1>
      <p>Username: {api.User.Username}</p>
      <p>Email: {api.User.Email}</p>
      <p>Subscription Expiry: {api.User.Expiry}</p>
      <p>Last Login: {api.User.LastLogin}</p>
      <p>IP: {api.User.IP}</p>
    </>
  );
};
