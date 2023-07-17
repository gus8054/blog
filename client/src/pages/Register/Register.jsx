// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { MdOutlineArrowBack } from "react-icons/md";
import { useState } from "react";
import { register } from "../../api/users";

const Register = () => {
  // input controlled state
  const [inputs, setInputs] = useState({ email: "", username: "", password: "" });
  const changeHandler = (e) => {
    setInputs({ ...inputs, [e.currentTarget.name]: e.currentTarget.value });
  };
  // error
  const [error, setError] = useState();
  // navigate
  const navigate = useNavigate();
  // submit handler
  const submitHandler = async (event) => {
    event.preventDefault();
    // 데이터 검증
    for (const key in inputs) {
      if (!inputs[key].trim()) return setError("빈 칸을 입력하세요.");
    }
    try {
      await register(inputs.username, inputs.email, inputs.password);
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
    <div className="register">
      <h1 className="register__title">회원 가입</h1>
      <form className="register__form" method="post" onSubmit={submitHandler}>
        <input value={inputs.email} onChange={changeHandler} className="register__input" type="email" name="email" id="email" placeholder="email" required />
        <input value={inputs.username} onChange={changeHandler} className="register__input" type="text" name="username" id="username" placeholder="username" required />
        <input value={inputs.password} onChange={changeHandler} className="register__input" type="password" name="password" id="password" placeholder="password" required />
        <button className="register__submit">등록</button>
        <p className="register__error">{error}</p>
        <Link className="register__go-login" to="/login">
          <MdOutlineArrowBack />
          로그인
        </Link>
      </form>
    </div>
  );
};

export default Register;
