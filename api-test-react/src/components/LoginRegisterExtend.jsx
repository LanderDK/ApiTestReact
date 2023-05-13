import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./Auth/API";

export const Login = () => {
  const [isSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];
    // Compare user info
    if (await api.Login(uname.value, pass.value)) {
      await api.Log(api.User.Username, "User logged in");
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

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass, email, license } = document.forms[0];
    // Compare user info
    if (!api.ApplicationSettings.freeMode) {
      if (
        await api.Register(uname.value, pass.value, email.value, license.value)
      ) {
        await api.Log(api.User.Username, "User registered");
        console.log("REGISTERD");
        navigate(`/login`);
        // setIsSubmitted(true);
      } else {
        // Username not found
        console.log("NOT REGISTERD");
      }
    } else {
      if (await api.Register(uname.value, pass.value, email.value, "N/A")) {
        await api.Log(api.User.Username, "User registered");
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

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass, license } = document.forms[0];
    // Compare user info
    if (await api.ExtendSub(uname.value, pass.value, license.value)) {
      await api.Log(api.User.Username, "User extended");
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
