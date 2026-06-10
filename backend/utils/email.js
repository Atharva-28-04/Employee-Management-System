import nodemailer from 'nodemailer';
import logger from './logger.js';

export const sendWelcomeEmail = async (userEmail, userName, defaultPassword) => {
    // 🚨 1. This proves the function actually started
    console.log(`\n🚨 --- EMAIL FUNCTION TRIGGERED FOR: ${userEmail} --- 🚨`); 
    
    try {
        const testAccount = await nodemailer.createTestAccount();
        console.log("✅ Ethereal Test Account Generated!");

      // Connect to REAL Gmail using safe Environment Variables!
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_APP_PASSWORD 
            }
        });

        const mailOptions = {
            from: `"Employee Management System" <admin@yourcompany.com>`,
            to: userEmail,
            subject: 'Welcome to the Team!',
            html: `<p>Welcome ${userName}! Your password is: ${defaultPassword}</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        
        // 🚨 2. This is the raw bypass for the link
        console.log("✅ EMAIL SENT SUCCESSFULLY!");
        console.log(`✉️ CLICK HERE TO VIEW EMAIL: ${nodemailer.getTestMessageUrl(info)}\n`);

        return true;
    } catch (error) {
        // 🚨 3. This will tell us if your firewall or network is blocking the port
        console.log(`❌ EMAIL FUNCTION CRASHED: ${error.message}\n`);
        return false;
    }
};