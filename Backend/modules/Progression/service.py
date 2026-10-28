from modules.Panel.models import UserStats
from sqlalchemy import func
from datetime import date, timedelta
from modules.Checkins.models import Checkin

def calculate_global_stats(stats: UserStats):
    if not stats:
        return {
            "level": 1,
            "current_xp_in_level": 0,
            "xp_for_next_level": 100,
            "current_streak": 0
        }

    total_xp = (stats.xp_sport or 0) + (stats.xp_intel or 0) + (stats.xp_crea or 0) + (stats.xp_career or 0) + (stats.xp_mental or 0)
    average_xp = total_xp / 5.0

    level = 1
    xp_accumulated_for_current_level = 0
    xp_needed_for_next_level = 100

    while average_xp >= (xp_accumulated_for_current_level + xp_needed_for_next_level):
        xp_accumulated_for_current_level += xp_needed_for_next_level
        level += 1
        xp_needed_for_next_level = 100 + ((level - 1) * 50)

    current_xp_in_level = int(average_xp - xp_accumulated_for_current_level)

    return {
        "level": level,
        "current_xp_in_level": current_xp_in_level,
        "xp_for_next_level": xp_needed_for_next_level,
        "current_streak": stats.current_streak or 0
    }

def get_weekly_xp_chart(db, user_id: int):
    today = date.today()
    seven_days_ago = today - timedelta(days=6)

    results = db.query(
        Checkin.date, 
        func.sum(Checkin.xp_earned).label('total_xp')
    ).filter(
        Checkin.user_id == user_id,
        Checkin.date >= seven_days_ago
    ).group_by(Checkin.date).all()

    xp_by_date = {row.date: row.total_xp for row in results}

    chart_data = []
    
    for i in range(7):
        current_date = seven_days_ago + timedelta(days=i)
        xp = xp_by_date.get(current_date, 0)
        
        jours_fr = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
        day_name = jours_fr[current_date.weekday()]
        
        chart_data.append({
            "day": day_name,
            "date": current_date.isoformat(),
            "xp": xp
        })

    return chart_data