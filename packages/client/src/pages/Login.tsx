const Login = () => {
  console.log("asdf", import.meta.env.VITE_SERVER_URI);
  return (
    <div>
      <a
        href={`${import.meta.env.VITE_SERVER_URI}/auth/google`}
        className="google"
      >
        google login
      </a>
    </div>
  );
};

export default Login;
