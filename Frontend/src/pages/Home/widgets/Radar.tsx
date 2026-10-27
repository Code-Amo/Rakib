import React from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import "./Radar.css";

interface StatsRadarWidgetProps {
    stats: {
        sport: number;
        intel: number;
        crea: number;
        career: number;
        mental: number;
    };
}

const LABELS_MAP: Record<keyof StatsRadarWidgetProps["stats"], string> = {
    sport: "Physique",
    intel: "Intellect",
    crea: "Créativité",
    career: "Carrière",
    mental: "Mental",
};

export const StatsRadarWidget: React.FC<StatsRadarWidgetProps> = ({ stats }) => {
    const chartData = (Object.keys(stats) as Array<keyof typeof stats>).map(key => ({
        subject: LABELS_MAP[key],
        value: stats[key],
    }));

    return (
        <div className="stats-radar-widget">
            <div className="stats-radar-header">
                <div className="stats-radar-title-wrapper">
                    <svg className="stats-radar-icon" viewBox="0 0 24 24" width="20" height="20" fill="#9501d9">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <h3 className="stats-radar-title">Équilibre</h3>
                </div>
                <p className="stats-radar-subtitle">Ta progression globale</p>
            </div>

            <div className="stats-radar-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#A0AEC0", fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Stats"
                            dataKey="value"
                            stroke="#9F7AEA"
                            fill="#9F7AEA"
                            fillOpacity={0.4}
                            strokeWidth={2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StatsRadarWidget;
