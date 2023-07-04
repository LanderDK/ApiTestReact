import React, {
  useContext,
} from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { NotFound } from "./components/NotFound";
import { Home } from "./components/Home";
import { Login, Register, ExtendSub } from "./components/LoginRegisterExtend";
import { MainApp } from "./components/MainApp";
import PrivateRoute from "./components/Auth/PrivateRoute";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from './contexts/AuthProvider';


function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route index element={<><Home /> </>} />
          <Route path="/main" element={<><PrivateRoute> <MainApp /> </PrivateRoute> </>} />
          <Route path="/login" element={<> <Login /> </>} />
          <Route path="/register" element={<> <Register /> </>} />
          <Route path="/extend" element={<> <ExtendSub /> </>} />
          <Route path="*" element={<> <NotFound /> </>} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
