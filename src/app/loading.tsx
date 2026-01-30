import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-20">
            <div className="bg-white/50 p-4 rounded-full mb-4 backdrop-blur-sm border border-slate-100">
                <Loader2 className="h-10 w-10 text-[#34E0A1] animate-spin" />
            </div>
            <div className="text-slate-400 font-bold text-lg animate-pulse">Chargement...</div>
        </div>
    )
}
