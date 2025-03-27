import "../styles/components/Footer.css";
import logo from "../assets/img/logo.png";
import { FaEnvelope, FaWhatsapp, FaPhone } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="logo-wrapper">
          <img src={logo} alt="Circus Coach" className="footer-logo" />
          <div className="floating-icons">
            <div className="circle-icon">
              <FaEnvelope />
            </div>
            <div className="circle-icon">
              <FaPhone />
            </div>
          </div>
        </div>
      </div>

      <div className="footer-right">
        <h3>¿HABLAMOS?</h3>
        <div className="footer-contact">
          <FaEnvelope />
          <span>circuscoachbyrociogarrote@gmail.com</span>
        </div>
        <div className="footer-contact">
          <FaWhatsapp />
          <span>+32455113039</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
