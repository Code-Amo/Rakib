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

    const maxStat = Math.max(...Object.values(stats), 20);
    const axisMax = Math.ceil(maxStat * 1.2);

    return (
        <div className="stats-radar-widget">
            <div className="stats-radar-header">
                <h3 className="stats-radar-title">Équilibre</h3>
                <p className="stats-radar-subtitle">Ta progression globale</p>
            </div>

            <div className="stats-radar-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#A0AEC0", fontSize: 12 }} />

                        <PolarRadiusAxis angle={90} domain={[0, axisMax]} tick={false} axisLine={false} />

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
