import { useNavigate } from "react-router-dom";
import { putUserInfo } from "../api/user";
import useInput from "../hooks/useInput";

const SignUp = () => {
  const navigate = useNavigate();

  const { value: nicknameValue, onChange: onChangeNicknameValue } =
    useInput("");

  const handleChangeNickname = async () => {
    const data = await putUserInfo(nicknameValue);
    console.log("data", data);

    if (data.user.nickname) {
      navigate("/");
    }
  };

  return (
    <div>
      <input value={nicknameValue} onChange={onChangeNicknameValue} />
      <button onClick={handleChangeNickname}>닉네임 변경</button>
    </div>
  );
};

export default SignUp;
