import { googleLogin } from "../api/auth";

const Login = () => {
  console.log("asdf", import.meta.env.VITE_SERVER_URI);

  const handleLogin = async () => {
    const data = await googleLogin();
    console.log("data", data);
  };
  return (
    <div>
      <a
        href={`${import.meta.env.VITE_SERVER_URI}/auth/google`}
        className="google"
      >
        google login
      </a>
      <button onClick={handleLogin}>asdf</button>
    </div>
  );
};

export default Login;
