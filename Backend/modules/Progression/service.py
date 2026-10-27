from modules.Panel.models import UserStats

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