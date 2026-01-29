'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Send, Loader2, Calendar, Briefcase, Euro, Clock, User, Mail, Phone, Building } from "lucide-react"

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
    const { data: session } = useSession()
    const router = useRouter()
    
    const [formData, setFormData] = useState({
        // Project info
        title: '',
        description: '',
        budget: '',
        budgetType: 'TO_DISCUSS' as 'FIXED' | 'HOURLY' | 'DAILY' | 'TO_DISCUSS',
        deadline: '',
        duration: ''
    })

    // Load draft from storage if exists
    useEffect(() => {
        const savedDraft = sessionStorage.getItem(`mission_draft_${businessId}`)
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft)
                setFormData(parsed)
            } catch (e) {
                console.error("Failed to load draft")
            }
        }
    }, [businessId]) 

    const currencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'XOF' ? 'FCFA' : '€'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // If not logged in, save draft and redirect
        if (!session) {
            sessionStorage.setItem(`mission_draft_${businessId}`, JSON.stringify(formData))
            // Redirect to register/login with callback
            const callbackUrl = encodeURIComponent(window.location.pathname)
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
                    ...formData,
                    clientName: session?.user?.name || 'Client',
                    clientEmail: session?.user?.email,
                    budget: formData.budget ? parseFloat(formData.budget) : undefined,
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
                throw new Error(`Erreur serveur (${res.status}): La réponse n'est pas au format valide. Réessayez.`);
            }

            if (!res.ok) {
                throw new Error(data.message || `Erreur (${res.status}): Une erreur est survenue`)
            }

            // Clear draft after success
            sessionStorage.removeItem(`mission_draft_${businessId}`)
            
            setSuccess(true)
            onSuccess?.()
            
            // Close after showing success message
            setTimeout(() => {
                onClose()
            }, 3000)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Demande envoyée !</h2>
                    <p className="text-slate-600 mb-2">
                        Votre demande a été envoyée à <strong>{freelanceName}</strong>.
                    </p>
                    <p className="text-sm text-slate-500">
                        Vous recevrez une réponse par email à <strong>{formData.clientEmail}</strong>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Demande de devis</h2>
                        <p className="text-base text-slate-500 mt-1">Votre brief pour <span className="font-semibold text-slate-900">{freelanceName}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
                        <X className="h-6 w-6 text-slate-400 group-hover:text-slate-900" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-10">
                    {error && (
                        <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl text-base font-medium flex items-center gap-3 animate-in slide-in-from-top-2">
                            <span className="bg-red-200 p-1 rounded-full"><X className="h-4 w-4" /></span>
                            {error}
                        </div>
                    )}

                    {/* Logged User Info */}
                    {session ? (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <span className="font-bold text-blue-700 text-lg">
                                    {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Demande envoyée par</p>
                                <p className="text-slate-600">{session?.user?.name} ({session?.user?.email})</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <User className="h-5 w-5 text-amber-700" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Mode invité</p>
                                <p className="text-slate-600 text-sm">Vous pourrez vous connecter ou créer un compte à l'étape suivante pour valider l'envoi.</p>
                            </div>
                        </div>
                    )}

                    <div className="h-px bg-slate-100" />

                    {/* Freelance Rate Info */}
                    {hourlyRate && (
                        <div className="bg-[#34E0A1]/10 border border-[#34E0A1]/20 rounded-xl p-5 flex items-start gap-4">
                            <div className="p-2 bg-[#34E0A1]/20 rounded-full shrink-0">
                                <Euro className="h-5 w-5 text-[#2bc98e]" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-lg">TJM Indicatif : {hourlyRate} {currencySymbol} / jour</p>
                                <p className="text-slate-600 mt-1 text-sm">Ce tarif est donné à titre indicatif et peut varier selon la complexité.</p>
                            </div>
                        </div>
                    )}

                    {/* Project Details Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-lg font-bold text-slate-900">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-purple-600" />
                            </div>
                            <h3>Votre projet</h3>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-base font-semibold text-slate-700">Titre du projet <span className="text-red-500">*</span></label>
                            <Input 
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ex: Refonte complète de site e-commerce"
                                required
                                className="font-medium"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-base font-semibold text-slate-700">Description détaillée <span className="text-red-500">*</span></label>
                            <Textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Décrivez le contexte, vos objectifs, les livrables attendus et les contraintes techniques..."
                                rows={6}
                                required
                                className="resize-none"
                            />
                            <div className="flex justify-between text-sm text-slate-500 px-1">
                                <span>Minimum 20 caractères</span>
                                <span>Plus c'est précis, mieux c'est</span>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                                    Budget estimé
                                </label>
                                <div className="flex gap-3">
                                    <Input 
                                        type="number"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        placeholder="Montant"
                                        className="flex-1"
                                    />
                                    <div className="relative w-40">
                                        <select 
                                            value={formData.budgetType}
                                            onChange={(e) => setFormData({ ...formData, budgetType: e.target.value as any })}
                                            className="w-full h-12 pl-3 pr-8 border border-slate-200 rounded-lg text-base bg-white appearance-none focus:ring-2 focus:ring-[#34E0A1] focus:outline-none cursor-pointer font-medium text-slate-700"
                                        >
                                            <option value="FIXED">Forfait total</option>
                                            <option value="DAILY">Par jour</option>
                                            <option value="HOURLY">Par heure</option>
                                            <option value="TO_DISCUSS">À définir</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                                    Date limite
                                </label>
                                <Input 
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-8 border-t border-slate-100 flex gap-4 sticky bottom-0 bg-white pb-2">
                        <Button type="button" variant="outline" size="lg" onClick={onClose} className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-bold">
                            Annuler
                        </Button>
                        <Button 
                            type="submit" 
                            size="lg"
                            disabled={isLoading}
                            className={`flex-[2] font-bold text-lg rounded-xl shadow-lg transition-all hover:-translate-y-0.5 ${!session ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 shadow-[#34E0A1]/20 hover:shadow-xl hover:shadow-[#34E0A1]/30'}`}
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi...</>
                            ) : (
                                <>{!session ? 'Se connecter & Envoyer' : 'Envoyer la demande'} <Send className="ml-2 h-5 w-5" /></>
                            )}
                        </Button>
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            ) : (
                                <Send className="h-5 w-5 mr-3" />
                            )}
                            Envoyer ma demande
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
