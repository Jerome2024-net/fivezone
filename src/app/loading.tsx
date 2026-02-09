import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-20">
            <div className="bg-white/50 p-6 rounded-2xl mb-4 backdrop-blur-sm border border-slate-100 shadow-sm">
                <Loader2 className="h-8 w-8 text-[#34E0A1] animate-spin" />
            </div>
            <div className="text-slate-400 font-medium text-sm animate-pulse">Loading...</div>
        </div>
    )
}
