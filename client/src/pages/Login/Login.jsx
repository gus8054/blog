// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { MdOutlineArrowBack } from "react-icons/md";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";

const Login = () => {
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const changeHandler = (e) => {
    setInputs({ ...inputs, [e.currentTarget.name]: e.currentTarget.value });
  };
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState();

  const submitHandler = async (event) => {
    event.preventDefault();
    // 데이터 검증
    for (const key in inputs) {
      if (!inputs[key].trim()) return setError("빈 칸을 입력하세요.");
    }
    // request register
    try {
      await login(inputs.username, inputs.password);
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="login">
      <h1 className="login__title">Login</h1>
      <form className="login__form" method="post" onSubmit={submitHandler}>
        <input value={inputs.username} onChange={changeHandler} className="login__input" type="text" name="username" id="username" placeholder="username" required />
        <input value={inputs.password} onChange={changeHandler} className="login__input" type="password" name="password" id="password" placeholder="password" required />
        <button className="login__submit">Login</button>
        <p className="login__error">{error}</p>
        <Link className="login__go-register" to="/join">
          <MdOutlineArrowBack />
          Register
        </Link>
      </form>
    </div>
  );
};

export default Login;
