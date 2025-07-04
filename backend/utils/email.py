import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

load_dotenv()

def envoyer_email(to_email: str, subject: str, content_text: str, content_html: str = None):
    EMAIL_SENDER = os.getenv("EMAIL_SENDER")
    APP_PASSWORD = os.getenv("EMAIL_PASSWORD")

    if not EMAIL_SENDER or not APP_PASSWORD:
        raise ValueError("EMAIL_SENDER et EMAIL_PASSWORD doivent être définis dans .env")

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_SENDER
    msg["To"] = to_email
    msg.set_content(content_text)

    if content_html:
        msg.add_alternative(content_html, subtype="html")

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_SENDER, APP_PASSWORD)
        smtp.send_message(msg)

