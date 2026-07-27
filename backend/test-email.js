require('dotenv').config();

const {
  sendEmail,
} = require(
  './src/services/emailService'
);

sendEmail(
  'jnicius@gmail.com',
  'Enfiance Test',
  '<h1>Email Service Working</h1>'
)
.then(() => {
  console.log('DONE');
})
.catch(console.error);
