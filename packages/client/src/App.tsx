import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chatroom from "./pages/Chatroom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import SignUp from "./pages/SignUp";

const App = () => {
  const accessToken = localStorage.getItem("access-token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={accessToken ? <Home /> : <Navigate replace to="/login" />}
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/login/success" element={<LoginSuccess />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/chatroom/:id" element={<Chatroom />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
