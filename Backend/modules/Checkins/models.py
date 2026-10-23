from sqlalchemy import Column, Integer, ForeignKey, DateTime, Date, UniqueConstraint
from datetime import datetime, timezone
from core.database import Base

class Checkin(Base):
    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    objective_id = Column(Integer, ForeignKey("objectives.id", ondelete="CASCADE"), nullable=False)
    
    date = Column(Date, default=lambda: datetime.now(timezone.utc).date(), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    xp_earned = Column(Integer, default=10)

    __table_args__ = (
        UniqueConstraint('user_id', 'objective_id', 'date', name='uq_user_objective_date'),
    )