import { ArrowLeft, FileText, Scale, Shield } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./legal.css";

export default function Legal() {
    const navigate = useNavigate();
    const location = useLocation();

    const mentionsRef = useRef<HTMLDivElement>(null);
    const privacyRef = useRef<HTMLDivElement>(null);
    const cguRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const hash = location.hash.replace("#", "");
        if (hash === "mentions" && mentionsRef.current) {
            mentionsRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (hash === "privacy" && privacyRef.current) {
            privacyRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (hash === "cgu" && cguRef.current) {
            cguRef.current.scrollIntoView({ behavior: "smooth" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location.hash]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="legal-container">
            <div className="legal-wrapper">
                <button
                    className="back-btn"
                    onClick={() => {
                        if (window.history.length > 2) {
                            navigate(-1);
                        } else {
                            navigate("/login");
                        }
                    }}
                >
                    <ArrowLeft size={18} /> Retour
                </button>

                <header className="legal-header">
                    <div className="legal-brand">
                        {/* Logo SVG conservé tel quel */}
                        <svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#9501d9" />
                            <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#9501d9" />
                            <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#9501d9" />
                        </svg>
                        <h1>Documents Légaux</h1>
                    </div>
                    <p>Transparence et respect de vos droits.</p>
                </header>

                <div className="legal-tabs">
                    <button className="tab-btn" onClick={() => scrollToSection("mentions")}>
                        <FileText size={18} /> Mentions
                    </button>
                    <button className="tab-btn" onClick={() => scrollToSection("privacy")}>
                        <Shield size={18} /> Confidentialité
                    </button>
                    <button className="tab-btn" onClick={() => scrollToSection("cgu")}>
                        <Scale size={18} /> CGU
                    </button>
                </div>

                <div className="legal-content-box">
                    {/* SECTION MENTIONS */}
                    <div id="mentions" ref={mentionsRef} className="legal-text section-anchor">
                        <h2>Mentions Légales</h2>
                        <p>
                            Conformément aux dispositions du Code de droit économique belge et de la loi sur les
                            services de la société de l'information, il est précisé aux utilisateurs du site Rakib
                            l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
                        </p>

                        <h3>1. Éditeur du site</h3>
                        <p>
                            <strong>Nom / Pseudo :</strong> Projet Open Source Rakib <br />
                            <strong>Statut :</strong> Projet communautaire / Open Source <br />
                            <strong>Contact :</strong> [votre-email@exemple.com] <br />
                            <strong>Directeur de la publication :</strong> L'équipe Rakib
                        </p>

                        <h3>2. Hébergement</h3>
                        <p>
                            L'application Rakib est hébergée par :<br />
                            <strong>Frontend :</strong> Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA)
                            <strong>Backend & Base de données :</strong> Supabase Inc. (Hébergé sur les serveurs AWS à
                            Paris, France - Région eu-west-3)
                        </p>

                        <h3>3. Droit applicable et juridiction</h3>
                        <p>
                            Les présentes mentions légales sont soumises au droit belge. En cas de litige, et à défaut
                            d'accord amiable, les tribunaux belges seront seuls compétents.
                        </p>

                        <h3>4. Propriété intellectuelle</h3>
                        <p>
                            Tous les éléments constituant l'application (design, code source, logo, textes) sont la
                            propriété exclusive de l'éditeur. Toute reproduction, représentation, modification ou
                            adaptation, totale ou partielle, est strictement interdite sans autorisation écrite
                            préalable.
                        </p>
                    </div>

                    <hr className="legal-divider" />

                    {/* SECTION CONFIDENTIALITE */}
                    <div id="privacy" ref={privacyRef} className="legal-text section-anchor">
                        <h2>Politique de Confidentialité</h2>
                        <div className="ethics-highlight">
                            <Shield size={24} />
                            <p>
                                <strong>L'engagement Rakib :</strong> Rakib est un espace sain. Nous ne vendons aucune
                                de vos données. Nous n'affichons aucune publicité. Nous n'utilisons aucun tracker
                                publicitaire (pas de Google Analytics, pas de pixels Facebook).
                            </p>
                        </div>

                        <h3>1. Données collectées</h3>
                        <p>
                            Dans le cadre de l'utilisation de Rakib, nous collectons uniquement les données nécessaires
                            à son fonctionnement :
                        </p>
                        <ul>
                            <li>
                                <strong>Données d'identification :</strong> adresse e-mail, pseudo, nom.
                            </li>
                            <li>
                                <strong>Données de profil :</strong> photo de profil (optionnelle).
                            </li>
                            <li>
                                <strong>Données d'utilisation :</strong> objectifs, check-ins, statistiques (XP), et le
                                contenu de votre Carnet du Jardin Secret.
                            </li>
                        </ul>

                        <h3>2. ⚠️ Transparence sur le Jardin Secret (Carnet)</h3>
                        <p>
                            Contrairement à des applications de journaling chiffrées de bout en bout (E2EE),{" "}
                            <strong>
                                les entrées de votre carnet sont actuellement stockées en clair dans notre base de
                                données sécurisée
                            </strong>
                            . Cela signifie que l'éditeur de Rakib a techniquement la capacité de lire ces données en
                            cas de nécessité absolue (maintenance, bug critique).{" "}
                            <em>
                                Nous nous engageons formellement à ne jamais lire, exploiter ou partager le contenu de
                                votre carnet.
                            </em>{" "}
                            Le chiffrement de bout en bout (E2EE) est prévu pour une future mise à jour.
                        </p>

                        <h3>3. Utilisation et Stockage des données</h3>
                        <p>
                            Ces données sont utilisées exclusivement pour vous permettre d'accéder à votre compte, de
                            suivre votre progression et d'interagir avec vos "Compagnons". Elles sont hébergées de
                            manière sécurisée chez Supabase.
                        </p>

                        <h3>4. Durée de conservation et Suppression</h3>
                        <p>
                            Vos données sont conservées tant que votre compte est actif. Si vous décidez de supprimer
                            votre compte, l'intégralité de vos données sera effacée instantanément et définitivement de
                            nos serveurs.
                        </p>

                        <h3>5. Vos droits (RGPD)</h3>
                        <p>
                            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un
                            droit d'accès, de rectification, d'effacement et de portabilité de vos données.{" "}
                            <strong>
                                Vous pouvez exercer votre droit à l'effacement directement depuis la page Paramètres en
                                cliquant sur "Supprimer mon compte".
                            </strong>{" "}
                            Pour toute autre demande, vous pouvez contacter l'éditeur à l'adresse
                            [votre-email@exemple.com]. Vous avez également le droit d'introduire une réclamation auprès
                            de l'Autorité de protection des données belge (APD).
                        </p>

                        <h3>6. Cookies</h3>
                        <p>
                            Rakib utilise uniquement des cookies techniques (HttpOnly, SameSite) strictement nécessaires
                            à votre authentification et à la sécurité de votre session. Aucun cookie de suivi
                            publicitaire n'est utilisé.
                        </p>
                    </div>

                    <hr className="legal-divider" />

                    {/* SECTION CGU */}
                    <div id="cgu" ref={cguRef} className="legal-text section-anchor">
                        <h2>Conditions Générales d'Utilisation</h2>
                        <h3>1. Objet</h3>
                        <p>
                            Rakib est une application de productivité et de développement personnel. L'utilisation de
                            l'application implique l'acceptation pleine et entière des présentes Conditions Générales
                            d'Utilisation.
                        </p>

                        <h3>2. Comportement de l'utilisateur</h3>
                        <p>
                            Rakib met en relation des utilisateurs via le système de "Compagnons". L'utilisateur
                            s'engage à adopter un comportement respectueux. Tout propos haineux, harcèlement, spam ou
                            tentative de contournement des règles de sécurité entraînera le bannissement immédiat et
                            définitif du compte, sans préavis ni remboursement (le cas échéant).
                        </p>

                        <h3>3. Responsabilité</h3>
                        <p>
                            Rakib est un outil d'aide à l'organisation. L'application est fournie "en l'état".
                            L'éditeur, en tant que projet open source, s'efforce d'assurer la disponibilité et la
                            sécurité du service, mais ne saurait être tenu responsable en cas de perte de données,
                            d'indisponibilité temporaire (maintenance) ou de dommages indirects liés à l'utilisation du
                            service.
                        </p>

                        <h3>4. Suppression de compte</h3>
                        <p>
                            L'utilisateur est libre de supprimer son compte à tout moment depuis la page Paramètres.
                            Cette action entraîne la suppression immédiate et irréversible de toutes ses données
                            (objectifs, check-ins, historique, journal).
                        </p>

                        <h3>5. Modifications des CGU</h3>
                        <p>
                            L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs
                            seront informés de toute modification majeure via l'application.
                        </p>

                        <h3>6. Droit applicable</h3>
                        <p>
                            Les présentes CGU sont régies par le droit belge. Tout litige relatif à l'interprétation ou
                            à l'exécution des présentes sera soumis aux tribunaux compétents de Belgique.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
