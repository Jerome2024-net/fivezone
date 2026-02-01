'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X, Loader2, CheckCircle2, ArrowRight, ChevronDown, Clock, Shield, MessageCircle } from "lucide-react"

interface MissionRequestFormProps {
    businessId: string
    freelanceId: string
    freelanceName: string
    hourlyRate?: number | null
    currency?: string
    onClose: () => void
    onSuccess?: () => void
}

export function MissionRequestForm({ 
    businessId, 
    freelanceId, 
    freelanceName,
    hourlyRate,
    currency = 'EUR',
    onClose,
    onSuccess
}: MissionRequestFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showOptional, setShowOptional] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()
    
    const [formData, setFormData] = useState({
        description: '',
        urgency: 'ASAP' as 'ASAP' | 'THIS_WEEK' | 'LATER',
        // Champs optionnels (cachés par défaut)
        budget: '',
        currency: 'EUR',
        budgetType: 'TO_DISCUSS' as 'FIXED' | 'HOURLY' | 'DAILY' | 'TO_DISCUSS',
        deadline: '',
    })

    // Load draft from storage if exists
    useEffect(() => {
        const savedDraft = sessionStorage.getItem(`mission_draft_${businessId}`)
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft)
                setFormData(prev => ({ ...prev, ...parsed }))
            } catch (e) {
                console.error("Failed to load draft")
            }
        }
    }, [businessId]) 

    const currencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'XOF' ? 'FCFA' : '€'

    const urgencyOptions = [
        { value: 'ASAP', label: 'Dès que possible', icon: '⚡' },
        { value: 'THIS_WEEK', label: 'Cette semaine', icon: '📅' },
        { value: 'LATER', label: 'Plus tard / Pas urgent', icon: '🕐' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validation minimale
        if (!formData.description.trim() || formData.description.length < 10) {
            setError("Décrivez votre besoin en quelques mots (minimum 10 caractères)")
            return
        }

        // If not logged in, save draft and redirect
        if (!session) {
            sessionStorage.setItem(`mission_draft_${businessId}`, JSON.stringify(formData))
            const callbackUrl = encodeURIComponent(window.location.href)
            router.push(`/login?callbackUrl=${callbackUrl}`)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/missions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.description.substring(0, 60),
                    description: formData.description,
                    urgency: formData.urgency,
                    budget: formData.budget ? parseFloat(formData.budget) : undefined,
                    budgetType: formData.budgetType,
                    currency: formData.currency,
                    deadline: formData.deadline || undefined,
                    clientName: session?.user?.name || 'Client',
                    clientEmail: session?.user?.email,
                    businessId,
                    freelanceId
                })
            })

            const text = await res.text();
            let data;
            
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Non-JSON Response:", text);
                throw new Error(`Erreur serveur. Réessayez dans quelques instants.`);
            }

            if (!res.ok) {
                throw new Error(data.message || `Une erreur est survenue. Réessayez.`)
            }

            // Clear draft after success
            sessionStorage.removeItem(`mission_draft_${businessId}`)
            
            setSuccess(true)
            onSuccess?.()

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // ====== SUCCESS SCREEN ======
    if (success) {
        return (
            <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    {/* Success Animation */}
                    <div className="relative mb-8">
                        <div className="w-24 h-24 bg-[#34E0A1]/20 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-[#34E0A1] rounded-full flex items-center justify-center animate-in zoom-in duration-500 delay-150">
                                <CheckCircle2 className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <div className="absolute inset-0 w-24 h-24 mx-auto bg-[#34E0A1]/30 rounded-full animate-ping opacity-20" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        Demande envoyée ! 🎉
                    </h2>
                    
                    <p className="text-slate-600 text-lg mb-8">
                        <strong>{freelanceName}</strong> va recevoir votre message et vous répondra très vite.
                    </p>

                    <div className="bg-slate-50 rounded-2xl p-5 mb-8 text-left space-y-3">
                        <div className="flex items-center gap-3 text-slate-700">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                <MessageCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-sm">Vous serez notifié par email dès qu&apos;il répond</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                <Shield className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-sm">Paiement sécurisé, vous ne payez qu&apos;après validation</span>
                        </div>
                    </div>

                    <Button 
                        onClick={onClose}
                        className="w-full h-14 bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold text-lg rounded-2xl"
                    >
                        Retour au profil
                    </Button>
                </div>
            </div>
        )
    }

    // ====== MAIN FORM ======
    return (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden">
            
            {/* ====== HEADER ====== */}
            <header className="shrink-0 px-4 py-4 sm:px-6 flex items-center justify-between border-b border-slate-100 bg-white">
                <button 
                    onClick={onClose} 
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
                    aria-label="Fermer"
                >
                    <X className="h-6 w-6 text-slate-500" />
                </button>
                
                <div className="text-center flex-1">
                    <p className="text-sm text-slate-500">Demande pour</p>
                    <p className="font-bold text-slate-900 truncate">{freelanceName}</p>
                </div>

                <div className="w-10" /> {/* Spacer for centering */}
            </header>

            {/* ====== SCROLLABLE CONTENT ====== */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
                <form id="mission-form" onSubmit={handleSubmit} className="p-5 sm:p-8 max-w-lg mx-auto">
                    
                    {/* ====== HERO MESSAGE ====== */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                            Décrivez votre besoin
                        </h1>
                        <p className="text-slate-500">
                            Rapide, gratuit et sans engagement
                        </p>
                    </div>

                    {/* ====== ERROR MESSAGE ====== */}
                    {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-6 animate-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {/* ====== TJM INFO (si disponible) ====== */}
                    {hourlyRate && (
                        <div className="bg-[#34E0A1]/10 rounded-2xl p-4 mb-6 flex items-center gap-3">
                            <div className="text-2xl">💰</div>
                            <div>
                                <p className="font-bold text-slate-900">{hourlyRate} {currencySymbol} / jour</p>
                                <p className="text-xs text-slate-600">Tarif indicatif de base pour votre devis</p>
                            </div>
                        </div>
                    )}

                    {/* ====== CHAMP 1: DESCRIPTION (OBLIGATOIRE) ====== */}
                    <div className="mb-6">
                        <label className="block text-base font-semibold text-slate-900 mb-3">
                            En quelques mots, que recherchez-vous ? <span className="text-red-500">*</span>
                        </label>
                        <Textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ex: J'ai besoin d'un logo moderne pour ma nouvelle entreprise..."
                            rows={4}
                            required
                            className="resize-none text-base rounded-xl border-slate-200 focus:border-[#34E0A1] focus:ring-[#34E0A1] placeholder:text-slate-400"
                        />
                        <p className="text-xs text-slate-400 mt-2">
                            Pas besoin d&apos;être exhaustif, le freelance vous recontactera pour les détails.
                        </p>
                    </div>

                    {/* ====== CHAMP 2: URGENCY (OBLIGATOIRE) ====== */}
                    <div className="mb-6">
                        <label className="block text-base font-semibold text-slate-900 mb-3">
                            Quand souhaitez-vous être contacté ?
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                            {urgencyOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, urgency: option.value as any })}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                                        formData.urgency === option.value 
                                            ? 'border-[#34E0A1] bg-[#34E0A1]/5' 
                                            : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                                >
                                    <span className="text-xl">{option.icon}</span>
                                    <span className={`font-medium ${formData.urgency === option.value ? 'text-slate-900' : 'text-slate-700'}`}>
                                        {option.label}
                                    </span>
                                    {formData.urgency === option.value && (
                                        <CheckCircle2 className="h-5 w-5 text-[#34E0A1] ml-auto" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ====== TOGGLE OPTIONNEL ====== */}
                    <button
                        type="button"
                        onClick={() => setShowOptional(!showOptional)}
                        className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 text-sm py-3 mb-4 transition-colors"
                    >
                        <span>{showOptional ? 'Masquer les options' : 'Ajouter des précisions (optionnel)'}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showOptional ? 'rotate-180' : ''}`} />
                    </button>

                    {/* ====== CHAMPS OPTIONNELS ====== */}
                    {showOptional && (
                        <div className="space-y-5 p-5 bg-slate-50 rounded-2xl mb-6 animate-in slide-in-from-top-2">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Informations complémentaires</p>
                            
                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Budget estimé
                                </label>
                                <div className="flex gap-2">
                                    <select 
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="h-12 px-3 border border-slate-200 rounded-xl text-sm bg-white font-medium"
                                    >
                                        <option value="EUR">€</option>
                                        <option value="USD">$</option>
                                        <option value="XOF">FCFA</option>
                                    </select>
                                    <input 
                                        type="number"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        placeholder="Montant"
                                        className="flex-1 h-12 px-4 border border-slate-200 rounded-xl text-sm"
                                    />
                                    <select 
                                        value={formData.budgetType}
                                        onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as any })}
                                        className="h-12 px-3 border border-slate-200 rounded-xl text-sm bg-white"
                                    >
                                        <option value="TO_DISCUSS">À définir</option>
                                        <option value="FIXED">Forfait</option>
                                        <option value="DAILY">/jour</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date limite */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Date limite souhaitée
                                </label>
                                <input 
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {/* ====== REASSURANCE ====== */}
                    {!session && (
                        <div className="bg-blue-50 rounded-2xl p-4 mb-6 flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                <Shield className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">Demande rapide et sans engagement</p>
                                <p className="text-slate-600 text-xs mt-1">Créez un compte à l&apos;étape suivante pour recevoir la réponse.</p>
                            </div>
                        </div>
                    )}

                </form>
            </div>

            {/* ====== FOOTER CTA ====== */}
            <footer className="shrink-0 p-4 sm:p-6 border-t border-slate-100 bg-white safe-area-bottom">
                <div className="max-w-lg mx-auto">
                    <Button 
                        type="submit" 
                        form="mission-form"
                        disabled={isLoading || !formData.description.trim()}
                        className="w-full h-14 bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold text-lg rounded-2xl shadow-lg shadow-[#34E0A1]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                Envoyer ma demande
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                    
                    {/* Micro-réassurance */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Réponse sous 24h
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            100% gratuit
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
