import { fetchWithAuth } from "@/function/api";
import {
    AlertCircle,
    Award,
    CheckCircle2,
    Loader2,
    Mail,
    Send,
    Shield,
    Trash2,
    UserPlus,
    Users,
    XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import "./rivals.css";

export interface Companion {
    id: number;
    pseudo: string;
    category: string;
    target_checkins: number;
    user_checkins: number;
    companion_checkins: number;
    status: "pending" | "accepted" | "completed";
    is_requester: boolean;
    created_at?: string;
}

export interface InviteFormData {
    pseudo: string;
    category: string;
    target_checkins: number;
}

const CATEGORIES = ["Sport", "Intelligence", "Créativité", "Career", "Mental"];

export const Rivals: React.FC = () => {
    const [acceptedCompanions, setAcceptedCompanions] = useState<Companion[]>([]);
    const [pendingCompanions, setPendingCompanions] = useState<Companion[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const [formData, setFormData] = useState<InviteFormData>({
        pseudo: "",
        category: "Sport",
        target_checkins: 5,
    });

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedToDelete, setSelectedToDelete] = useState<Companion | null>(null);

    const receivedInvites = pendingCompanions.filter(c => !c.is_requester);
    const sentInvites = pendingCompanions.filter(c => c.is_requester);

    const fetchCompanions = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetchWithAuth("/compagnon/me");

            if (!res.ok) {
                throw new Error("Impossible de charger la liste des compagnons.");
            }

            const data = await res.json();
            setAcceptedCompanions(data.accepted || []);
            setPendingCompanions(data.pending || []);
        } catch (err: any) {
            setError(err.message || "Impossible de charger la liste des compagnons.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanions();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "target_checkins" ? Number(value) : value,
        }));
    };

    const handleInviteSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.pseudo.trim()) {
            setError("Veuillez entrer le pseudo de votre ami.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            setFormSuccess(null);

            const res = await fetchWithAuth("/compagnon/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Cet utilisateur n'existe pas.");
            }

            setFormSuccess(`Invitation envoyée avec succès à ${formData.pseudo} !`);
            setFormData({ pseudo: "", category: "Sport", target_checkins: 5 });
            await fetchCompanions();
        } catch (err: any) {
            setError(err.message || "Échec de l'envoi de l'invitation.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAccept = async (id: number) => {
        try {
            setActionLoadingId(id);
            setError(null);
            const res = await fetchWithAuth(`/compagnon/${id}/accept`, {
                method: "POST",
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Impossible d'accepter l'invitation.");
            }
            await fetchCompanions();
        } catch (err: any) {
            setError(err.message || "Impossible d'accepter l'invitation.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDeclineOrBreak = async (id: number) => {
        try {
            setActionLoadingId(id);
            setError(null);
            const res = await fetchWithAuth(`/compagnon/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Impossible d'effectuer cette action.");
            }
            setShowDeleteModal(false);
            setSelectedToDelete(null);
            await fetchCompanions();
        } catch (err: any) {
            setError(err.message || "Impossible d'effectuer cette action.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const calculateProgress = (current: number, target: number): number => {
        if (!target || target <= 0) return 0;
        const percentage = Math.round((current / target) * 100);
        return Math.min(percentage, 100);
    };

    const activeCompanion = acceptedCompanions.length > 0 ? acceptedCompanions[0] : null;

    return (
        <div className="rivals-page-container-rivals">
            <header className="rivals-header-rivals">
                <h1 className="rivals-title-rivals">Compagnons</h1>
                <p className="rivals-subtitle-rivals">
                    Dépasser tes limites ensemble. Associe-toi avec un frère d'armes pour atteindre vos objectifs
                    communs.
                </p>
            </header>

            {error && (
                <div className="rivals-error-banner-rivals">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {formSuccess && (
                <div className="rivals-success-banner-rivals">
                    <CheckCircle2 size={20} />
                    <span>{formSuccess}</span>
                </div>
            )}

            {isLoading ? (
                <div className="rivals-loader-container-rivals">
                    <Loader2 className="spinner-rivals" size={40} />
                    <p>Chargement des alliances...</p>
                </div>
            ) : (
                <div className="rivals-grid-layout-rivals">
                    <div className="rivals-left-column-rivals">
                        <section className="rivals-section-rivals">
                            <h2 className="rivals-section-title-rivals">
                                <Shield size={22} /> Mon Compagnon Actuel
                            </h2>

                            {activeCompanion ? (
                                <div className="companion-card-rivals active-companion-card-rivals">
                                    <div className="card-header-flex-rivals">
                                        <div className="companion-user-info-rivals">
                                            <div className="companion-avatar-circle-rivals">
                                                {activeCompanion.pseudo.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="companion-name-rivals">{activeCompanion.pseudo}</h3>
                                                <span className="companion-category-badge-rivals">
                                                    {activeCompanion.category}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-danger-discrete-rivals"
                                            onClick={() => {
                                                setSelectedToDelete(activeCompanion);
                                                setShowDeleteModal(true);
                                            }}
                                            title="Rompre l'alliance"
                                        >
                                            <Trash2 size={16} />
                                            <span>Rompre</span>
                                        </button>
                                    </div>

                                    <div className="progress-dual-section-rivals">
                                        <div className="progress-item-rivals">
                                            <div className="progress-labels-rivals">
                                                <span className="user-label-rivals">Toi</span>
                                                <span className="progress-counter-rivals">
                                                    {activeCompanion.user_checkins} / {activeCompanion.target_checkins}
                                                </span>
                                            </div>
                                            <div className="progress-bar-track-rivals">
                                                <div
                                                    className="progress-bar-fill-rivals fill-user-rivals"
                                                    style={{
                                                        width: `${calculateProgress(
                                                            activeCompanion.user_checkins,
                                                            activeCompanion.target_checkins,
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="progress-item-rivals">
                                            <div className="progress-labels-rivals">
                                                <span className="companion-label-rivals">{activeCompanion.pseudo}</span>
                                                <span className="progress-counter-rivals">
                                                    {activeCompanion.companion_checkins} /{" "}
                                                    {activeCompanion.target_checkins}
                                                </span>
                                            </div>
                                            <div className="progress-bar-track-rivals">
                                                <div
                                                    className="progress-bar-fill-rivals fill-companion-rivals"
                                                    style={{
                                                        width: `${calculateProgress(
                                                            activeCompanion.companion_checkins,
                                                            activeCompanion.target_checkins,
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="companion-card-rivals empty-card-rivals">
                                    <Users size={48} className="empty-icon-rivals" />
                                    <h3>Aucun compagnon actif</h3>
                                    <p>
                                        Invitez un ami dès maintenant pour sceller une alliance et progresser côte à
                                        côte.
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="rivals-section-rivals">
                            <h2 className="rivals-section-title-rivals">
                                <Mail size={22} /> Invitations reçues
                            </h2>
                            {receivedInvites.length > 0 ? (
                                <div className="pending-list-rivals">
                                    {receivedInvites.map(comp => (
                                        <div key={comp.id} className="companion-card-rivals pending-card-rivals">
                                            <div className="pending-details-rivals">
                                                <span className="pending-user-rivals">{comp.pseudo}</span>
                                                <span className="pending-goal-rivals">
                                                    Objectif : <strong>{comp.target_checkins} check-ins</strong> (
                                                    {comp.category})
                                                </span>
                                            </div>
                                            <div className="pending-actions-rivals">
                                                <button
                                                    type="button"
                                                    className="btn-action-rivals btn-accept-rivals"
                                                    disabled={actionLoadingId === comp.id}
                                                    onClick={() => handleAccept(comp.id)}
                                                >
                                                    {actionLoadingId === comp.id ? (
                                                        <Loader2 size={16} className="spinner-rivals" />
                                                    ) : (
                                                        <CheckCircle2 size={16} />
                                                    )}
                                                    <span>Accepter</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-action-rivals btn-decline-rivals"
                                                    disabled={actionLoadingId === comp.id}
                                                    onClick={() => handleDeclineOrBreak(comp.id)}
                                                >
                                                    <XCircle size={16} />
                                                    <span>Refuser</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="companion-card-rivals empty-card-rivals compact-rivals">
                                    <p>Aucune invitation reçue.</p>
                                </div>
                            )}
                        </section>

                        <section className="rivals-section-rivals">
                            <h2 className="rivals-section-title-rivals">
                                <Send size={22} /> Invitations envoyées
                            </h2>
                            {sentInvites.length > 0 ? (
                                <div className="pending-list-rivals">
                                    {sentInvites.map(comp => (
                                        <div key={comp.id} className="companion-card-rivals pending-card-rivals">
                                            <div className="pending-details-rivals">
                                                <span className="pending-user-rivals">{comp.pseudo}</span>
                                                <span className="pending-goal-rivals">En attente de réponse...</span>
                                            </div>
                                            <div className="pending-actions-rivals">
                                                <button
                                                    type="button"
                                                    className="btn-action-rivals btn-decline-rivals"
                                                    disabled={actionLoadingId === comp.id}
                                                    onClick={() => handleDeclineOrBreak(comp.id)}
                                                    title="Annuler l'invitation"
                                                >
                                                    {actionLoadingId === comp.id ? (
                                                        <Loader2 size={16} className="spinner-rivals" />
                                                    ) : (
                                                        <XCircle size={16} />
                                                    )}
                                                    <span>Annuler</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="companion-card-rivals empty-card-rivals compact-rivals">
                                    <p>Aucune invitation envoyée.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="rivals-right-column-rivals">
                        <section className="rivals-section-rivals">
                            <h2 className="rivals-section-title-rivals">
                                <UserPlus size={22} /> Inviter un ami
                            </h2>

                            <div className="companion-card-rivals form-card-rivals">
                                <form onSubmit={handleInviteSubmit} className="invite-form-rivals">
                                    <div className="form-group-rivals">
                                        <label htmlFor="pseudo">Pseudo de l'ami</label>
                                        <input
                                            type="text"
                                            id="pseudo"
                                            name="pseudo"
                                            placeholder="Ex: Bilal_99"
                                            value={formData.pseudo}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-rivals">
                                        <label htmlFor="category">Catégorie</label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group-rivals">
                                        <label htmlFor="target_checkins">Objectif de Check-ins</label>
                                        <input
                                            type="number"
                                            id="target_checkins"
                                            name="target_checkins"
                                            min={1}
                                            max={100}
                                            value={formData.target_checkins}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn-submit-rivals" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="spinner-rivals" />
                                                <span>Envoi en cours...</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus size={18} />
                                                <span>Envoyer l'invitation</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </section>

                        <section className="rivals-section-rivals">
                            <div className="companion-card-rivals info-card-rivals">
                                <div className="info-card-header-rivals">
                                    <Award size={20} />
                                    <h3>Règles du Compagnonnage</h3>
                                </div>
                                <ul>
                                    <li>Accomplissez vos séances quotidiennes pour faire grimper votre barre.</li>
                                    <li>Incitez votre compagnon à rester régulier pour valider l'objectif global.</li>
                                    <li>Une alliance active ne peut être rompu qu'en cas d'abandon de l'objectif.</li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedToDelete && (
                <div className="modal-overlay-rivals">
                    <div className="companion-card-rivals modal-content-rivals">
                        <h3>Rompre l'alliance ?</h3>
                        <p>
                            Êtes-vous sûr de vouloir rompre l'alliance avec <strong>{selectedToDelete.pseudo}</strong> ?
                            Cette action est irréversible et réinitialisera votre progression commune.
                        </p>
                        <div className="modal-actions-rivals">
                            <button
                                type="button"
                                className="btn-action-rivals btn-cancel-rivals"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedToDelete(null);
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="btn-action-rivals btn-confirm-danger-rivals"
                                onClick={() => handleDeclineOrBreak(selectedToDelete.id)}
                                disabled={actionLoadingId === selectedToDelete.id}
                            >
                                {actionLoadingId === selectedToDelete.id ? (
                                    <Loader2 size={16} className="spinner-rivals" />
                                ) : (
                                    "Confirmer la rupture"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rivals;
