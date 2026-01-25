"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Clock, Euro } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const ServiceSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Le prix doit être positif")),
  duration: z.preprocess((val) => val ? Number(val) : undefined, z.number().optional()),
  type: z.enum(['SERVICE', 'CLASS', 'TICKET', 'MENU_ITEM', 'ROOM', 'RESERVATION']).default('SERVICE'),
})

type Service = {
  id: string
  name: string
  description?: string
  price: number
  duration?: number
  type: string
}

export function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 30,
      type: "SERVICE"
    }
  })

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Error fetching services", error)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const onSubmit = async (values: z.infer<typeof ServiceSchema>) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (res.ok) {
        form.reset()
        fetchServices()
      }
    } catch (error) {
      console.error("Error creating service", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce service ?")) return

    try {
        const res = await fetch(`/api/services/${id}`, {
            method: 'DELETE'
        })
        if (res.ok) {
            setServices(services.filter(s => s.id !== id))
        }
    } catch (error) {
        console.error("Error deleting service", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold mb-4 text-slate-900">Ajouter un service / produit</h3>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium">Nom de la prestation</label>
                <Input {...form.register("name")} placeholder="Ex: Coupe Homme, Dîner romantique..." />
                {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select {...form.register("type")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="SERVICE">Service (Coiffeur, Réparation...)</option>
                    <option value="RESERVATION">Réservation (Table, Salle...)</option>
                    <option value="ROOM">Hébergement (Chambre, Gîte...)</option>
                    <option value="TICKET">Billet (Concert, Entrée...)</option>
                    <option value="CLASS">Cours (Yoga, Cuisine...)</option>
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium">Prix (€)</label>
                <Input type="number" step="0.01" {...form.register("price")} />
                {form.formState.errors.price && <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>}
             </div>

             <div className="space-y-2">
                <label className="text-sm font-medium">Durée (minutes, optionnel)</label>
                <Input type="number" {...form.register("duration")} />
             </div>

             <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea {...form.register("description")} placeholder="Détails de la prestation..." />
             </div>

             <div className="md:col-span-2">
                <Button type="submit" disabled={isLoading} className="w-full bg-[#34E0A1] hover:bg-[#2dc990] text-slate-900 font-bold">
                    {isLoading ? "Ajout..." : <><Plus className="w-4 h-4 mr-2" /> Ajouter la prestation</>}
                </Button>
             </div>
        </form>
      </div>

      <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Vos prestations actives</h3>
          {services.length === 0 ? (
              <p className="text-slate-500 italic">Aucun service configuré pour le moment.</p>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(service => (
                      <div key={service.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-start shadow-sm">
                          <div>
                              <h4 className="font-bold text-slate-900">{service.name}</h4>
                              <p className="text-sm text-slate-500 line-clamp-2">{service.description}</p>
                              <div className="flex gap-3 mt-2 text-xs font-medium text-slate-700">
                                  <span className="flex items-center"><Euro className="w-3 h-3 mr-1"/> {service.price}€</span>
                                  {service.duration && <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {service.duration} min</span>}
                                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-500">{service.type}</span>
                              </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(service.id)}>
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  )
}
