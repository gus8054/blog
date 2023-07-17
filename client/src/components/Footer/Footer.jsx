import "./footer.css";
import logo from "../../img/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__logo">
        <img src={logo} alt={logo} />
      </div>
      <p className="footer__copyright">&copy; gus8054 2023.07.06 </p>
    </footer>
  );
};

export default Footer;
