from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from core.database import Base

class Companionship(Base):
    __tablename__ = "companionships"

    id = Column(Integer, primary_key=True, index=True)
    user1_id = Column(Integer, ForeignKey("users.id"), nullable=False) # sender
    user2_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False)
    target_checkins = Column(Integer, nullable=False, default=5)
    status = Column(String, default="pending") 
    start_date = Column(Date, nullable=True)

    user1 = relationship("User", foreign_keys=[user1_id])
    user2 = relationship("User", foreign_keys=[user2_id])