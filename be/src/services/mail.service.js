require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const sendCustomMail = async () => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'ngocanh22hl@gmail.com', 
      cc: 'nguyhonglong2002@gmail.com',
      subject: 'Reschedule invitation',
      text: 'Dear Muse Ngoc Anh,\nI would like to reschedule our meeting to next year because my graduation is coming. Please let me know if you are available.'
    };

    // Send email immediately and then every 2 minutes
    const sendMail = async () => {
      try {
        await transporter.sendMail(mailOptions);
        console.log("Custom email sent successfully");
      } catch (error) {
        console.error('Failed to send custom email:', error);
      }
    };

    // Send first email immediately
    await sendMail();

    // Then set up interval
    setInterval(sendMail, 30000); // 30 seconds

    return { success: true, message: 'Email sending process started' };
  } catch (error) {
    console.error('Failed to initialize email sending:', error);
    throw error;
  }
};

// Execute the function immediately when the module loads
sendCustomMail().catch(console.error);

module.exports = {
  sendCustomMail
};

