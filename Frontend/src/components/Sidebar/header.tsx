import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import Add from "./add";
import "./header.css";
export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="main-header-container">
            <aside className="header">
                <ul className="header-menu">
                    <h1 className="hello">Accueil</h1>
                </ul>
            </aside>

            <div className="right-header">
                <ul className="header-menu-right">
                    <button
                        className="add-friends"
                        data-tooltip="Ajouter des compagnons"
                        onClick={() => setIsOpen(true)}
                    >
                        <UserRoundPlus />
                    </button>
                </ul>

                {isOpen && <Add onClose={() => setIsOpen(false)} />}

                <button className="avatar-btn" aria-label="Ouvrir le menu utilisateur">
                    <div className="avatar-container">
                        <img src="url_de_la_photo_ou_avatar_defaut.jpg" alt="Photo de profil" className="avatar-img" />
                    </div>
                    <span className="status-dot"></span>
                </button>
            </div>
        </header>
    );
}
