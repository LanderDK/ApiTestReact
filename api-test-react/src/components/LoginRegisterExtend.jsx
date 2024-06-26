import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { api } from "./Auth/api";
import {
  useLogin,
  useRegister,
  useExtend,
  useSession,
} from "../contexts/AuthProvider";

export const Login = () => {
  const [isSubmitted] = useState(false);
  const navigate = useNavigate();
  const login = useLogin();
  const { loading, error, isAuthed } = useSession();

  if (isAuthed) {
    return <Navigate from="/login" to={`/main`} />;
  }

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass, twoFactor } = document.forms[0];
    // Compare user info
    // if (await api.Login(uname.value, pass.value)) {
    const success = await login(uname.value, pass.value, twoFactor.value);
    if (success.booleanValue) {
      await api.Log("User logged in");
      console.log("LOGGED IN");
      navigate(`/main`);
      // setIsSubmitted(true);
    } else {
      // Username not found
      console.log("NOT LOGGED IN");
    }
  };

  // JSX code for login form
  const renderForm = (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username </label>
          <input type="text" name="uname" required />
        </div>
        <div>
          <label>Password </label>
          <input type="password" name="pass" required />
        </div>
        <div>
          <label>2FA Code (if enabled)</label>
          <input type="twoFactor" name="twoFactor" />
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <div>
        <h1>Sign In</h1>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div>
    </div>
  );
};

export const Register = () => {
  const [isSubmitted] = useState(false);
  const navigate = useNavigate();
  const register = useRegister();
  const { loading, error, isAuthed } = useSession();

  if (isAuthed) {
    return <Navigate from="/register" to={`/main`} />;
  }

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass, email, license } = document.forms[0];
    // Compare user info
    if (!api.ApplicationSettings.freeMode) {
      // if (
      //   await api.Register(uname.value, pass.value, email.value, license.value)
      // ) {
      if (await register(uname.value, pass.value, email.value, license.value)) {
        await api.Log("User registered");
        console.log("REGISTERD");
        navigate(`/login`);
        // setIsSubmitted(true);
      } else {
        // Username not found
        console.log("NOT REGISTERD");
      }
    } else {
      // if (await api.Register(uname.value, pass.value, email.value, "N/A")) {
      if (await register(uname.value, pass.value, email.value, "N/A")) {
        await api.Log("User registered");
        console.log("REGISTERD");
        navigate(`/login`);
        // setIsSubmitted(true);
      } else {
        // Username not found
        console.log("NOT REGISTERD");
      }
    }
  };

  // JSX code for login form
  const renderForm = (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username </label>
          <input type="text" name="uname" required />
        </div>
        <div>
          <label>Password </label>
          <input type="password" name="pass" required />
        </div>
        <div>
          <label>Email </label>
          <input type="text" name="email" required />
        </div>
        {!api.ApplicationSettings.freeMode ? (
          <div>
            <label>License </label>
            <input type="text" name="license" required />
          </div>
        ) : (
          <></>
        )}

        <div>
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <div>
        <h1>Sign Up</h1>
        {isSubmitted ? <div>User is successfully registered</div> : renderForm}
      </div>
    </div>
  );
};

export const ExtendSub = () => {
  const [isSubmitted] = useState(false);
  const navigate = useNavigate();
  const extend = useExtend();
  const { loading, error, isAuthed } = useSession();

  if (isAuthed) {
    return <Navigate from="/extend" to={`/main`} />;
  }

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass, license } = document.forms[0];
    // Compare user info
    // if (await api.ExtendSub(uname.value, pass.value, license.value)) {
    if (await extend(uname.value, pass.value, license.value)) {
      await api.Log("User extended");
      console.log("EXTENDED");
      navigate(`/login`);
      // setIsSubmitted(true);
    } else {
      // Username not found
      console.log("NOT EXTENDED");
    }
  };

  // JSX code for login form
  const renderForm = (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username </label>
          <input type="text" name="uname" required />
        </div>
        <div>
          <label>Password </label>
          <input type="password" name="pass" required />
        </div>
        <div>
          <label>License </label>
          <input type="text" name="license" required />
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <div>
        <h1>Extend Subscription</h1>
        {isSubmitted ? (
          <div>User subscription successfully extended</div>
        ) : (
          renderForm
        )}
      </div>
    </div>
  );
};
