import { Archive, Code, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const GITHUB_URL = "https://github.com/Code-Amo/rakib";

    return (
        <div className="h-screen custom-scrollbar overflow-y-auto overflow-x-hidden bg-[#141414] text-gray-100 font-sans selection:bg-[#9501d9] selection:text-white relative">
            <div className="bg-[#9501d9] text-white text-center py-2 text-sm font-semibold relative z-50 flex items-center justify-center gap-2">
                <Archive size={16} />
                <span>Projet clôturé. Cette page sert désormais de vitrine technique (Portfolio).</span>
            </div>

            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-20 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(149, 1, 217, 0.25), transparent 80%)`,
                }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#9501d9]/15 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

            <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#141414]/80 border-b border-white/10 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <a
                        href="/"
                        className="flex items-center gap-3 group active:scale-95 transition-transform duration-100"
                    >
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
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                        >
                            <Code size={18} />
                            Voir le code source
                        </a>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-gray-400 hover:text-white rounded-lg"
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
                            className="block px-3 py-2 text-base text-gray-300"
                        >
                            Problématique
                        </a>
                        <a
                            href="#fonctionnalites"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base text-gray-300"
                        >
                            Fonctionnalités
                        </a>
                        <div className="pt-4">
                            <a
                                href={GITHUB_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-white bg-[#9501d9] rounded-xl"
                            >
                                <Code size={18} /> Voir le code
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-xs sm:text-sm font-medium text-purple-300">
                        <Sparkles size={16} className="text-[#9501d9]" />
                        <span>Projet Full-Stack (React & FastAPI) &bull; Portfolio Open Source</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
                        Reprends le contrôle. <br />
                        <span className="bg-gradient-to-r from-white via-purple-200 to-[#9501d9] bg-clip-text text-transparent">
                            Sans vendre ton âme.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
                        L'application de productivité gamifiée et éthique. Ce projet a été développé à 17 ans pour
                        démontrer une architecture complète (JWT, Cookies HttpOnly, React, FastAPI, Supabase).
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-[#9501d9] hover:bg-[#a813eb] rounded-2xl shadow-[0_0_30px_rgba(149,1,217,0.5)] transition-all flex items-center justify-center gap-3"
                        >
                            <Code size={20} />
                            <span>Explorer le code sur GitHub</span>
                        </a>
                        <a
                            href="#fonctionnalites"
                            className="w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-300 hover:text-white bg-white/[0.03] border border-white/10 rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                            <span>Voir l'architecture</span>
                        </a>
                    </div>
                </div>

                {/* ... (Le reste de la section Hero avec le mockup reste identique) ... */}
                <div className="mt-16 relative max-w-5xl mx-auto">
                    <p className="text-center text-xs text-gray-500 mb-4 italic">
                        Aperçu de l'interface — Données de démonstration
                    </p>
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
                        {/* J'ai gardé ton mockup intact ici pour ne pas surcharger la réponse, tu as déjà le code */}
                        <div className="p-6 md:p-8 flex items-center justify-center text-gray-500 min-h-[300px]">
                            [ Aperçu de l'interface - Code inchangé ]
                        </div>
                    </div>
                </div>
            </section>

            {/* ... (Les sections Problèmes, Fonctionnalités, Éthique restent identiques) ... */}

            {/* CTA Final (Modifié) */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-white/5">
                <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#9501d9]/20 to-transparent border border-[#9501d9]/30 backdrop-blur-xl space-y-6">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-white/5 rounded-full border border-white/10">
                            <Archive size={40} className="text-[#9501d9]" />
                        </div>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                        Un projet clôturé, mais une base solide.
                    </h2>
                    <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
                        Les inscriptions sont désormais fermées. Rakib V1 a servi de terrain d'entraînement pour
                        maîtriser l'architecture full-stack. Le code est 100% open-source et disponible pour
                        consultation.
                    </p>
                    <div className="pt-4">
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-[#9501d9] hover:bg-[#a813eb] rounded-2xl shadow-[0_0_30px_rgba(149,1,217,0.6)] transition-all"
                        >
                            <Code size={20} />
                            Consulter le Repository
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer (Nettoyé) */}
            <footer className="border-t border-white/10 bg-[#0f0f0f] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32 10 L52 28 L46 34 L32 21 L18 34 L12 28 Z" fill="#9501d9" />
                            <path d="M32 25 L52 43 L46 49 L32 36 L18 49 L12 43 Z" fill="#9501d9" />
                            <path d="M32 40 L52 58 L46 64 L32 51 L18 64 L12 58 Z" fill="#9501d9" />
                        </svg>
                        <span className="text-xl font-extrabold text-white">Rakib</span>
                    </div>

                    <div className="flex flex-col items-center lg:items-start gap-2">
                        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-400">
                            <a href="/legal#mentions" className="hover:text-white transition-all">
                                Mentions légales
                            </a>
                            <a href="/legal#cgu" className="hover:text-white transition-all">
                                CGU
                            </a>
                            <a href="/legal#privacy" className="hover:text-white transition-all">
                                Confidentialité
                            </a>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 text-center lg:text-right">
                        &copy; {new Date().getFullYear()} Rakib. Portfolio Technique.
                    </div>
                </div>
            </footer>
        </div>
    );
}
