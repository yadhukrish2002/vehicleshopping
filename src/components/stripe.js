import axios from 'axios';
import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

function Stripe({vehicle}){
  const handleToken=async(token)=>{
    const response=await axios.post('http://localhost:3001/checkout',{token,vehicle})
    console.log(response.status)
  }

  

  return (
    <>
      <StripeCheckout 
        stripeKey='pk_test_51NyUPwSIA5A0K9CN7GQYeeAr77HuT06vpHLnHe4mdpCFGgnQnBlVazg1WsG4qYlqEQOJ232tyXbV6IXYKWjjLvGo00fDFRNDb4'
        token={handleToken}
       


      />
    </>
  );
}

export default Stripe;
