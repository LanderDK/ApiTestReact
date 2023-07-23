import { axios } from ".";

export class API {
  constructor(name, secret, version) {
    this.Initialize(name, secret, version);
  }

  async getIP() {
    try {
      const response = await fetch("https://icanhazip.com");
      if (response.ok) {
        const ip = await response.text();
        this.Constants.ip = ip.trim();
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err) {
      console.log(err);
      console.error(`Error fetching IP address: ${err.message}`);
    }
  }

  async calculateHash(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }

  Constants = {
    initialized: false,

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
    Email: "",
    HWID: "",
    IP: "",
    Expiry: "",
    LastLogin: "",
    RegisterDate: "",
    AuthToken: "",
  };

  async Initialize(name, secret, version) {
    try {
      const response = await axios.post("applications/initialize", {
        name,
        secret,
        version,
      });

      const content = response.data;

      const receivedHash = response.headers["x-response-hash"];
      const recalculatedHash = await this.calculateHash(
        JSON.stringify(content)
      );

      // console.log(receivedHash);
      // console.log(recalculatedHash);

      if (receivedHash !== recalculatedHash) {
        alert("Possible malicious activity detected!");
        throw new Error("Request failed, try again");
      }

      if (response.status === 200) {
        this.Constants.initialized = true;
        this.ApplicationSettings.id = content.id;
        this.ApplicationSettings.name = content.name;
        this.ApplicationSettings.status = content.status;
        this.ApplicationSettings.hwidCheck = content.hwidCheck;
        this.ApplicationSettings.programHash = content.programHash;
        this.ApplicationSettings.version = content.version;
        this.ApplicationSettings.downloadLink = content.downloadLink;
        this.ApplicationSettings.developerMode = content.developerMode;
        this.ApplicationSettings.freeMode = content.freeMode;
        localStorage.setItem("app", JSON.stringify(this.ApplicationSettings));
        localStorage.setItem("consts", JSON.stringify(this.Constants));

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
          throw new Error("Request failed, try again");
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

  async Login(username, password, twoFactorCode) {
    if (!JSON.parse(localStorage.getItem("consts")).initialized) {
      alert("Please initialize your application first!");
      return false;
    }
    try {
      const response = await axios.post("users/login", {
        username: username,
        password: password,
        twoFactorCode: twoFactorCode,
        hwid: "40990C98-7D80-EA11-80D6-089798990BE2",
        lastIP: this.Constants.ip,
        appId: this.ApplicationSettings.id,
      });

      const content = response.data;

      const receivedHash = response.headers["x-response-hash"];
      const recalculatedHash = await this.calculateHash(
        JSON.stringify(content)
      );

      // console.log(receivedHash);
      // console.log(recalculatedHash);

      if (receivedHash !== recalculatedHash) {
        alert("Possible malicious activity detected!");
        throw new Error("Request failed, try again");
      }

      if (response.status === 200 || response.status === 201) {
        this.User.ID = content.user.id;
        this.User.Username = content.user.username;
        this.User.Email = content.user.email;
        this.User.Expiry = content.user.expiryDate;
        this.User.LastLogin = content.user.lastLogin;
        this.User.IP = content.user.lastIP;
        this.User.HWID = content.user.hwid;
        this.User.AuthToken = content.token;
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
            return false;
          case "NOT_FOUND":
            alert(ex.response.data.message);
            return false;
          case "VALIDATION_FAILED":
            alert(`Failed to validate username and/or password!`);
            return false;
          case "FORBIDDEN":
            alert(ex.response.data.message);
            break;
          default:
            alert(`Unknown error occurred: ${ex.response.data.code}`);
            return false;
        }
      }
      return false;
    }
  }

  async Register(username, password, email, license) {
    if (!JSON.parse(localStorage.getItem("consts")).initialized) {
      alert("Please initialize your application first!");
      return false;
    }
    try {
      const response = await axios.post("users/register", {
        username: username,
        password: password,
        email: email,
        license: license,
        hwid: "40990C98-7D80-EA11-80D6-089798990BE2",
        lastIP: this.Constants.ip,
        id: this.ApplicationSettings.id,
      });

      const content = response.data;

      const receivedHash = response.headers["x-response-hash"];
      const recalculatedHash = await this.calculateHash(
        JSON.stringify(content)
      );

      // console.log(receivedHash);
      // console.log(recalculatedHash);

      if (receivedHash !== recalculatedHash) {
        alert("Possible malicious activity detected!");
        throw new Error("Request failed, try again");
      }

      if (response.status === 200 || response.status === 201) {
        this.User.ID = content.user.id;
        this.User.Username = content.user.username;
        this.User.Email = content.user.email;
        this.User.Expiry = content.user.expiryDate;
        this.User.LastLogin = content.user.lastLogin;
        this.User.IP = content.user.lastIP;
        this.User.HWID = content.user.hwid;
        this.User.AuthToken = content.token;
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
            alert(ex.response.data.message);
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
    if (!JSON.parse(localStorage.getItem("consts")).initialized) {
      alert("Please initialize your application first!");
      return false;
    }
    try {
      const response = await axios.put("users/upgrade", {
        username: username,
        password: password,
        license: license,
        hwid: "40990C98-7D80-EA11-80D6-089798990BE2",
        appId: this.ApplicationSettings.id,
      });

      const content = response.data;

      const receivedHash = response.headers["x-response-hash"];
      const recalculatedHash = await this.calculateHash(
        JSON.stringify(content)
      );

      // console.log(receivedHash);
      // console.log(recalculatedHash);

      if (receivedHash !== recalculatedHash) {
        alert("Possible malicious activity detected!");
        throw new Error("Request failed, try again");
      }

      if (response.status === 200 || response.status === 201) {
        this.User.ID = content.user.id;
        this.User.Username = content.user.username;
        this.User.Email = content.user.email;
        this.User.Expiry = content.user.expiryDate;
        this.User.LastLogin = content.user.lastLogin;
        this.User.IP = content.user.lastIP;
        this.User.HWID = content.user.hwid;
        this.User.AuthToken = content.token;
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
          case "FORBIDDEN":
            alert(ex.response.data.message);
            return false;
          default:
            alert(`Unknown error occurred: ${ex.response.data.code}`);
            return false;
          // window.close();
        }
      }
    }
  }

  async Log(username, action) {
    if (!JSON.parse(localStorage.getItem("consts")).initialized) {
      alert("Please initialize your application first!");
      throw new Error("Request failed, try again");
    }
    try {
      const response = await axios.post("appLogs/", {
        username: username,
        action: action,
        ip: this.Constants.ip,
        appId: this.ApplicationSettings.id,
      });

      const content = response.data;

      if (response.status === 200 || response.status === 201) {
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

  async getById(id) {
    if (!JSON.parse(localStorage.getItem("consts")).initialized) {
      alert("Please initialize your application first!");
      throw new Error("Request failed, try again");
    }
    try {
      const response = await axios.get(`users/userFromWebApp/${id}`);

      const responseHash = response.headers["x-response-hash"];
      const recalculatedHash = await this.calculateHash(
        JSON.stringify(response.data)
      );

      // console.log(responseHash);
      // console.log(recalculatedHash);

      if (responseHash !== recalculatedHash) {
        alert("Possible malicious activity detected!");
        throw new Error("Request failed, try again");
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createQRCode() {
    if (!JSON.parse(localStorage.getItem("consts")).initialized) {
      alert("Please initialize your application first!");
      throw new Error("Request failed, try again");
    }
    try {
      const response = await axios.post("2fa/user", {
        userId: this.User.ID,
        appId: this.ApplicationSettings.id,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verify2FA(code) {
    if (!JSON.parse(localStorage.getItem("consts")).initialized) {
      alert("Please initialize your application first!");
      throw new Error("Request failed, try again");
    }
    try {
      const response = await axios.post("2fa/user/verify", {
        userId: this.User.ID,
        appId: this.ApplicationSettings.id,
        token: code,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async disable2FA(code) {
    if (!JSON.parse(localStorage.getItem("consts")).initialized) {
      alert("Please initialize your application first!");
      throw new Error("Request failed, try again");
    }
    try {
      const response = await axios.post("2fa/user/disable", {
        userId: this.User.ID,
        appId: this.ApplicationSettings.id,
        token: code,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const api = new API("APP NAME", "APP SECRET", "APP VERSION");
// module.exports = {
//   Initialize,
//   Login,
//   Register,
//   ExtendSub,
// };
