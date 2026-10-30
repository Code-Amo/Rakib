import { fetchWithAuth } from "@/function/api";
import {
    AlertCircle,
    Award,
    BarChart3,
    Brain,
    Briefcase,
    Dumbbell,
    Flame,
    Loader2,
    Palette,
    TrendingUp,
    Wind,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

interface WeeklyData {
    day: string;
    xp: number;
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
        return (
            <div
                className="custom-tooltip"
                style={{
                    backgroundColor: "#141414",
                    border: "1px solid #7b2fbe",
                    padding: "10px",
                    borderRadius: "8px",
                }}
            >
                <p className="tooltip-label" style={{ color: "#fff", margin: 0, fontWeight: "bold" }}>
                    {label}
                </p>
                <div className="tooltip-items">
                    {payload.map((entry: any, index: number) => (
                        <p key={`tooltip-item-${index}`} style={{ color: entry.color || entry.stroke, margin: 0 }}>
                            {entry.name ? `${entry.name} : ` : ""}
                            {entry.value} XP
                        </p>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export const Stats: React.FC = () => {
    const [data, setData] = useState<ProgressionData | null>(null);
    const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [chartType, setChartType] = useState<"bar" | "line">("bar");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [resProgression, resWeekly] = await Promise.all([
                    fetchWithAuth("/progression"),
                    fetchWithAuth("/progression/weekly-chart"),
                ]);

                if (!resProgression.ok || !resWeekly.ok) {
                    throw new Error(`Erreur de chargement des données.`);
                }

                const resultProgression: ProgressionData = await resProgression.json();
                const resultWeekly: WeeklyData[] = await resWeekly.json();

                setData(resultProgression);
                setWeeklyData(resultWeekly);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Une erreur est survenue");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
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

    const currentXp = data.current_xp_in_level || 0;
    const maxXp = data.xp_for_next_level || 100;
    const globalProgressPercentage = Math.min(100, Math.round((currentXp / maxXp) * 100));

    const breakdown = data.breakdown || { sport: 0, intel: 0, crea: 0, career: 0, mental: 0 };

    const barChartData = STAT_CONFIG.map(stat => ({
        name: stat.label,
        xp: breakdown[stat.key] || 0,
        color: stat.color,
    }));

    const maxStatXp = Math.max(...Object.values(breakdown), 100);

    return (
        <div className="progression-container">
            <header className="level-card">
                <div className="level-header">
                    <div className="level-title-group">
                        <Award className="level-icon" size={32} />
                        <div>
                            <span className="level-subtitle">NIVEAU ACTUEL</span>
                            <h1 className="level-number">Niveau {data.level || 1}</h1>
                        </div>
                    </div>
                    <div className="streak-badge">
                        <Flame size={20} color="#FF6B6B" />
                        <span>{data.current_streak || 0} Jours de série</span>
                    </div>
                </div>

                <div className="global-xp-section">
                    <div className="xp-labels">
                        <span>Expérience globale</span>
                        <span>
                            {currentXp} / {maxXp} XP ({globalProgressPercentage}%)
                        </span>
                    </div>
                    <div className="global-progress-bar">
                        <div className="global-progress-fill" style={{ width: `${globalProgressPercentage}%` }} />
                    </div>
                </div>
            </header>

            <section className="chart-card">
                <div className="chart-header-row">
                    <h2 className="section-title">
                        {chartType === "bar" ? "Aperçu des Statistiques" : "Évolution (7 derniers jours)"}
                    </h2>
                    <div className="chart-toggle-group">
                        <button
                            className={`chart-toggle-btn ${chartType === "bar" ? "active" : ""}`}
                            onClick={() => setChartType("bar")}
                            title="Graphique en barres"
                        >
                            <BarChart3 size={18} />
                            <span>Statistiques</span>
                        </button>
                        <button
                            className={`chart-toggle-btn ${chartType === "line" ? "active" : ""}`}
                            onClick={() => setChartType("line")}
                            title="Graphique évolutif"
                        >
                            <TrendingUp size={18} />
                            <span>Évolution</span>
                        </button>
                    </div>
                </div>

                <div className="chart-wrapper" key={chartType}>
                    {chartType === "bar" ? (
                        <ResponsiveContainer width="100%" height={360}>
                            <BarChart
                                data={barChartData}
                                margin={{
                                    top: 20,
                                    right: 10,
                                    left: isMobile ? -25 : -20,
                                    bottom: isMobile ? 20 : 0,
                                }}
                                barCategoryGap={isMobile ? "15%" : "10%"}
                            >
                                <XAxis
                                    dataKey="name"
                                    stroke="#A0AEC0"
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                                    interval={0}
                                    tick={{ fontSize: isMobile ? 10 : 12 }}
                                    angle={isMobile ? -35 : 0}
                                    textAnchor={isMobile ? "end" : "middle"}
                                    height={isMobile ? 60 : 30}
                                />
                                <YAxis
                                    stroke="#A0AEC0"
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                                    width={35}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.04)" }} />
                                <Bar
                                    dataKey="xp"
                                    maxBarSize={isMobile ? 30 : 60}
                                    shape={(props: any) => {
                                        const { x, y, width, height, index } = props;
                                        const color = barChartData[index]?.color || "#8884d8";
                                        return (
                                            <rect
                                                x={x}
                                                y={y}
                                                width={width}
                                                height={height}
                                                fill={color}
                                                rx={6}
                                                ry={6}
                                            />
                                        );
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height={360}>
                            <AreaChart data={weeklyData || []} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7b2fbe" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#7b2fbe" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255, 255, 255, 0.05)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="day"
                                    stroke="#A0AEC0"
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                                />
                                <YAxis
                                    stroke="#A0AEC0"
                                    tickLine={false}
                                    axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ stroke: "rgba(255, 255, 255, 0.1)", strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="xp"
                                    name="XP Total"
                                    stroke="#9f7aea"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#xpGradient)"
                                    activeDot={{ r: 6, fill: "#7b2fbe", stroke: "#fff" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </section>

            <section className="stats-grid">
                {STAT_CONFIG.map(stat => {
                    const Icon = stat.icon;
                    const currentStatXp = breakdown[stat.key] || 0;
                    const percent = Math.min(100, Math.round((currentStatXp / maxStatXp) * 100));

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
                                <span className="stat-xp-value">{currentStatXp} XP</span>
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
