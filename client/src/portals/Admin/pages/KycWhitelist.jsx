import { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '../../../context/AuthContext.jsx'
import Loader from '../../../components/UI/Loader.jsx'
import EmptyState from '../../../components/UI/EmptyState.jsx'

export default function KycWhitelist() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ type: 'nid', value: '', note: '', linkedNid: '' })
  const [adding, setAdding] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleting, setDeleting] = useState(null)

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API}/admin/kyc`)
      setEntries(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEntries() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setFormError('')
    setAdding(true)
    try {
      await axios.post(`${API}/admin/kyc`, {
        type: form.type,
        value: form.value,
        note: form.note,
        ...(form.type === 'license_plate' && form.linkedNid ? { linkedNid: form.linkedNid } : {}),
      })
      setForm({ type: 'nid', value: '', note: '', linkedNid: '' })
      fetchEntries()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add entry')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await axios.delete(`${API}/admin/kyc/${id}`)
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  const nidEntries = entries.filter(e => e.type === 'nid')
  const filtered = entries.filter(e => {
    const matchType = filter === 'all' || e.type === filter
    const matchSearch = !search
      || e.value.toLowerCase().includes(search.toLowerCase())
      || (e.note || '').toLowerCase().includes(search.toLowerCase())
      || (e.linked_nid || '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const nidCount   = entries.filter(e => e.type === 'nid').length
  const plateCount = entries.filter(e => e.type === 'license_plate').length

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="font-mono text-xs text-muted tracking-wider mb-1">ADMIN · KYC</div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">KYC Whitelist.</h1>
      <p className="text-sm text-muted mb-8">Approved NIDs and license plates. License plates must be linked to their owner's NID.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="p-4 bg-white border border-black/10 rounded-2xl">
          <div className="font-mono text-[11px] text-muted tracking-wider">TOTAL ENTRIES</div>
          <div className="text-3xl font-bold mt-1">{entries.length}</div>
        </div>
        <div className="p-4 bg-white border border-black/10 rounded-2xl">
          <div className="font-mono text-[11px] text-muted tracking-wider">NID ENTRIES</div>
          <div className="text-3xl font-bold mt-1">{nidCount}</div>
        </div>
        <div className="p-4 bg-lime border border-lime rounded-2xl">
          <div className="font-mono text-[11px] text-ink/60 tracking-wider">LICENSE PLATES</div>
          <div className="text-3xl font-bold mt-1">{plateCount}</div>
        </div>
      </div>

      {/* Add entry form */}
      <div className="bg-white border border-black/10 rounded-2xl p-6 mb-6">
        <div className="font-semibold text-sm mb-4">Add New Entry</div>
        {formError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{formError}</div>}
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value, linkedNid: '' }))}
              className="px-3 py-2.5 bg-paper border border-black/10 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ink/20 shrink-0"
            >
              <option value="nid">NID</option>
              <option value="license_plate">License Plate</option>
            </select>
            <input
              type="text" required
              value={form.value}
              onChange={e => setForm(f => ({ ...f, value: e.target.value.toUpperCase() }))}
              placeholder={form.type === 'nid' ? 'e.g. 1234567890' : 'e.g. DHK-1234'}
              className="flex-1 px-4 py-2.5 bg-paper border border-black/10 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            <input
              type="text"
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="Note (optional)"
              className="flex-1 px-4 py-2.5 bg-paper border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </div>
          {form.type === 'license_plate' && (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="font-mono text-[10px] text-muted tracking-wider block mb-1">LINKED NID (required)</label>
                {nidEntries.length > 0 ? (
                  <select
                    value={form.linkedNid}
                    onChange={e => setForm(f => ({ ...f, linkedNid: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 bg-paper border border-black/10 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ink/20"
                  >
                    <option value="">Select NID…</option>
                    {nidEntries.map(n => (
                      <option key={n.id} value={n.value}>{n.value}{n.note ? ` — ${n.note}` : ''}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text" required
                    value={form.linkedNid}
                    onChange={e => setForm(f => ({ ...f, linkedNid: e.target.value.toUpperCase() }))}
                    placeholder="Enter NID number"
                    className="w-full px-4 py-2.5 bg-paper border border-black/10 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-ink/20"
                  />
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button type="submit" disabled={adding}
              className="px-6 py-2.5 bg-ink text-paper rounded-xl text-sm font-semibold hover:bg-ink/90 disabled:opacity-50 transition-colors">
              {adding ? 'Adding…' : '+ Add'}
            </button>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-1 bg-paper2 rounded-xl p-1">
          {[['all', 'All'], ['nid', 'NID'], ['license_plate', 'License Plate']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all ${filter === val ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>
              {label}
            </button>
          ))}
        </div>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search value, note, or linked NID…"
          className="flex-1 px-4 py-2 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
      </div>

      {/* List */}
      {loading ? <Loader /> : filtered.length === 0 ? (
        <EmptyState message="No whitelist entries found" ctaText="Add an entry above" />
      ) : (
        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5">
                <th className="text-left px-5 py-3 font-mono text-[11px] text-muted tracking-wider">TYPE</th>
                <th className="text-left px-5 py-3 font-mono text-[11px] text-muted tracking-wider">VALUE</th>
                <th className="text-left px-5 py-3 font-mono text-[11px] text-muted tracking-wider hidden sm:table-cell">LINKED NID</th>
                <th className="text-left px-5 py-3 font-mono text-[11px] text-muted tracking-wider hidden md:table-cell">ADDED BY</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr key={entry.id} className={`border-b border-black/5 last:border-0 ${i % 2 === 0 ? '' : 'bg-paper/50'}`}>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider ${
                      entry.type === 'nid' ? 'bg-blue-50 text-blue-700' : 'bg-lime/40 text-ink'
                    }`}>
                      {entry.type === 'nid' ? 'NID' : 'PLATE'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-mono font-semibold tracking-widest">{entry.value}</div>
                    {entry.note && <div className="text-xs text-muted mt-0.5">{entry.note}</div>}
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    {entry.type === 'license_plate' ? (
                      entry.linked_nid
                        ? <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">{entry.linked_nid}</span>
                        : <span className="text-xs text-amber-600 font-mono">unlinked</span>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-muted hidden md:table-cell">{entry.added_by_name || 'System'}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleting === entry.id}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold disabled:opacity-50 transition-colors"
                    >
                      {deleting === entry.id ? 'Removing…' : 'Remove'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
