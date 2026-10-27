import { AlertCircle, Award, Brain, Briefcase, Dumbbell, Flame, Loader2, Palette, Wind } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "./stats.css";

interface ProgressionData {
    level: number;
    current_xp_in_level: number;
    xp_for_next_level: number;
    current_streak: number;
    breakdown: {
        sport: number;
        intel: number;
        crea: number;
        career: number;
        mental: number;
    };
}

interface StatConfigItem {
    key: keyof ProgressionData["breakdown"];
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string; size?: number; color?: string }>;
}

const STAT_CONFIG: StatConfigItem[] = [
    { key: "sport", label: "Physique", color: "#E53E3E", icon: Dumbbell },
    { key: "intel", label: "Intellect", color: "#3182CE", icon: Brain },
    { key: "crea", label: "Créativité", color: "#805AD5", icon: Palette },
    { key: "career", label: "Career", color: "#D69E2E", icon: Briefcase },
    { key: "mental", label: "Mental", color: "#319795", icon: Wind },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="custom-tooltip">
                <p className="tooltip-label">{label}</p>
                <p className="tooltip-value" style={{ color: data.payload.color }}>
                    {data.value} XP
                </p>
            </div>
        );
    }
    return null;
};

export const Stats: React.FC = () => {
    const [data, setData] = useState<ProgressionData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgression = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch("http://localhost:8000/progression/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const result: ProgressionData = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur est survenue");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgression();
    }, []);

    if (isLoading) {
        return (
            <div className="progression-state-container">
                <Loader2 className="spinner-icon" size={40} />
                <p>Chargement de votre progression...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="progression-state-container error">
                <AlertCircle size={40} />
                <p>{error || "Impossible de charger les données."}</p>
            </div>
        );
    }

    const globalProgressPercentage = Math.min(
        100,
        Math.round((data.current_xp_in_level / data.xp_for_next_level) * 100),
    );

    const chartData = STAT_CONFIG.map(stat => ({
        name: stat.label,
        xp: data.breakdown[stat.key],
        color: stat.color,
    }));

    const maxStatXp = Math.max(...Object.values(data.breakdown), 100);

    return (
        <div className="progression-container">
            <header className="level-card">
                <div className="level-header">
                    <div className="level-title-group">
                        <Award className="level-icon" size={32} />
                        <div>
                            <span className="level-subtitle">NIVEAU ACTUEL</span>
                            <h1 className="level-number">Niveau {data.level}</h1>
                        </div>
                    </div>
                    <div className="streak-badge">
                        <Flame size={20} color="#FF6B6B" />
                        <span>{data.current_streak} Jours de série</span>
                    </div>
                </div>

                <div className="global-xp-section">
                    <div className="xp-labels">
                        <span>Expérience globale</span>
                        <span>
                            {data.current_xp_in_level} / {data.xp_for_next_level} XP ({globalProgressPercentage}%)
                        </span>
                    </div>
                    <div className="global-progress-bar">
                        <div className="global-progress-fill" style={{ width: `${globalProgressPercentage}%` }} />
                    </div>
                </div>
            </header>

            <section className="chart-card">
                <h2 className="section-title">Aperçu des Statistiques</h2>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={360}>
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="name"
                                stroke="#A0AEC0"
                                tickLine={false}
                                axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                            />
                            <YAxis
                                stroke="#A0AEC0"
                                tickLine={false}
                                axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.04)" }} />
                            <Bar dataKey="xp" radius={[8, 8, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className="stats-grid">
                {STAT_CONFIG.map(stat => {
                    const Icon = stat.icon;
                    const currentXp = data.breakdown[stat.key];
                    const percent = Math.min(100, Math.round((currentXp / maxStatXp) * 100));

                    return (
                        <div className="stat-card" key={stat.key}>
                            <div className="stat-card-header">
                                <div className="stat-info">
                                    <div
                                        className="stat-icon-wrapper"
                                        style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                                    >
                                        <Icon size={20} color={stat.color} />
                                    </div>
                                    <span className="stat-name">{stat.label}</span>
                                </div>
                                <span className="stat-xp-value">{currentXp} XP</span>
                            </div>

                            <div className="stat-progress-bar">
                                <div
                                    className="stat-progress-fill"
                                    style={{
                                        width: `${percent}%`,
                                        backgroundColor: stat.color,
                                        boxShadow: `0 0 10px ${stat.color}80`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
};

export default Stats;
