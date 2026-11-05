import pic from "@/assets/logo.png";
import TrophyPage from "@/components/Trophy/TrophyPage";
import { fetchWithAuth } from "@/function/api";
import { Flame, Trophy as TrophyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import "./MobileHeader.css";

interface DashboardData {
    user: { id?: string; avatar_url?: string; username: string };
    streak?: { current: number };
    trophies_summary: { unlocked_count: number; total_count: number };
}

export default function MobileHeader() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isTrophyOpen, setIsTrophyOpen] = useState(false);
    const isUploading = false; // Désactivé pour la version vitrine

    const fetchDashboardData = async () => {
        try {
            const res = await fetchWithAuth("/panel/dashboard");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error("Erreur header mobile", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleAvatarUpload = () => {
        // Désactivé car le projet est archivé
        return;
    };

    if (!data) return null;

    return (
        <>
            <header className="mobile-header">
                <div className="mobile-header-profile">
                    <input
                        type="file"
                        id="mobile-avatar-upload"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                    />

                    <label htmlFor="mobile-avatar-upload" className="mobile-avatar-label">
                        <img src={data.user.avatar_url || pic} alt="Profil" className="mobile-avatar" />
                    </label>
                    <span className="mobile-username">{data.user.username}</span>
                </div>

                <div className="mobile-header-stats">
                    <div className="mobile-stat-badge flame-badge">
                        <Flame size={16} color="#ff6b00" />
                        <span>{data.streak?.current || 0}j</span>
                    </div>

                    <button className="mobile-stat-badge trophy-badge" onClick={() => setIsTrophyOpen(true)}>
                        <TrophyIcon size={16} color="#ffd700" />
                        <span>
                            {data.trophies_summary.unlocked_count}/{data.trophies_summary.total_count}
                        </span>
                    </button>
                </div>
            </header>

            {isTrophyOpen && <TrophyPage onClose={() => setIsTrophyOpen(false)} />}
        </>
    );
}
