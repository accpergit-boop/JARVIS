from fastapi import HTTPException, Request, Depends
from datetime import datetime, timezone
import os
from motor.motor_asyncio import AsyncIOMotorDatabase

async def get_current_user(request: Request, db: AsyncIOMotorDatabase):
    """Extract user from session_token in cookie or Authorization header."""
    session_token = None
    
    # Try cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_doc

async def get_current_user_optional(request: Request, db: AsyncIOMotorDatabase):
    """Get current user if authenticated, otherwise return None."""
    try:
        return await get_current_user(request, db)
    except HTTPException:
        return None

async def require_admin(request: Request, db: AsyncIOMotorDatabase):
    """Check if user is admin."""
    user = await get_current_user(request, db)
    
    admin_doc = await db.admin_users.find_one(
        {"email": user["email"]},
        {"_id": 0}
    )
    
    if not admin_doc:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return user