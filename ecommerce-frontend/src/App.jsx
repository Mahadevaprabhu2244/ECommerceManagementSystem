import { useEffect, useMemo, useState } from 'react'
import { Search, ShoppingBag, Menu, X, ArrowUpRight, Minus, Plus, Trash2, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react'
import ProductCard from './components/ProductCard'
import AdminPanel from './components/AdminPanel'
import { api } from './services/api'

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(value)

const readCart = () => {
  try { return JSON.parse(localStorage.getItem('elan-cart') || '[]') }
  catch { return [] }
}

export default function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState(readCart)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [activeView, setActiveView] = useState('shop')
  const [cartOpen, setCartOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [checkout, setCheckout] = useState({ customerName: '', email: '', phone: '', address: '' })
  const [orderResult, setOrderResult] = useState(null)
  const [orderEmail, setOrderEmail] = useState('')
  const [orders, setOrders] = useState([])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [productData, categoryData] = await Promise.all([api.products(search, categoryId), api.categories()])
      setProducts(productData)
      setCategories(categoryData)
    } catch (err) {
      setError(`${err.message}. Make sure the Spring Boot backend and MySQL are running.`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [search, categoryId])
  useEffect(() => { localStorage.setItem('elan-cart', JSON.stringify(cart)) }, [cart])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

  const addToCart = (product) => {
    if (product.stock <= 0) return
    setCart(current => {
      const existing = current.find(item => item.id === product.id)
      if (existing) return current.map(item => item.id === product.id
        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item)
      return [...current, { ...product, quantity: 1 }]
    })
    setNotice(`${product.name} added to your bag`)
    setCartOpen(true)
    setTimeout(() => setNotice(''), 2500)
  }

  const changeQuantity = (id, delta) => {
    setCart(current => current.map(item => item.id === id
      ? { ...item, quantity: Math.max(1, Math.min(item.quantity + delta, item.stock)) } : item))
  }

  const removeFromCart = (id) => setCart(current => current.filter(item => item.id !== id))

  const placeOrder = async (event) => {
    event.preventDefault()
    try {
      const result = await api.placeOrder({
        ...checkout,
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
      })
      setOrderResult(result)
      setCart([])
      setCartOpen(false)
      setActiveView('success')
    } catch (err) {
      setError(err.message)
    }
  }

  const loadOrders = async (event) => {
    event.preventDefault()
    try {
      setOrders(await api.orders(orderEmail))
      setError('')
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="app-shell">
      <div className="announcement"><Sparkles size={13} /> A considered collection of everyday essentials <span>·</span> Complimentary delivery over ₹2,999</div>
      <header className="site-header">
        <a className="brand" href="#" onClick={() => { setActiveView('shop'); setAdminOpen(false) }}>
          <span className="brand-mark">É</span><span>ÉLAN<small>OBJECTS OF DESIRE</small></span>
        </a>
        <nav className="desktop-nav">
          <button className={activeView === 'shop' ? 'nav-active' : ''} onClick={() => { setActiveView('shop'); setAdminOpen(false) }}>Shop</button>
          <button className={activeView === 'orders' ? 'nav-active' : ''} onClick={() => { setActiveView('orders'); setAdminOpen(false) }}>My orders</button>
          <button onClick={() => setAdminOpen(v => !v)}>Admin <span className="admin-dot" /></button>
        </nav>
        <div className="header-actions">
          <button className="bag-button" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Bag</span><b>{cartCount}</b></button>
          <button className="mobile-menu" onClick={() => setAdminOpen(v => !v)} aria-label="Toggle admin"><Menu /></button>
        </div>
      </header>

      {notice && <div className="toast">{notice}</div>}

      {activeView === 'shop' && !adminOpen && (
        <>
          <main>
            <section className="hero">
              <div className="hero-content">
                <span className="eyebrow"><span className="eyebrow-line" /> THE NEW EDITION · 2025</span>
                <h1>Less, but<br /><em>better.</em></h1>
                <p>Discover thoughtfully selected pieces that bring a little more intention to everyday living.</p>
                <button className="gold-button hero-button" onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}>Explore collection <ArrowUpRight size={17} /></button>
                <div className="hero-footnote"><span>01 / 03</span><span className="hero-line" /><span>CURATED FOR YOU</span></div>
              </div>
              <div className="hero-image">
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85" alt="Curated modern retail collection" />
                <div className="hero-image-caption"><span>THE ART OF CHOOSING</span><span>EST. 2025</span></div>
              </div>
              <div className="hero-side-label">A MORE CONSIDERED WAY TO SHOP</div>
            </section>

            <section className="benefits">
              <div><PackageCheck /><span><strong>Thoughtful delivery</strong><small>Carefully packed, always</small></span></div>
              <div><ShieldCheck /><span><strong>Quality first</strong><small>Selected with intention</small></span></div>
              <div><Sparkles /><span><strong>Made to matter</strong><small>Everyday, elevated</small></span></div>
            </section>

            <section className="collection section-wrap" id="collection">
              <div className="section-heading">
                <div><span className="eyebrow">THE ÉLAN SELECTION</span><h2>Find your <em>everyday.</em></h2></div>
                <span className="result-count">{products.length} PIECES</span>
              </div>
              <div className="catalog-tools">
                <div className="category-tabs">
                  <button className={!categoryId ? 'selected' : ''} onClick={() => setCategoryId('')}>All pieces</button>
                  {categories.map(category => <button key={category.id} className={String(category.id) === categoryId ? 'selected' : ''} onClick={() => setCategoryId(String(category.id))}>{category.name}</button>)}
                </div>
                <label className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pieces..." /></label>
              </div>
              {error && <div className="error-banner">{error}</div>}
              {loading ? <div className="empty-state">Loading the collection...</div> :
                products.length ? <div className="product-grid">{products.map(product => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div> :
                <div className="empty-state">No products found. Try another search.</div>}
            </section>

            <section className="quote-band"><span>“</span><p>Good design is as little design as possible.</p><small>LESS, BUT BETTER.</small></section>
          </main>
        </>
      )}

      {adminOpen && <main className="section-wrap page-content"><AdminPanel products={products} categories={categories} onChanged={loadData} onClose={() => setAdminOpen(false)} /></main>}

      {activeView === 'orders' && !adminOpen && (
        <main className="section-wrap page-content">
          <div className="section-heading"><div><span className="eyebrow">YOUR PURCHASES</span><h2>Order <em>history.</em></h2></div></div>
          <form className="order-search" onSubmit={loadOrders}><input type="email" required placeholder="Enter the email used at checkout" value={orderEmail} onChange={e => setOrderEmail(e.target.value)} /><button className="gold-button">Find orders</button></form>
          {orders.map(order => <div className="order-card" key={order.id}><div><strong>Order #{order.id}</strong><small>{new Date(order.createdAt).toLocaleString()}</small></div><span className="status-pill">{order.status}</span><strong>{money(order.totalAmount)}</strong></div>)}
          {!orders.length && <p className="muted-copy">Enter your checkout email to find your orders.</p>}
        </main>
      )}

      {activeView === 'success' && (
        <main className="success-page">
          <div className="success-icon"><PackageCheck size={34} /></div>
          <span className="eyebrow">ORDER CONFIRMED</span>
          <h1>Thank you for<br /><em>choosing well.</em></h1>
          <p>Your order has been placed successfully.</p>
          {orderResult && <div className="success-order"><span>ORDER NUMBER</span><strong>#{orderResult.id}</strong><span>ORDER TOTAL</span><strong>{money(orderResult.totalAmount)}</strong></div>}
          <button className="gold-button" onClick={() => { setActiveView('shop'); setOrderResult(null) }}>Continue shopping <ArrowUpRight size={17} /></button>
        </main>
      )}

      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-mark">É</span><div><strong>ÉLAN</strong><small>OBJECTS OF DESIRE</small></div></div>
        <p>Considered essentials. Thoughtfully chosen.</p>
        <span>© 2025 ÉLAN. DEMO STORE.</span>
      </footer>

      {cartOpen && <div className="drawer-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false) }}>
        <aside className="cart-drawer">
          <div className="drawer-heading"><div><span className="eyebrow">YOUR SELECTION</span><h2>Your bag <em>({cartCount})</em></h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><X /></button></div>
          <div className="cart-items">
            {!cart.length && <div className="empty-state">Your bag is waiting for something special.</div>}
            {cart.map(item => <div className="cart-item" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <div className="cart-item-info"><strong>{item.name}</strong><span>{money(item.price)}</span><div className="quantity-control"><button onClick={() => changeQuantity(item.id, -1)}><Minus size={13} /></button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)}><Plus size={13} /></button></div></div>
              <button className="remove-button" onClick={() => removeFromCart(item.id)} aria-label="Remove item"><Trash2 size={16} /></button>
            </div>)}
          </div>
          {!!cart.length && <>
            <div className="cart-total"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div>
            <p className="cart-note">Shipping and taxes are calculated at checkout.</p>
            <form className="checkout-form" onSubmit={placeOrder}>
              <h3>Delivery details</h3>
              <input required placeholder="Full name" value={checkout.customerName} onChange={e => setCheckout({ ...checkout, customerName: e.target.value })} />
              <input required type="email" placeholder="Email address" value={checkout.email} onChange={e => setCheckout({ ...checkout, email: e.target.value })} />
              <input placeholder="Phone number" value={checkout.phone} onChange={e => setCheckout({ ...checkout, phone: e.target.value })} />
              <textarea required rows="2" placeholder="Delivery address" value={checkout.address} onChange={e => setCheckout({ ...checkout, address: e.target.value })} />
              <button className="gold-button checkout-button">Place order · {money(cartTotal)}</button>
              <small className="demo-note">Demo checkout only — no real payment is collected.</small>
            </form>
          </>}
        </aside>
      </div>}
    </div>
  )
}
