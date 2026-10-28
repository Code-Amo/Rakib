import {
    Activity,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Compass,
    EyeOff,
    Lock,
    Menu,
    ShieldCheck,
    Smartphone,
    Sparkles,
    TrendingUp,
    Users,
    X,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="h-screen custom-scrollbar overflow-y-auto overflow-x-hidden bg-[#141414] text-gray-100 font-sans selection:bg-[#9501d9] selection:text-white relative">
            {" "}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-20 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(149, 1, 217, 0.25), transparent 80%)`,
                }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#9501d9]/15 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#141414]/80 border-b border-white/10 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* LOGO CORRIGÉ (Navbar) */}
                    <a href="/" className="flex items-center gap-3 group">
                        <svg
                            width="36"
                            height="36"
                            viewBox="0 0 64 64"
                            xmlns="http://www.w3.org/2000/svg"
                            className="group-hover:scale-105 transition-transform duration-300"
                        >
                            <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#9501d9" />
                            <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#9501d9" />
                            <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#9501d9" />
                        </svg>
                        <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Rakib
                        </span>
                    </a>

                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#problemes"
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Problématique
                        </a>
                        <a
                            href="#fonctionnalites"
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Fonctionnalités
                        </a>
                        <a
                            href="#ethique"
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Notre Éthique
                        </a>
                        <a
                            href="#createur"
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Le Créateur
                        </a>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                        >
                            Se connecter
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="relative group px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-[#9501d9] hover:bg-[#a813eb] transition-all duration-300 shadow-[0_0_20px_rgba(149,1,217,0.4)] hover:shadow-[0_0_30px_rgba(149,1,217,0.7)] active:scale-95"
                        >
                            <span>S'inscrire</span>
                        </button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-gray-400 hover:text-white rounded-lg focus:outline-none"
                        >
                            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#181818] border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
                        <a
                            href="#problemes"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                        >
                            Problématique
                        </a>
                        <a
                            href="#fonctionnalites"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                        >
                            Fonctionnalités
                        </a>
                        <a
                            href="#ethique"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                        >
                            Notre Éthique
                        </a>
                        <a
                            href="#createur"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                        >
                            Le Créateur
                        </a>
                        <div className="pt-4 flex flex-col gap-2">
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-3 text-center font-medium text-gray-300 bg-white/5 rounded-xl"
                            >
                                Se connecter
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className="w-full py-3 text-center font-semibold text-white bg-[#9501d9] rounded-xl shadow-lg"
                            >
                                S'inscrire
                            </button>
                        </div>
                    </div>
                )}
            </nav>
            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-xs sm:text-sm font-medium text-purple-300">
                        <Sparkles size={16} className="text-[#9501d9]" />
                        <span>Sans Publicité &bull; Respectueux des données &bull; Éthique</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                        Reprends le contrôle. <br />
                        <span className="bg-gradient-to-r from-white via-purple-200 to-[#9501d9] bg-clip-text text-transparent">
                            Sans vendre ton âme.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
                        L'application de productivité gamifiée et éthique conçue pour t'aider à évoluer chaque jour,
                        développer tes habitudes tout en préservant ton temps et ce qui compte vraiment.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => navigate("/register")}
                            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[#9501d9] hover:bg-[#a813eb] rounded-2xl shadow-[0_0_30px_rgba(149,1,217,0.5)] hover:shadow-[0_0_40px_rgba(149,1,217,0.8)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                        >
                            <span>Créer mon compte</span>
                            <ArrowRight size={20} />
                        </button>
                        <a
                            href="#fonctionnalites"
                            className="w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <span>Découvrir l'app</span>
                        </a>
                    </div>

                    <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-[#9501d9]" />
                            <span>Zéro distraction toxique</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-[#9501d9]" />
                            <span>Conçu pour la régularité</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-[#9501d9]" />
                            <span>Espace personnel privé</span>
                        </div>
                    </div>
                </div>

                {/* Hero Interactive App Mockup Preview */}
                <div className="mt-16 relative max-w-5xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#9501d9]/30 via-purple-500/20 to-indigo-500/30 rounded-3xl blur-2xl opacity-50" />
                    <div className="relative rounded-2xl border border-white/10 bg-[#1a1a1a]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <div className="px-4 py-3 bg-[#111111] border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="text-xs font-mono text-gray-500">rakib.app/dashboard</div>
                            <div className="w-12"></div>
                        </div>

                        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-[#9501d9]/20 text-[#9501d9]">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Série Actuelle</div>
                                    <div className="text-2xl font-bold text-white">24 Jours</div>
                                </div>
                            </div>

                            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                                    <Activity size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Niveau de Discipline</div>
                                    <div className="text-2xl font-bold text-white">Niveau 18</div>
                                </div>
                            </div>

                            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Objectifs Semaine</div>
                                    <div className="text-2xl font-bold text-white">92% Réalisés</div>
                                </div>
                            </div>

                            <div className="md:col-span-2 p-6 rounded-xl bg-white/[0.02] border border-white/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-white">Vos Routines du jour</h4>
                                    <span className="text-xs text-[#9501d9] bg-[#9501d9]/10 px-2.5 py-1 rounded-full font-mono">
                                        4 / 5 Complétés
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: "Séance de sport & étirements", cat: "Corps", status: true },
                                        { label: "Lecture (20 pages d'apprentissage)", cat: "Intellect", status: true },
                                        { label: "Session de deep work (2h)", cat: "Projets", status: true },
                                        { label: "Méditation & Temps de recueillement", cat: "Mental", status: false },
                                    ].map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-5 h-5 rounded-md flex items-center justify-center border ${item.status ? "bg-[#9501d9] border-[#9501d9]" : "border-gray-600"}`}
                                                >
                                                    {item.status && <CheckCircle2 size={14} className="text-white" />}
                                                </div>
                                                <span
                                                    className={
                                                        item.status ? "line-through text-gray-400" : "text-gray-200"
                                                    }
                                                >
                                                    {item.label}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                                                {item.cat}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 mb-2">
                                        <Users size={14} />
                                        <span>ESPACE COMPAGNON</span>
                                    </div>
                                    <h4 className="font-bold text-white text-base">Check-in quotidien</h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Ton binôme Karim a validé sa journée il y a 2 heures.
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-800/30 text-xs text-purple-200">
                                    💬 "Bravo pour la régularité cette semaine, on ne lâche rien !"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Section 3: Les Problèmes */}
            <section
                id="problemes"
                className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 relative"
            >
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-xs font-bold text-[#9501d9] tracking-widest uppercase">Le constat</h2>
                    <p className="text-3xl sm:text-5xl font-extrabold text-white">
                        Pourquoi perdons-nous le contrôle ?
                    </p>
                    <p className="text-gray-400 text-base sm:text-lg">
                        Les applications modernes sont pensées pour capter ton attention, détruire ta concentration et
                        transformer ta vie en algorithme.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#9501d9]/40 transition-all duration-300 backdrop-blur-md group hover:-translate-y-1">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BrainCircuit size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Surcharge de Dopamine</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Les scrolls infinis et notifications incessantes réduisent ta capacité de concentration à
                            quelques secondes. Ton cerveau s'épuise sans rien produire de durable.
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#9501d9]/40 transition-all duration-300 backdrop-blur-md group hover:-translate-y-1">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <EyeOff size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Mercantilisation de l'attention</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            La plupart des applications gratuites vendent ton temps de cerveau disponible aux
                            annonceurs. Tes données personnelles deviennent leur produit principal.
                        </p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#9501d9]/40 transition-all duration-300 backdrop-blur-md group hover:-translate-y-1">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#9501d9] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Smartphone size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Superficialité Gamifiée</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Transformation artificielle de ta spiritualité ou de tes relations intimes en simples
                            "scores publicitaires" ou classements compétitifs toxiques.
                        </p>
                    </div>
                </div>
            </section>
            {/* Section 4: Les Fonctionnalités */}
            <section
                id="fonctionnalites"
                className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5"
            >
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-xs font-bold text-[#9501d9] tracking-widest uppercase">Fonctionnalités clés</h2>
                    <p className="text-3xl sm:text-5xl font-extrabold text-white">Une réponse éthique et complète</p>
                    <p className="text-gray-400 text-base sm:text-lg">
                        Tout ce dont tu as besoin pour te structurer au quotidien, équilibrer ta vie et progresser
                        sincèrement.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#9501d9]/50 transition-all duration-300 backdrop-blur-xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 rounded-2xl bg-[#9501d9]/20 text-[#9501d9]">
                                <Activity size={28} />
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                                Gamification Saine
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Radar de Compétences</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Visualise ton équilibre global sur 5 piliers fondamentaux : Sport, Mental, Discipline,
                            Savoir et Projets. Fais monter en niveau ton personnage réel.
                        </p>
                        <div className="h-48 w-full bg-[#111] rounded-2xl border border-white/5 flex items-center justify-center relative p-4">
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <div className="w-36 h-36 border border-purple-500 rounded-full" />
                                <div className="w-24 h-24 border border-purple-500 rounded-full absolute" />
                                <div className="w-12 h-12 border border-purple-500 rounded-full absolute" />
                            </div>
                            <svg className="w-40 h-40 overflow-visible relative z-10" viewBox="0 0 100 100">
                                <polygon
                                    points="50,10 90,40 75,85 25,85 10,40"
                                    fill="rgba(149, 1, 217, 0.25)"
                                    stroke="#9501d9"
                                    strokeWidth="2"
                                    className="transition-all duration-500 group-hover:scale-105 transform origin-center"
                                />
                                <circle cx="50" cy="10" r="3" fill="#fff" />
                                <circle cx="90" cy="40" r="3" fill="#fff" />
                                <circle cx="75" cy="85" r="3" fill="#fff" />
                                <circle cx="25" cy="85" r="3" fill="#fff" />
                                <circle cx="10" cy="40" r="3" fill="#fff" />
                            </svg>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#9501d9]/50 transition-all duration-300 backdrop-blur-xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                                <Lock size={28} />
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                                Zéro Gamification
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Le Jardin Secret</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Suis tes objectifs personnels, spirituels et relationnels en toute intimité. Ici, pas de
                            points, pas de classements ni de médailles publiques. Seule compte ton intention.
                        </p>
                        <div className="h-48 w-full bg-[#111] rounded-2xl border border-white/5 p-4 flex flex-col justify-center space-y-3">
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                <span className="text-xs text-gray-300 font-medium">
                                    Temps de recueillement quotidien
                                </span>
                                <span className="text-xs text-emerald-400 font-mono">Privé</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                <span className="text-xs text-gray-300 font-medium">Appel aux proches & parents</span>
                                <span className="text-xs text-emerald-400 font-mono">Accompli</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#9501d9]/50 transition-all duration-300 backdrop-blur-xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                                <Users size={28} />
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
                                Entraide & Redevabilité
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Système de Compagnons</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Associe-toi avec un partenaire de confiance pour valider vos bilans quotidiens. Restez
                            mutuellement redevables et motivez-vous sans dérive sociale toxique.
                        </p>
                        <div className="h-48 w-full bg-[#111] rounded-2xl border border-white/5 p-4 flex items-center justify-around">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-[#9501d9]/30 border border-[#9501d9] flex items-center justify-center font-bold text-white mx-auto mb-2">
                                    Toi
                                </div>
                                <span className="text-xs text-gray-400">Bilan prêt</span>
                            </div>
                            <div className="h-0.5 w-16 bg-gradient-to-r from-[#9501d9] to-blue-500 relative">
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#141414] px-1 text-[10px] text-gray-400">
                                    Sync
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-blue-500/30 border border-blue-500 flex items-center justify-center font-bold text-white mx-auto mb-2">
                                    Ayoub
                                </div>
                                <span className="text-xs text-gray-400">Validé ✓</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#9501d9]/50 transition-all duration-300 backdrop-blur-xl relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                                <TrendingUp size={28} />
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                                Analyse Précise
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Statistiques d'Évolution</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Suis tes progrès réels sur le long terme grâce à des graphiques limpides. Identifie tes
                            baisses de régime et ajuste tes efforts sans pression inutile.
                        </p>
                        <div className="h-48 w-full bg-[#111] rounded-2xl border border-white/5 p-4 flex items-end justify-between gap-2">
                            {[40, 65, 50, 85, 70, 90, 95].map((val, idx) => (
                                <div
                                    key={idx}
                                    className="w-full bg-white/5 rounded-t-lg h-full flex items-end overflow-hidden"
                                >
                                    <div
                                        className="w-full bg-gradient-to-t from-[#9501d9]/40 to-[#9501d9] rounded-t-lg transition-all duration-500 group-hover:opacity-100 opacity-80"
                                        style={{ height: `${val}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* Section 5: Notre Éthique */}
            <section id="ethique" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
                <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 p-8 sm:p-12 lg:p-16 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#9501d9]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="max-w-3xl space-y-6 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300">
                            <ShieldCheck size={16} />
                            <span>CHARTE ÉTHIQUE INÉBRANLABLE</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                            Un engagement total envers tes valeurs et ta vie privée.
                        </h2>
                        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                            Rakib a été pensé à l'inverse des géants de la Tech. Nous croyons qu'un outil de
                            productivité doit servir l'être humain, sans chercher à le rendre dépendant.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-[#9501d9]/20 text-[#9501d9] shrink-0 mt-1">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Gratuit pour commencer</h4>
                                    <p className="text-xs text-gray-400">
                                        Un accès libre aujourd'hui. Un modèle premium éthique soutiendra le projet
                                        demain, sans bloquer les fonctionnalités de base.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-[#9501d9]/20 text-[#9501d9] shrink-0 mt-1">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Zéro Publicité</h4>
                                    <p className="text-xs text-gray-400">
                                        Pas d'affichages intrusifs, pas de bannières qui polluent ton espace de travail.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-[#9501d9]/20 text-[#9501d9] shrink-0 mt-1">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Pas de Revente de Données</h4>
                                    <p className="text-xs text-gray-400">
                                        Tes données personnelles sont chiffrées et ne seront jamais partagées à des
                                        tiers.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-[#9501d9]/20 text-[#9501d9] shrink-0 mt-1">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Respect de la Foi</h4>
                                    <p className="text-xs text-gray-400">
                                        Les aspects spirituels sont préservés de toute gamification superficielle ou
                                        marchande.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Section 6: Le Créateur */}
            <section id="createur" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9501d9] tracking-widest uppercase">
                            <Compass size={16} />
                            <span>L'HISTOIRE DU PROJET</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Développé avec passion par un indépendant de 17 ans
                        </h2>
                        <p className="text-gray-300 text-base leading-relaxed">
                            "Salut, c'est le créateur de Rakib. À 17 ans, je me suis rendu compte à quel point les
                            applications du quotidien étaient conçues pour nous captiver plutôt que nous aider à réussir
                            notre vie."
                        </p>
                        <p className="text-gray-400 text-base leading-relaxed">
                            J'ai donc décidé de concevoir Rakib de A à Z : un outil moderne, utile et aligné avec nos
                            valeurs morales et spirituelles. Chaque ligne de code a été écrite avec l'ambition de créer
                            un espace sain et productif pour notre communauté.
                        </p>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden backdrop-blur-xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9501d9] to-purple-400 p-1">
                                    <div className="w-full h-full rounded-full bg-[#141414] flex items-center justify-center font-bold text-xl text-white">
                                        R
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">Créateur de Rakib</h4>
                                    <p className="text-xs text-purple-400">Développeur Solo & Indépendant</p>
                                </div>
                            </div>
                            <blockquote className="text-xs text-gray-400 italic leading-relaxed border-l-2 border-[#9501d9] pl-4 py-1 mb-6">
                                « Construire un produit utile, sans concession éthique, et montrer qu'un jeune peut
                                impacter positivement le quotidien de milliers de personnes. »
                            </blockquote>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                                <span>Développement 100% indépendant</span>
                                <span className="text-[#9501d9] font-mono">v1.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* CTA Final */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-white/5">
                <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#9501d9]/20 to-transparent border border-[#9501d9]/30 backdrop-blur-xl space-y-6">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                        Prêt à reprendre ton quotidien en main ?
                    </h2>
                    <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
                        Rejoins dès aujourd'hui l'aventure Rakib. Inscription simple, sans carte bancaire et sans
                        engagement.
                    </p>
                    <div className="pt-4">
                        <button
                            onClick={() => navigate("/register")}
                            className="px-8 py-4 text-base font-bold text-white bg-[#9501d9] hover:bg-[#a813eb] rounded-2xl shadow-[0_0_30px_rgba(149,1,217,0.6)] transition-all duration-300 transform hover:scale-105"
                        >
                            Créer mon compte gratuitement
                        </button>
                    </div>
                </div>
            </section>
            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#0f0f0f] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* LOGO CORRIGÉ (Footer) */}
                    <div className="flex items-center gap-3">
                        <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#9501d9" />
                            <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#9501d9" />
                            <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#9501d9" />
                        </svg>
                        <span className="text-xl font-extrabold text-white">Rakib</span>
                    </div>

                    {/* Liens Légaux & Contact */}
                    <div className="flex flex-col items-center lg:items-start gap-2">
                        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
                            <a href="/legal#mentions" className="hover:text-white transition-colors">
                                Mentions légales
                            </a>
                            <a href="/legal#cgu" className="hover:text-white transition-colors">
                                CGU
                            </a>
                            <a href="/legal#privacy" className="hover:text-white transition-colors">
                                Confidentialité
                            </a>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Contact :{" "}
                            <a href="mailto:contact.app.rakib@gmail.com" className="hover:text-white transition-colors">
                                contact.app.rakib@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs text-gray-500 text-center lg:text-right">
                        &copy; {new Date().getFullYear()} Rakib. <br className="hidden lg:block" /> Tous droits
                        réservés.
                    </div>
                </div>
            </footer>
        </div>
    );
}
