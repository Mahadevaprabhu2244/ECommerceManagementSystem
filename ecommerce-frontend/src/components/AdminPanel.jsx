import { useEffect, useState } from 'react'
import { Pencil, Trash2, X } from 'lucide-react'
import { api } from '../services/api'

const emptyForm = { name: '', description: '', price: '', imageUrl: '', stock: '', categoryId: '' }

export default function AdminPanel({ products, categories, onChanged, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (categories.length && !form.categoryId) {
      setForm(current => ({ ...current, categoryId: String(categories[0].id) }))
    }
  }, [categories])

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId)
    }
    try {
      if (editingId) await api.updateProduct(editingId, payload)
      else await api.createProduct(payload)
      setForm({ ...emptyForm, categoryId: categories[0] ? String(categories[0].id) : '' })
      setEditingId(null)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  const edit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      imageUrl: product.imageUrl || '',
      stock: String(product.stock),
      categoryId: String(product.category?.id || '')
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.deleteProduct(id)
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="admin-panel">
      <div className="section-heading">
        <div><span className="eyebrow">STORE CONTROL</span><h2>Product management</h2></div>
        <button className="icon-button" onClick={onClose} aria-label="Close admin panel"><X /></button>
      </div>
      <form className="admin-form" onSubmit={submit}>
        <h3>{editingId ? 'Edit product' : 'Add a product'}</h3>
        <div className="form-grid">
          <label>Product name<input required value={form.name} onChange={e => update('name', e.target.value)} /></label>
          <label>Price (₹)<input required min="0.01" type="number" step="0.01" value={form.price} onChange={e => update('price', e.target.value)} /></label>
          <label>Stock<input required min="0" type="number" value={form.stock} onChange={e => update('stock', e.target.value)} /></label>
          <label>Category<select required value={form.categoryId} onChange={e => update('categoryId', e.target.value)}>
            {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select></label>
          <label className="wide">Image URL<input value={form.imageUrl} onChange={e => update('imageUrl', e.target.value)} placeholder="https://..." /></label>
          <label className="wide">Description<textarea rows="2" value={form.description} onChange={e => update('description', e.target.value)} /></label>
        </div>
        {error && <p className="error-text">{error}</p>}
        <div className="form-actions">
          <button className="gold-button" type="submit">{editingId ? 'Save changes' : 'Add product'}</button>
          {editingId && <button className="quiet-button" type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel edit</button>}
        </div>
      </form>
      <div className="admin-list">
        <h3>Current products <span>{products.length}</span></h3>
        {products.map(product => (
          <div className="admin-row" key={product.id}>
            <img src={product.imageUrl} alt="" />
            <div className="admin-row-copy"><strong>{product.name}</strong><small>₹{Number(product.price).toLocaleString('en-IN')} · {product.stock} in stock</small></div>
            <button className="icon-button" onClick={() => edit(product)} aria-label={`Edit ${product.name}`}><Pencil size={17} /></button>
            <button className="icon-button danger" onClick={() => remove(product.id)} aria-label={`Delete ${product.name}`}><Trash2 size={17} /></button>
          </div>
        ))}
      </div>
    </section>
  )
}
