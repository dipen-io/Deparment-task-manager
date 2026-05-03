
export function LoadingSpinner() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-white/30 border-t-[#14b8a6] rounded-full animate-spin" />
                <p className="text-white text-sm font-medium">Loading...</p>
            </div>
        </div>
    );
}