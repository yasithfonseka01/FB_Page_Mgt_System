import React, { useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import About from "../AboutUs/About"; // Ensure correct import path
import useAuthCheck from "../../hooks/useAuthCheck.jsx";
import Login from "../Login/Login"; // Import the LoginModal

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [loginModalOpened, setLoginModalOpened] = useState(false); // State for the login modal
  const headerColor = useHeaderColor();
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const { validateLogin } = useAuthCheck();

  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      setModalOpened(true);
    }
  };

  const handleLoginButtonClick = () => {
    setLoginModalOpened(true);
  };

  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* Logo */}
        <Link to="/">
          <img src="./logoc.jpg" alt="logo" width={100} />
        </Link>
        <div className="flexCenter h-menu" style={getMenuStyles(menuOpened)}>
          <a href="mailto:higurupathwaldeniyaestates@gmail.com">Contact</a>
          <a href="/about">About Us</a>
          <button onClick={handleLoginButtonClick}>Login</button>
        </div>
      </div>

      {/* Menu Icon for small screens */}
      <div className="menu-icon" onClick={() => setMenuOpened((prev) => !prev)}>
        <BiMenuAltRight size={30} />
      </div>

      {/* Login Modal */}
      <Login isOpen={loginModalOpened} onClose={() => setLoginModalOpened(false)} />
    </section>
  );
};

export default Header;
