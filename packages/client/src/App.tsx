import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useRecoilValue } from "recoil";
import { accessTokenAtom } from "./atoms/accessToken";

const App = () => {
  const accessToken = useRecoilValue(accessTokenAtom);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={accessToken ? <Home /> : <Navigate replace to="/login" />}
        ></Route>
        <Route path="/login" element={<Login />}></Route>

        {/* <Route path="*" element={<NotFound />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
