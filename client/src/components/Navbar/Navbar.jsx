import "./navbar.css";
import logo from "../../img/logo.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      {user?.username && (
        <div className="navbar__user">
          <p className="navbar__user__username">{user.username}</p>
          <Link to="/withdraw" className="navbar__user__withdraw">
            탈퇴
          </Link>
        </div>
      )}
      <Link to="/">
        <div className="navbar__logo">
          <img src={logo} alt={logo} />
          <h1 className="navbar__title">블로그</h1>
        </div>
      </Link>
      <div className="navbar__auths">
        {user?.username ? (
          <>
            <button className="navbar__auth navbar__auth_logout" onClick={() => logout()}>
              logout
            </button>
            <Link className="navbar__auth navbar__auth_write" to="/write">
              write
            </Link>
          </>
        ) : (
          <>
            <Link className="navbar__auth navbar__auth_join" to="/join">
              join
            </Link>
            <Link className="navbar__auth navbar__auth_login" to="/login">
              login
            </Link>
          </>
        )}
      </div>
      <div className="navbar__links">
        <Link className="navbar__link" to="/?category=art">
          art
        </Link>
        <Link className="navbar__link" to="/?category=science">
          science
        </Link>
        <Link className="navbar__link" to="/?category=technology">
          technology
        </Link>
        <Link className="navbar__link" to="/?category=food">
          food
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
