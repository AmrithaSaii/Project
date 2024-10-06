import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div id="contact">
      <div className="contact-container">
        <header className="contact-header">
          <h1>Contact Us</h1>
          <p>
            If you have any questions, feel free to reach out to us through any
            of the channels below.
          </p>
        </header>
        <div className="card-group">
          <div className="card">
            <img
              src="/images/location.png"
              className="mycard"
              alt="..."
            />
            <div className="card-body">
              <h5 className="card-title">Our Location</h5>
              <p className="card-text"> Kerala <br/> Karnataka<br/> Mumbai<br/></p>
            </div>
          </div>
          <div className="card">
            <img src="/images/gmail.png" className="mycard" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Email Address</h5>
              <p className="card-text">
              unicreditbank@gmail.com
              </p>
            </div>
          </div>
          <div className="card">
            <img src="/images/phone.png" className="mycard" />
            <div className="card-body">
              <h5 className="card-title">Phone</h5>
              <p className="card-text">
                901111111109<br/> Tel No:0471-23410
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
