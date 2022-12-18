import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "../api";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  localStorage.setItem("access-token", accessToken ?? "");
  axiosInstance.defaults.headers.common["Authorization"] = accessToken;

  return <div>asdf</div>;
};

export default LoginSuccess;
