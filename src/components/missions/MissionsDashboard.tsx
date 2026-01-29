'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
    Inbox, Send, Clock, CheckCircle, XCircle, AlertCircle, 
    ChevronRight, Euro, Calendar, User, Loader2, MessageSquare,
    Eye, FileText, ArrowRight
} from "lucide-react"

interface Mission {
    id: string
    title: string
    description: string
    budget: number | null
    budgetType: string
    deadline: string | null
    duration: string | null
    status: string
    freelanceMessage: string | null
    proposedPrice: number | null
    proposedDeadline: string | null
    respondedAt: string | null
    createdAt: string
    // Client info - can be from User relation or direct fields
    clientId: string | null
    clientName: string
    clientEmail: string
    clientPhone: string | null
    clientCompany: string | null
    client: { id: string; name: string | null; email: string } | null
    freelance: { id: string; name: string | null; email: string }
    business: { id: string; name: string; imageUrl: string | null }
}

interface MissionsDashboardProps {
    type: 'freelancer' | 'client'
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    VIEWED: { label: 'Vue', color: 'bg-blue-100 text-blue-700', icon: Eye },
    PROPOSAL: { label: 'Devis envoyé', color: 'bg-purple-100 text-purple-700', icon: FileText },
    ACCEPTED: { label: 'Acceptée', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    REJECTED: { label: 'Refusée', color: 'bg-red-100 text-red-700', icon: XCircle },
    CANCELLED: { label: 'Annulée', color: 'bg-slate-100 text-slate-700', icon: XCircle },
    IN_PROGRESS: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: ArrowRight },
    DELIVERED: { label: 'Livrée', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
    COMPLETED: { label: 'Terminée', color: 'bg-green-100 text-green-700', icon: CheckCircle },
}

const budgetTypeLabels: Record<string, string> = {
    FIXED: 'Forfait',
    HOURLY: 'Horaire',
    DAILY: 'TJM',
    TO_DISCUSS: 'À discuter'
}

export function MissionsDashboard({ type }: MissionsDashboardProps) {
    const [missions, setMissions] = useState<Mission[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        fetchMissions()
    }, [type])

    const fetchMissions = async () => {
        setLoading(true)
        try {
            const endpoint = type === 'freelancer' ? '/api/missions?type=received' : '/api/missions?type=sent'
            const res = await fetch(endpoint)
            const data = await res.json()
            if (res.ok) {
                setMissions(data.missions)
            }
        } catch (error) {
            console.error('Error fetching missions:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredMissions = filter === 'all' 
        ? missions 
        : missions.filter(m => m.status === filter)

    const counts = {
        all: missions.length,
        PENDING: missions.filter(m => m.status === 'PENDING' || m.status === 'VIEWED').length,
        PROPOSAL: missions.filter(m => m.status === 'PROPOSAL').length,
        ACCEPTED: missions.filter(m => m.status === 'ACCEPTED' || m.status === 'IN_PROGRESS').length,
        COMPLETED: missions.filter(m => m.status === 'COMPLETED').length,
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { key: 'all', label: 'Toutes les demandes', count: counts.all },
                    { key: 'PENDING', label: 'En attente', count: counts.PENDING },
                    { key: 'PROPOSAL', label: 'Devis envoyés', count: counts.PROPOSAL },
                    { key: 'ACCEPTED', label: 'Acceptées', count: counts.ACCEPTED },
                    { key: 'COMPLETED', label: 'Terminées', count: counts.COMPLETED },
                ].map(stat => (
                    <button
                        key={stat.key}
                        onClick={() => setFilter(stat.key)}
                        className={`p-5 rounded-2xl border transition-all text-left group ${
                            filter === stat.key 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-[1.02]' 
                                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                        <div className="text-3xl font-bold mb-1">{stat.count}</div>
                        <div className={`text-sm font-medium ${filter === stat.key ? 'text-slate-300' : 'text-slate-500'}`}>{stat.label}</div>
                    </button>
                ))}
            </div>

            {/* Mission List */}
            {filteredMissions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Inbox className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune demande trouvée</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        {type === 'client' 
                            ? "Commencez par explorer les profils freelances et envoyez des demandes de devis."
                            : "Vous n'avez pas encore reçu de demande. Complétez votre profil pour être plus visible."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredMissions.map(mission => (
                        <MissionCard 
                            key={mission.id} 
                            mission={mission} 
                            type={type}
                            onSelect={() => setSelectedMission(mission)}
                            onUpdate={fetchMissions}
                        />
                    ))}
                </div>
            )}

            {/* Mission Detail Modal */}
            {selectedMission && (
                <MissionDetailModal 
                    mission={selectedMission}
                    type={type}
                    onClose={() => setSelectedMission(null)}
                    onUpdate={() => {
                        fetchMissions()
                        setSelectedMission(null)
                    }}
                />
            )}
        </div>
    )
}

function MissionCard({ 
    mission, 
    type, 
    onSelect,
    onUpdate 
}: { 
    mission: Mission
    type: 'freelancer' | 'client'
    onSelect: () => void
    onUpdate: () => void
}) {
    const status = statusConfig[mission.status] || statusConfig.PENDING
    const StatusIcon = status.icon

    return (
        <div 
            onClick={onSelect}
            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide ${status.color}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            {new Date(mission.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </span>
                    </div>

                    <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{mission.title}</h3>
                    
                    <p className="text-slate-600 text-base line-clamp-2 mb-4 leading-relaxed">{mission.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-700 font-medium">
                            <User className="h-4 w-4 text-slate-400" />
                            {type === 'freelancer' ? (mission.clientName || mission.clientEmail) : mission.business.name}
                        </div>
                        
                        {mission.budget && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg text-green-700 font-bold">
                                <Euro className="h-4 w-4" />
                                {mission.budget}€ <span className="font-normal opacity-80">({budgetTypeLabels[mission.budgetType]})</span>
                            </div>
                        )}
                        
                        {mission.deadline && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg text-orange-700 font-medium">
                                <Calendar className="h-4 w-4" />
                                {new Date(mission.deadline).toLocaleDateString('fr-FR')}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#34E0A1] group-hover:text-slate-900 transition-all">
                    <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-slate-900" />
                </div>
            </div>
        </div>
    )
}

// Simple Chat Component
function MissionChat({ missionId, currentUserId }: { missionId: string, currentUserId?: string }) {
    const [messages, setMessages] = useState<{ id: string, content: string, senderId: string, sender: { id: string, name: string }, createdAt: string }[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/missions/${missionId}/messages`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Failed to fetch messages', error)
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        try {
            const res = await fetch(`/api/missions/${missionId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage })
            })
            
            if (res.ok) {
                setNewMessage('')
                fetchMessages()
            }
        } catch (error) {
            console.error('Failed to send message', error)
        }
    }

    useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 5000) // Poll every 5s
        return () => clearInterval(interval)
    }, [missionId])

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[400px]">
             <div className="bg-white p-4 border-b border-slate-200 font-bold text-slate-900 flex items-center gap-2 shadow-sm">
                <MessageSquare className="h-4 w-4 text-[#34E0A1]" />
                Discussion
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {loading && messages.length === 0 ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-slate-400 py-10 text-sm italic">
                        Aucun message. Commencez la discussion !
                    </div>
                ) : (
                    messages.map(msg => {
                        const isMe = msg.senderId === currentUserId
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                                    isMe 
                                    ? 'bg-slate-900 text-white rounded-br-none' 
                                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                                }`}>
                                    <div className={`flex justify-between items-baseline mb-1 gap-4 border-b pb-1 ${isMe ? 'border-slate-700' : 'border-slate-100'}`}>
                                        <span className={`font-bold text-xs ${isMe ? 'text-slate-300' : 'text-slate-900'}`}>{msg.sender.name || 'Utilisateur'}</span>
                                        <span className={`text-[10px] ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        )
                    })
                )}
             </div>

             <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <Input 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 border-slate-200 focus-visible:ring-[#34E0A1]"
                />
                <Button type="submit" size="icon" className="bg-[#34E0A1] text-slate-900 hover:bg-[#2bc98e] font-bold">
                    <Send className="h-4 w-4" />
                </Button>
             </form>
        </div>
    )
}

function MissionDetailModal({ 
    mission, 
    type,
    onClose, 
    onUpdate 
}: { 
    mission: Mission
    type: 'freelancer' | 'client'
    onClose: () => void
    onUpdate: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [showProposalForm, setShowProposalForm] = useState(false)
    const [proposal, setProposal] = useState({
        message: '',
        price: mission.budget?.toString() || '',
        deadline: mission.deadline ? mission.deadline.split('T')[0] : ''
    })

    const status = statusConfig[mission.status] || statusConfig.PENDING
    const StatusIcon = status.icon

    const handleAction = async (action: string, data?: any) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/missions/${mission.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...data })
            })

            if (res.ok) {
                onUpdate()
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleProposalSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleAction('proposal', {
            freelanceMessage: proposal.message,
            proposedPrice: proposal.price ? parseFloat(proposal.price) : undefined,
            proposedDeadline: proposal.deadline || undefined
        })
    }

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 uppercase tracking-wide ${status.color}`}>
                            <StatusIcon className="h-4 w-4" />
                            {status.label}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-slate-500 font-medium">Ref: #{mission.id.slice(-6)}</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
                        <XCircle className="h-8 w-8 text-slate-300 group-hover:text-slate-900 transition-colors" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Title & Description */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{mission.title}</h2>
                        <p className="text-slate-600 whitespace-pre-wrap">{mission.description}</p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Client</p>
                            <p className="font-bold text-slate-900">{mission.clientName}</p>
                            <p className="text-sm text-slate-600">{mission.clientEmail}</p>
                            {mission.clientPhone && (
                                <p className="text-sm text-slate-600">{mission.clientPhone}</p>
                            )}
                            {mission.clientCompany && (
                                <p className="text-sm text-slate-500">{mission.clientCompany}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Budget</p>
                            <p className="font-bold text-slate-900">
                                {mission.budget ? `${mission.budget}€ (${budgetTypeLabels[mission.budgetType]})` : 'À discuter'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Durée</p>
                            <p className="font-bold text-slate-900">{mission.duration || 'Non spécifiée'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Date limite</p>
                            <p className="font-bold text-slate-900">
                                {mission.deadline ? new Date(mission.deadline).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                            </p>
                        </div>
                    </div>

                    {/* Proposal Response (if exists) */}
                    {mission.proposedPrice && (
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                            <h3 className="font-bold text-purple-900 mb-2">Proposition du freelance</h3>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                    <p className="text-xs text-purple-600">Prix proposé</p>
                                    <p className="font-bold text-purple-900">{mission.proposedPrice}€</p>
                                </div>
                                {mission.proposedDeadline && (
                                    <div>
                                        <p className="text-xs text-purple-600">Livraison proposée</p>
                                        <p className="font-bold text-purple-900">
                                            {new Date(mission.proposedDeadline).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {mission.freelanceMessage && (
                                <p className="text-sm text-purple-800">{mission.freelanceMessage}</p>
                            )}
                        </div>
                    )}

                    {/* Proposal Form (for freelancer) */}
                    {type === 'freelancer' && (mission.status === 'PENDING' || mission.status === 'VIEWED') && (
                        <>
                            {!showProposalForm ? (
                                <div className="flex gap-3">
                                    <Button 
                                        onClick={() => setShowProposalForm(true)}
                                        className="flex-1 bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Envoyer une proposition
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => handleAction('reject')}
                                        disabled={loading}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        Refuser
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleProposalSubmit} className="space-y-4 p-4 bg-slate-50 rounded-xl">
                                    <h3 className="font-bold text-slate-900">Votre proposition</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Prix proposé (€)</label>
                                            <Input 
                                                type="number"
                                                value={proposal.price}
                                                onChange={e => setProposal({...proposal, price: e.target.value})}
                                                placeholder="Ex: 2000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Date de livraison</label>
                                            <Input 
                                                type="date"
                                                value={proposal.deadline}
                                                onChange={e => setProposal({...proposal, deadline: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Message</label>
                                        <Textarea 
                                            value={proposal.message}
                                            onChange={e => setProposal({...proposal, message: e.target.value})}
                                            placeholder="Présentez votre approche, vos disponibilités..."
                                            rows={4}
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <Button type="button" variant="outline" onClick={() => setShowProposalForm(false)}>
                                            Annuler
                                        </Button>
                                        <Button 
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold"
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Envoyer'}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}

                    {/* Chat Section - Always visible if mission exists */}
                    <div className="pt-4 border-t border-slate-100">
                        <MissionChat missionId={mission.id} currentUserId={type === 'client' ? mission.clientId || undefined : mission.freelance.id} />
                    </div>

                    {/* Client Actions */}
                    {type === 'client' && mission.status === 'PROPOSAL' && (
                        <div className="flex gap-3">
                            <Button 
                                onClick={() => handleAction('accept')}
                                disabled={loading}
                                className="flex-1 bg-[#34E0A1] hover:bg-[#2bc98e] text-slate-900 font-bold"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accepter la proposition
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => handleAction('cancel')}
                                disabled={loading}
                            >
                                Annuler
                            </Button>
                        </div>
                    )}

                    {/* Progress Actions */}
                    {mission.status === 'ACCEPTED' && type === 'client' && (
                        <div className="space-y-3">
                             <Button 
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        const res = await fetch(`/api/missions/${mission.id}/pay`, { method: 'POST' });
                                        if (!res.ok) throw new Error('Payment init failed');
                                        const data = await res.json();
                                        if (data.url) window.location.href = data.url;
                                    } catch(e) { console.error(e); } finally { setLoading(false); }
                                }}
                                disabled={loading}
                                className="w-full bg-[#635BFF] hover:bg-[#534be0] text-white font-bold"
                            >
                                <Euro className="h-4 w-4 mr-2" />
                                Payer et bloquer les fonds (Escrow)
                            </Button>
                            <p className="text-xs text-center text-slate-500 bg-slate-50 p-2 rounded-lg">
                                🔒 L'argent est sécurisé par la plateforme et ne sera versé au freelance qu'après votre validation finale.
                            </p>
                        </div>
                    )}

                    {mission.status === 'ACCEPTED' && type === 'freelancer' && (
                         <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-center space-y-1">
                            <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                            <p className="font-bold">En attente de paiement</p>
                            <p className="text-sm">Le client doit sécuriser les fonds avant le démarrage.</p>
                        </div>
                    )}

                    {mission.status === 'IN_PROGRESS' && type === 'freelancer' && (
                        <Button 
                            onClick={() => handleAction('deliver')}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white font-bold"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Livrer la mission
                        </Button>
                    )}

                    {mission.status === 'IN_PROGRESS' && type === 'client' && (
                         <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-center space-y-1">
                            <ArrowRight className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                            <p className="font-bold">Mission en cours</p>
                            <p className="text-sm">Le freelance travaille sur votre projet.</p>
                        </div>
                    )}
                    
                    {mission.status === 'DELIVERED' && type === 'client' && (
                        <div className="space-y-3">
                            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center mb-2 border border-emerald-100">
                                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                                <p className="font-bold">Mission livrée !</p>
                                <p className="text-sm">Vérifiez le travail livré par le freelance.</p>
                            </div>
                            <Button 
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        const res = await fetch(`/api/missions/${mission.id}/release`, { method: 'POST' });
                                        if (res.ok) {
                                            onUpdate();
                                            onClose();
                                        }
                                    } catch(e) { console.error(e); } finally { setLoading(false); }
                                }}
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
                            >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Valider et Libérer les fonds
                            </Button>
                            <p className="text-xs text-center text-slate-500">
                                Cette action tranférera définitivement les fonds au freelance.
                            </p>
                        </div>
                    )}

                    {mission.status === 'DELIVERED' && type === 'freelancer' && (
                         <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center space-y-1 border border-emerald-100">
                            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                            <p className="font-bold">En attente de validation</p>
                            <p className="text-sm">Le client doit valider la livraison pour débloquer le paiement.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
