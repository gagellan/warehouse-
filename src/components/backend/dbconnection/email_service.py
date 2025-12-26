from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import ssl
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
def send_otp_email(to_email, otp):
    subject = "Your OTP for Password Reset"
    body = f"""
    <html>
        <body>
            <p>Hello,</p>
            <p>Your OTP to reset the password is: <strong>{otp}</strong></p>
            <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
        </body>
    </html>
    """

    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, context=context) as server:
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())

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