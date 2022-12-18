import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getNickname } from "./api/user";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";

const App = () => {
  const accessToken = localStorage.getItem("access-token");

  const a = async () => {
    const data = await getNickname();
    console.log(data);
  };

  useEffect(() => {
    a();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={accessToken ? <Home /> : <Navigate replace to="/login" />}
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/login/success" element={<LoginSuccess />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
