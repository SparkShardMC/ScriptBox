import random
import smtplib
import secrets
from datetime import datetime, timedelta, date
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from email.mime.text import MIMEText
from .models import (
    create_user, 
    save_verification_code, 
    get_verification_record, 
    set_verified, 
    delete_verification_record, 
    create_session,
    calculate_age
)

router = APIRouter()

SENDER_EMAIL = "modbox.noreply@gmail.com"
SMTP_PASS = "riojcpatctwlmtxc"
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 465

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str
    dob: str

class VerifyRequest(BaseModel):
    email: str
    code: str

@router.post("/send-code")
async def send_code(data: SignupRequest):
    try:
        birth_date = date.fromisoformat(data.dob)
        age = calculate_age(birth_date)
        is_minor = age < 13
    except:
        is_minor = False

    create_user(data.username, data.email, data.password, data.dob, is_minor, None)
    
    code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    save_verification_code(data.email, code, expires_at)
    
    msg = MIMEText(f"Your ScriptBox verification code is: {code}")
    msg['Subject'] = "ScriptBox Verification"
    msg['From'] = SENDER_EMAIL
    msg['To'] = data.email

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(SENDER_EMAIL, SMTP_PASS)
            server.send_message(msg)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-code")
async def verify_code(data: VerifyRequest):
    record = get_verification_record(data.email)
    if record and record["code"] == data.code:
        set_verified(data.email)
        delete_verification_record(data.email)
        token = secrets.token_hex(32)
        create_session(data.email, token)
        return {"status": "success", "token": token}
    raise HTTPException(status_code=400, detail="Invalid code")
