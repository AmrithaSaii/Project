import React from "react";
import Services from "./Services";
import About from "./About";
import Contact from "./Contact";
import HomePage from "./FirstPage";
import Navbar from "./NavBar";
import Footer from "./Footer";





export default function home() {
  return (
    <div>
      <Navbar />

      <HomePage />

      <Services />
      <About />
      <Contact />
     <Footer />
    
    </div>
  );
}
