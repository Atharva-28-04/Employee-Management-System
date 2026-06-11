import nodemailer from 'nodemailer';
import logger from './logger.js';

export const sendWelcomeEmail = async (userEmail, userName, defaultPassword) => {
    console.log(`\n✉️ --- SENDING EMAIL TO: ${userEmail} ---`); 
    
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            console.log("⚠️ EMAIL CREDENTIALS NOT CONFIGURED. SKIPPING SMTP SEND.");
            console.log(`📧 Welcome Email details: Name: ${userName}, Username: ${userEmail}, Temp Password: ${defaultPassword}\n`);
            return true;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_APP_PASSWORD 
            }
        });

        const mailOptions = {
            from: `"Employee Management System" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Welcome to the Team!',
            html: `<p>Welcome ${userName}! Your password is: ${defaultPassword}</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ WELCOME EMAIL SENT SUCCESSFULLY!\n");
        return true;
    } catch (error) {
        console.log(`❌ EMAIL FUNCTION CRASHED: ${error.message}\n`);
        return false;
    }
};