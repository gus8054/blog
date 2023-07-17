import React, { useContext } from "react";
import "./userDelete.css";
import { useState } from "react";
import { checkUser, withdraw } from "../../api/users";
import { AuthContext } from "../../context/AuthProvider";

const UserDelete = () => {
  // input controlled state
  const { user, getMyAxiosInstance, logout } = useContext(AuthContext);
  const [inputs, setInputs] = useState({ username: user.username, password: "" });
  const changeHandler = (e) => {
    setInputs({ ...inputs, [e.currentTarget.name]: e.currentTarget.value });
  };
  // error
  const [error, setError] = useState();
  // submit handler
  const submitHandler = async (event) => {
    event.preventDefault();
    // 데이터 검증
    for (const key in inputs) {
      if (!inputs[key].trim()) return setError("빈 칸을 입력하세요.");
    }
    try {
      await checkUser(inputs.username, inputs.password, getMyAxiosInstance());
      await withdraw(inputs.username, getMyAxiosInstance());
      await logout(false);
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
    <div className="user-delete">
      <h1 className="user-delete__title">회원 탈퇴</h1>
      <form className="user-delete__form" method="post" onSubmit={submitHandler}>
        <input disabled={true} value={inputs.username} className="user-delete__input" type="text" name="username" id="username" placeholder="username" required />
        <input value={inputs.password} onChange={changeHandler} className="user-delete__input" type="password" name="password" id="password" placeholder="password" required />
        <button className="user-delete__btn user-delete__withdraw">탈퇴</button>
        <p className="user-delete__error">{error}</p>
      </form>
    </div>
  );
};

export default UserDelete;
