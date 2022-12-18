import { useSearchParams, useNavigate } from "react-router-dom";
import { useGetUserInfo } from "../hooks/api/user";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const accessToken = searchParams.get("accessToken");
  localStorage.setItem("access-token", accessToken ?? "");

  const { data, status } = useGetUserInfo();
  console.log(data);

  if (status === "success") {
    if (data.user.nickname) navigate("/");
    navigate("/sign-up");
  }

  return <div>login success</div>;
};

export default LoginSuccess;
