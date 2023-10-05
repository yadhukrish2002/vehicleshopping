// Twilio credentials 
const twilio = require('twilio');

const twilioAccountSid = 'AC5b19ae981bc7cd944f04f7492275008c';
const twilioAuthToken = 'b58f0c6749fabda66c8ea9b8b7963189';
const twilioPhoneNumber = '+12564484928';

const client = twilio(twilioAccountSid, twilioAuthToken);

function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }

// Send verification code via SMS using Twilio
function sendVerificationCode(phoneNumber, code) {
  client.messages
    .create({
      body: `Your verification code is: ${code}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    })
    .then((message) => {
      console.log('Verification code sent');
    })
    .catch((error) => {
      console.error('Error sending verification code via Twilio:', error);
    });
}

module.exports = {
    generateVerificationCode,
    sendVerificationCode,
};