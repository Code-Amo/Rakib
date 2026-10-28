from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from core.database import Base

class Companionship(Base):
    __tablename__ = "companionships"

    id = Column(Integer, primary_key=True, index=True)
    user1_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False) 
    user2_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    category = Column(String, nullable=False)
    target_checkins = Column(Integer, nullable=False, default=5)
    status = Column(String, default="pending") 
    start_date = Column(Date, nullable=True)

    user1 = relationship("User", foreign_keys=[user1_id], passive_deletes=True)
    user2 = relationship("User", foreign_keys=[user2_id], passive_deletes=True)