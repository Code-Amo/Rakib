import { Search, X } from "lucide-react";
import { createPortal } from "react-dom";
import "./add.css";

interface AddProps {
    onClose: () => void;
}

export default function Add({ onClose }: AddProps) {
    return createPortal(
        <div className="add-overlay" onClick={onClose}>
            <div className="add-card" onClick={e => e.stopPropagation()}>
                <form className="add-form" onSubmit={e => e.preventDefault()}>
                    <button type="button" className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>

                    <h1 className="title-a">Ajouter</h1>
                    <p className="subtitle-a">Entrez le pseudo de votre compagnon pour l'ajouter</p>

                    <div className="form-group-a">
                        <Search className="search-icon" size={18} />
                        <input className="search" type="text" placeholder="exemple#1234" />
                    </div>

                    <button type="button" className="btn-submit-a">
                        Envoyer l'invitation
                    </button>

                    <button type="button" className="btn-switch-a">
                        Copier mon lien
                    </button>
                </form>
            </div>
        </div>,
        document.body,
    );
}
