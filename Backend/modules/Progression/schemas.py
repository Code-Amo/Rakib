from pydantic import BaseModel

class StatsBreakdown(BaseModel):
    sport: int
    intel: int
    crea: int
    career: int
    mental: int

class GlobalStatsResponse(BaseModel):
    level: int
    current_xp_in_level: int
    xp_for_next_level: int
    current_streak: int
    breakdown: StatsBreakdown