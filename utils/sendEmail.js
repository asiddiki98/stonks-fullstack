import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL, // Your Gmail address
    pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD, // Your Gmail password or App-specific password
  },
});

export async function sendEmail(to, subject, htmlContent) {
  const mailOptions = {
    from: process.env.GMAIL_USER, // Your Gmail address
    to: to,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", { info });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
