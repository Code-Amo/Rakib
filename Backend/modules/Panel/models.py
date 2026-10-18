from pydantic import BaseModel
from typing import List

class UserData(BaseModel):
    username: str
    name: str
    avatar_url: str | None = None
    is_online: bool

class LevelData(BaseModel):
    current_level: int
    title: str
    current_xp: int
    max_xp: int

class TrophiesSummary(BaseModel):
    unlocked_count: int
    total_count: int
    percentage: int

class NextAchievement(BaseModel):
    title: str
    remaining_count: int
    current_count: int
    target_count: int

class Task(BaseModel):
    id: str
    title: str
    completed: bool

class DashboardData(BaseModel):
    user: UserData
    level: LevelData
    trophies_summary: TrophiesSummary
    next_achievement: NextAchievement
    today_focus: List[Task]