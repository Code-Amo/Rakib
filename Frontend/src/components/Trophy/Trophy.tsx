import type { ReactNode } from "react";
import "./Trophy.css";

export type TrophyRarity = "bronze" | "silver" | "gold" | "platinum";

export interface TrophyCardProps {
    title: string;
    description: string;
    rarity: TrophyRarity;
    isUnlocked: boolean;
    icon?: ReactNode;
}

export default function TrophyCard({ title, description, rarity, isUnlocked, icon }: TrophyCardProps) {
    return (
        <div className={`trophy-card rarity-${rarity} ${isUnlocked ? "unlocked" : "locked"}`}>
            <div className="trophy-logo">
                <svg width="44" height="44" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="currentColor" />
                    <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="currentColor" />
                    <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="currentColor" />
                </svg>
            </div>

            <div className="trophy-content">
                <div className="trophy-header">
                    {icon && <span className="trophy-icon">{icon}</span>}
                    <h4 className="trophy-title">{title}</h4>
                </div>
                <p className="trophy-description">{description}</p>
            </div>
        </div>
    );
}
