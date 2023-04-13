import axios from "axios";

export class API {
  constructor(name, secret, version) {
    this.Initialize(name, secret, version);
  }

  async getIP() {
    try {
      const response = await axios.get("https://icanhazip.com");
      this.Constants.ip = response.data.trim();
    } catch (err) {
      console.error(`Error fetching IP address: ${err.message}`);
    }
  }

  Constants = {
    apiUrl: "https://api.blitzware.xyz/api/",
    //apiUrl: 'http://localhost:9000/api/',

    initialized: false,

    isAuthed: false,

    started: false,

    breached: false,

    timeSent: new Date(),

    ip: this.getIP(),
  };

  ApplicationSettings = {
    id: "",
    status: false,
    initialized: false,
    hwidCheck: false,
    developerMode: false,
    programHash: "",
    version: "",
    downloadLink: "",
    freeMode: false,
    login: false,
    name: "",
    register: false,
    TotalUsers: "",
  };

  User = {
    ID: "",
    Username: "",
    Password: "",
    Email: "",
    HWID: "",
    IP: "",
    Expiry: "",
    LastLogin: "",
    RegisterDate: "",
  };

  async Initialize(name, secret, version) {
    try {
      const url = `${this.Constants.apiUrl}applications/initialize`;
      const response = await axios.post(url, {
        name,
        secret,
        version,
      });

      const content = response.data;

      if (response.status === 200) {
        this.Constants.initialized = true;
        this.ApplicationSettings.id = content.id;
        this.ApplicationSettings.status = content.status;
        this.ApplicationSettings.hwidCheck = content.hwidCheck;
        this.ApplicationSettings.programHash = content.programHash;
        this.ApplicationSettings.version = content.version;
        this.ApplicationSettings.downloadLink = content.downloadLink;
        this.ApplicationSettings.developerMode = content.developerMode;
        this.ApplicationSettings.freeMode = content.freeMode;

        if (this.ApplicationSettings.freeMode) {
          alert("Application is in Free Mode!");
        }
        if (this.ApplicationSettings.developerMode) {
          alert("Application is in Developer Mode!");
          // Do something
        } else {
          if (this.ApplicationSettings.version !== version) {
            alert(`Update ${this.ApplicationSettings.version} available!`);
            // Do something
          }
        }

        if (!this.ApplicationSettings.status) {
          alert(
            "Looks like this application is disabled, please try again later!"
          );
          this.Constants.initialized = false;
          //   window.close();
        }
      }
    } catch (ex) {
      if (ex.code === "ERR_NETWORK")
        alert("Unable to connect to the remote server!");
      // window.close();
      else {
        switch (ex.response.data.code) {
          case "UNAUTHORIZED":
            alert(ex.response.data.message);
            // window.close();
            break;
          case "NOT_FOUND":
            alert(ex.response.data.message);
            // window.close();
            break;
          case "VALIDATION_FAILED":
            alert(`Failed to initialize your application correctly!`);
            // window.close();
            break;
          default:
            alert(`Unknown error occurred: ${ex.response.data.code}`);
            // window.close();
            break;
        }
      }
    }
  }

  async Login(username, password) {
    if (!this.Constants.initialized) {
      alert("Please initialize your application first!");
      return false;
    }
    try {
      const url = `${this.Constants.apiUrl}users/login`;
      const response = await axios.post(url, {
        username: username,
        password: password,
        hwid: "40990C98-7D80-EA11-80D6-089798990BE2",
        lastIP: this.Constants.ip,
      });

      const content = response.data;

      if (response.status === 200 || response.status === 201) {
        this.User.ID = content.id;
        this.User.Username = content.username;
        this.User.Password = content.password;
        this.User.Email = content.email;
        this.User.Expiry = content.expiryDate;
        this.User.LastLogin = content.lastLogin;
        this.User.IP = content.lastIP;
        this.User.HWID = content.hwid;
        this.Constants.isAuthed = true;
        return true;
      }
    } catch (ex) {
      if (ex.code === "ERR_NETWORK")
        alert("Unable to connect to the remote server!");
      // window.close();
      else {
        switch (ex.response.data.code) {
          case "UNAUTHORIZED":
            alert(ex.response.data.message);
            // window.close();
            break;
          case "NOT_FOUND":
            alert(ex.response.data.message);
            // window.close();
            break;
          case "VALIDATION_FAILED":
            alert(`Failed to validate username and/or password!`);
            // window.close();
            break;
          default:
            alert(`Unknown error occurred: ${ex.response.data.code}`);
            // window.close();
            break;
        }
      }
    }
  }

  async Register(username, password, email, license) {
    if (!this.Constants.initialized) {
      alert("Please initialize your application first!");
      return false;
    }
    try {
      const url = `${this.Constants.apiUrl}users/register`;
      const response = await axios.post(url, {
        username: username,
        password: password,
        email: email,
        license: license,
        hwid: "40990C98-7D80-EA11-80D6-089798990BE2",
        lastIP: this.Constants.ip,
        id: this.ApplicationSettings.id,
      });

      const content = response.data;

      if (response.status === 200 || response.status === 201) {
        this.User.ID = content.id;
        this.User.Username = content.username;
        this.User.Password = content.password;
        this.User.Email = content.email;
        this.User.Expiry = content.expiryDate;
        this.User.LastLogin = content.lastLogin;
        this.User.IP = content.lastIP;
        this.User.HWID = content.hwid;
        return true;
      }
    } catch (ex) {
      if (ex.code === "ERR_NETWORK") {
        alert("Unable to connect to the remote server!");
        return false;
        // window.close();
      } else {
        switch (ex.response.data.code) {
          case "ER_DUP_ENTRY":
            alert("User with this username already exists!");
            return false;
          // window.close();
          case "FORBIDDEN":
            alert("User with this username already exists!");
            return false;
          // window.close();
          case "NOT_FOUND":
            alert(ex.response.data.message);
            return false;
          // window.close();
          case "VALIDATION_FAILED":
            alert("Failed to validate username and/or password and/or email!");
            return false;
          // window.close();
          default:
            alert(`Unknown error occurred: ${ex.response.data.code}`);
            return false;
          // window.close();
        }
      }
    }
  }

  async ExtendSub(username, password, license) {
    if (!this.Constants.initialized) {
      alert("Please initialize your application first!");
      return false;
    }
    try {
      const url = `${this.Constants.apiUrl}users/upgrade`;
      const response = await axios.put(url, {
        username: username,
        password: password,
        license: license,
        hwid: "40990C98-7D80-EA11-80D6-089798990BE2",
      });

      const content = response.data;

      if (response.status === 200 || response.status === 201) {
        this.User.ID = content.id;
        this.User.Username = content.username;
        this.User.Password = content.password;
        this.User.Email = content.email;
        this.User.Expiry = content.expiryDate;
        this.User.LastLogin = content.lastLogin;
        this.User.IP = content.lastIP;
        this.User.HWID = content.hwid;
        return true;
      }
    } catch (ex) {
      if (ex.code === "ERR_NETWORK") {
        alert("Unable to connect to the remote server!");
        return false;
        // window.close();
      } else {
        switch (ex.response.data.code) {
          case "NOT_FOUND":
            alert(ex.response.data.message);
            return false;
          // window.close();
          case "VALIDATION_FAILED":
            alert(ex.response.data.message);
            return false;
          // window.close();
          case "UNAUTHORIZED":
            alert(ex.response.data.message);
            return false;
          // window.close();
          default:
            alert(`Unknown error occurred: ${ex.response.data.code}`);
            return false;
          // window.close();
        }
      }
    }
  }
}

export const api = new API(
  "APP NAME",
  "SECRET",
  "VERSION"
);
// module.exports = {
//   Initialize,
//   Login,
//   Register,
//   ExtendSub,
// };
