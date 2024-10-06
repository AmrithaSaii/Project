import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <div id="services"className='services-container'>
      <h1>Our Services</h1>
      <img src="/images/loan.jpg" style={{ width: '400px', height: 'auto', float:'left', margin: '50px 20px 20px 20px' }}></img>
      <h2> 
        Loan
      </h2>
      <p>
      At UniCredit Bank, we understand that financial needs vary from person to person. That's why we offer a range of 
      loan products tailored to suit your individual requirements. Whether you're planning to buy a new home, start a business, or pursue higher education, we have the right loan solution for you.
      </p>
      <img src="/images/checks.jpg" style={{ width: '400px', height: 'auto', float:'right', margin: '180px 20px 20px 20px' }}></img>
      
      <h3>Online Cheque Transaction</h3>
      <p>
      At UniCredit Bank, we understand the importance of providing you with convenient and secure banking services, even when it comes to cheque transactions. With our online banking platform, 
      you can manage your cheque transactions from the comfort of your home or office, anytime and anywhere.
      </p>
      <img src="/images/transaction.jpg" style={{ width: '400px', height: 'auto', float:'left', margin: '140px 60px 20px 20px' }}></img>
      <h4>Effective Transaction</h4>
      <p>
      At UniCredit Bank, we pride ourselves on facilitating effective and efficient transactions for all our customers.
       We understand that in today’s fast-paced world, seamless and quick financial transactions are essential.
      
      </p>
      

    </div>
  );
};

export default Services;
