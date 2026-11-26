import { ShoppingBag, Plus } from 'lucide-react'

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(value)

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
          alt={product.name}
          loading="lazy"
          onError={(event) => { event.currentTarget.src = 'https://placehold.co/600x450/171717/d8b56d?text=Product' }}
        />
        <span className="image-tag">{product.category?.name || 'Collection'}</span>
      </div>
      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description || 'Thoughtfully selected for everyday living.'}</p>
        </div>
        <div className="product-bottom">
          <strong>{money(product.price)}</strong>
          <button className="add-button" onClick={() => onAdd(product)} disabled={product.stock <= 0}>
            {product.stock > 0 ? <><Plus size={16} /> Add</> : 'Sold out'}
          </button>
        </div>
        <span className="stock-note">{product.stock} available</span>
      </div>
    </article>
  )
}
