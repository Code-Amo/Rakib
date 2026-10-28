import pic from "@/assets/logo.png";
import TrophyPage from "@/components/Trophy/TrophyPage";
import { fetchWithAuth } from "@/function/api";
import { supabase } from "@/supabaseClient";
import { Flame, Loader2, Trophy as TrophyIcon } from "lucide-react";
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
    const [isUploading, setIsUploading] = useState(false);

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

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;
            setIsUploading(true);

            const fileExt = file.name.split(".").pop() || "jpg";
            const userId = data?.user?.id || "user";
            const fileName = `${userId}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
            const publicUrl = urlData.publicUrl;

            const response = await fetchWithAuth("/auth/me/avatar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatar_url: publicUrl }),
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'avatar");

            setData(prev =>
                prev
                    ? {
                          ...prev,
                          user: { ...prev.user, avatar_url: publicUrl },
                      }
                    : null,
            );

            window.dispatchEvent(new Event("refreshPanel"));
        } catch (error) {
            console.error("Erreur upload:", error);
            alert("Impossible de mettre à jour la photo de profil.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!data) return null;

    return (
        <>
            <header className="mobile-header">
                <div className="mobile-header-profile">
                    {/* Input caché pour l'upload */}
                    <input
                        type="file"
                        id="mobile-avatar-upload"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                    />

                    <label htmlFor="mobile-avatar-upload" className="mobile-avatar-label">
                        {isUploading ? (
                            <div className="mobile-avatar-loader">
                                <Loader2 className="spinner" size={20} color="#9f7aea" />
                            </div>
                        ) : (
                            <img src={data.user.avatar_url || pic} alt="Profil" className="mobile-avatar" />
                        )}
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
