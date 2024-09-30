import React from "react";
import "./About.css"; // Import your CSS for styling

const About = ({ opened, setOpened }) => {
  if (!opened) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={() => setOpened(false)}>
          &times;
        </button>
        <h2>About Us</h2>
        <p>
          Higurupathwaldeniya Estates is dedicated to producing the highest quality tea with a focus on sustainability and community well-being. Our estate combines traditional tea-making techniques with modern innovations to provide you with exceptional tea experiences.
        </p>
      </div>
    </div>
  );
};

export default About;
