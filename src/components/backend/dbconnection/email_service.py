from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import smtplib
from email.utils import formataddr
from flask_mail import Message
from flask import jsonify
import uuid
from database_service import mail
from database_service import SMTP_SERVER, SMTP_PORT, SENDER_EMAIL, SENDER_PASSWORD, EMAIL_SUBJECT, EMAIL_BODY_TEMPLATE

# Send Activation Email

def send_activation_email(to_email, token):
    try:
        activation_link = f"http://127.0.0.1:5000/activate/{token}"
        
        msg = MIMEMultipart()
        msg["From"] = SENDER_EMAIL
        msg["To"] = to_email
        msg["Subject"] = EMAIL_SUBJECT

        email_body = EMAIL_BODY_TEMPLATE.replace("{activation_link}", activation_link)
        msg.attach(MIMEText(email_body, "html"))

        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()

        print(f"Activation email sent to {to_email}")
    except Exception as e:
        print(f"Email Error: {str(e)}")
# Send OTP Email
def send_otp_email(email, otp):
    try:
            msg = Message(subject="Password Reset OTP",sender=formataddr(("Bikanelite-WM", SENDER_EMAIL)),recipients=[email])

            msg.body = f"""
            Your OTP for password reset is: {otp}
            This OTP will expire in 10 minutes.
            If you did not request this, please ignore this email."""

            msg.html = f"""<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>One-Time Password</title>
          <style>
            body {{
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              font-family: Arial, Helvetica, sans-serif;
              color: #000000;
            }}
            .email-container {{
              max-width: 600px;
              margin: 0 auto;
              padding: 24px 16px 32px;
              text-align: center;
            }}
            .otp-illustration {{
              width: 100%;
              max-width: 360px;
              margin: 0 auto 24px;
              display: block;
            }}
            .title {{
              font-size: 26px;
              font-weight: 700;
              margin-bottom: 20px;
            }}
            .otp-box {{
              display: inline-block;
              border: 2px solid #000;
              padding: 14px 28px;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 2px;
              margin-bottom: 24px;
            }}
            .message {{
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 8px;
            }}
            .warning {{
              margin-top: 24px;
              font-size: 18px;
              font-weight: 700;
            }}
            .footer {{
              margin-top: 28px;
              padding-top: 16px;
              border-top: 1px solid #e5e5e5;
              font-size: 14px;
            }}
          </style>
        </head>
        <body>
          <div class="email-container">
            <img src="http://localhost:3000/static/images/otpimg.png" alt="OTP Verification" class="otp-illustration" />
            <!--Change the source path after domain assignment-->

            <div class="title">Your one-time code is</div>

            <div class="otp-box">{otp}</div>

            <div class="message">
              Please verify your identity by entering the 6-digit code above.
            </div>

            <div class="message">
              For your security, this code will expire in <strong>10 minutes</strong>.
            </div>

            <div class="warning">
              If you didn’t request this, please ignore this email.
            </div>

            <div class="footer">
              Do not reply to this email.<br />
              Contact us at
              <a href="mailto:sales@gagellan.com">
                sales@gagellan.com
              </a>
            </div>

          </div>
        </body>
        </html>
        """
            msg.extra_headers = {
            "X-Mailer": "Bikanelite-WM Flask-Mail",
            "Message-ID": f"<{uuid.uuid4()}@gagellan.com>",
            "Reply-To": SENDER_EMAIL
         }

            mail.send(msg)
            return jsonify({"message": "OTP sent via Email & SMS","channels": ["email", "sms"]}), 200
    except Exception as e:
        print("Flask-Mail error:", repr(e))
        return jsonify({"error": "Unable to send email at the moment"}), 500

# send password reset email
def send_email(to_email, reset_link):#send password reset email
    try:
        sender_email = SENDER_EMAIL  # Replace with your email
        sender_password = SENDER_PASSWORD  # Replace with your password
        subject = "Password Reset Request"

        message = MIMEMultipart()   
        message["From"] = SENDER_EMAIL
        message["To"] = to_email
        message["Subject"] = subject
        body = f"Click the link below to reset your password:\n\n{reset_link}"
        message.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        #server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, message.as_string())
        server.quit()

        print("Password reset email sent.")

    except Exception as e:
        print(f"Error sending email: {e}")