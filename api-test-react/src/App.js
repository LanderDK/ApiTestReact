import "./App.css";
import { Routes, Route } from "react-router-dom";
import { NotFound } from "./components/NotFound";
import { Home } from "./components/Home";
import { Login, Register, ExtendSub } from "./components/LoginRegisterExtend";
import { MainApp } from "./components/MainApp";
import PrivateRoute from "./components/Auth/PrivateRoute";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<><Home /> </>} />
        <Route path="/main" element={<><PrivateRoute> <MainApp /> </PrivateRoute> </>} />
        <Route path="/login" element={<> <Login /> </>} />
        <Route path="/register" element={<> <Register /> </>} />
        <Route path="/extend" element={<> <ExtendSub /> </>} />
        <Route path="*" element={<> <NotFound /> </>} />
      </Routes>
    </>
  );
}

export default App;
