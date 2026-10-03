import { getCurrentWindow } from "@tauri-apps/api/window";

const TitleBar = () => {
    const appWindow = getCurrentWindow();

    return (
        <div
            data-tauri-drag-region
            className="w-full h-9 shrink-0 bg-[#0e061bab] text-slate-300 flex items-center justify-between px-3 z-[9999] select-none position-fixed"
        >
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase pl-1">Amethyst</span>

            <div className="flex items-center gap-1 pointer-events-auto">
                <button
                    onClick={() => appWindow.minimize()}
                    className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    title="Réduire"
                >
                    <span className="text-xs font-bold">−</span>
                </button>

                <button
                    onClick={() => appWindow.toggleMaximize()}
                    className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    title="Agrandir / Restaurer"
                >
                    <span className="text-[10px]">❏</span>
                </button>

                <button
                    onClick={() => appWindow.close()}
                    className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:bg-red-500/80 hover:text-white transition-colors"
                    title="Fermer"
                >
                    <span className="text-xs font-bold">✕</span>
                </button>
            </div>
        </div>
    );
};

export default TitleBar;
