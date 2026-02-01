'use client';

import { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Send,
  Download,
  Eye,
  Euro,
  Calendar,
  X,
  Trash2,
  CheckCircle
} from 'lucide-react';

interface InvoicesModuleProps {
  invoices: any[];
  clients: any[];
  projects: any[];
  userId: string;
}

export default function InvoicesModule({ invoices, clients, projects, userId }: InvoicesModuleProps) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localInvoices, setLocalInvoices] = useState(invoices);
  const [items, setItems] = useState<Array<{ description: string; quantity: number; unitPrice: number }>>([
    { description: '', quantity: 1, unitPrice: 0 }
  ]);

  const filteredInvoices = localInvoices.filter(i => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleCreateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const subtotal = calculateSubtotal();
    const taxRate = parseFloat(formData.get('taxRate') as string) || 20;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const data = {
      number: formData.get('number'),
      clientId: formData.get('clientId') || null,
      projectId: formData.get('projectId') || null,
      dueDate: formData.get('dueDate') || null,
      notes: formData.get('notes') || null,
      taxRate,
      subtotal,
      taxAmount,
      total,
      items: items.filter(i => i.description && i.unitPrice > 0).map(i => ({
        ...i,
        total: i.quantity * i.unitPrice
      })),
    };

    try {
      const res = await fetch('/api/workspace/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newInvoice = await res.json();
        setLocalInvoices([newInvoice, ...localInvoices]);
        setShowForm(false);
        setItems([{ description: '', quantity: 1, unitPrice: 0 }]);
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const res = await fetch(`/api/workspace/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setLocalInvoices(localInvoices.map(i => 
          i.id === invoiceId ? { ...i, status } : i
        ));
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    DRAFT: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Brouillon' },
    SENT: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Envoyée' },
    VIEWED: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Vue' },
    PAID: { bg: 'bg-green-100', text: 'text-green-700', label: 'Payée' },
    OVERDUE: { bg: 'bg-red-100', text: 'text-red-700', label: 'En retard' },
    CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Annulée' },
  };

  // Stats
  const totalPaid = localInvoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.total, 0);
  const totalPending = localInvoices.filter(i => ['SENT', 'VIEWED'].includes(i.status)).reduce((sum, i) => sum + i.total, 0);
  const totalOverdue = localInvoices.filter(i => i.status === 'OVERDUE').reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Payé</p>
          <p className="text-2xl font-bold text-green-700">{totalPaid.toLocaleString()}€</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">En attente</p>
          <p className="text-2xl font-bold text-blue-700">{totalPending.toLocaleString()}€</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <p className="text-sm text-red-600 font-medium">En retard</p>
          <p className="text-2xl font-bold text-red-700">{totalOverdue.toLocaleString()}€</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Facturation</h2>
          <p className="text-gray-500">Créez et gérez vos devis et factures</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouvelle facture
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'DRAFT', 'SENT', 'PAID', 'OVERDUE'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === status
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Toutes' : statusConfig[status]?.label || status}
          </button>
        ))}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Nouvelle facture</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de facture *
                  </label>
                  <input
                    type="text"
                    name="number"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="FAC-2026-001"
                    defaultValue={`FAC-${new Date().getFullYear()}-${String(localInvoices.length + 1).padStart(3, '0')}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'échéance
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <select
                    name="clientId"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} {client.company && `(${client.company})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Projet
                  </label>
                  <select
                    name="projectId"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Aucun projet</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lignes de facturation
                </label>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="number"
                        placeholder="Qté"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="number"
                        placeholder="Prix"
                        step="0.01"
                        min="0"
                        value={item.unitPrice || ''}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="w-24 px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-right">
                        {(item.quantity * item.unitPrice).toFixed(2)}€
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une ligne
                </button>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Sous-total</span>
                      <span className="font-medium">{calculateSubtotal().toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-sm items-center gap-2">
                      <span className="text-gray-500">TVA</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="taxRate"
                          defaultValue="20"
                          min="0"
                          max="100"
                          className="w-16 px-2 py-1 border rounded text-sm text-right"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total TTC</span>
                      <span>{(calculateSubtotal() * 1.2).toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Notes pour le client..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Création...' : 'Créer la facture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune facture</h3>
          <p className="text-gray-500 mb-4">Créez votre première facture pour commencer</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            Créer une facture
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-4 py-3 font-medium">N° Facture</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Montant</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Échéance</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{invoice.number}</td>
                    <td className="px-4 py-3 text-gray-600">{invoice.client?.name || '-'}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{invoice.total.toLocaleString()}€</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[invoice.status]?.bg} ${statusConfig[invoice.status]?.text}`}>
                        {statusConfig[invoice.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {invoice.status === 'DRAFT' && (
                          <button
                            onClick={() => updateInvoiceStatus(invoice.id, 'SENT')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Envoyer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        {['SENT', 'VIEWED', 'OVERDUE'].includes(invoice.status) && (
                          <button
                            onClick={() => updateInvoiceStatus(invoice.id, 'PAID')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Marquer payée"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"
                          title="Télécharger PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
