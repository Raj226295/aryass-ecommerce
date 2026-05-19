import { useEffect, useState } from 'react'
import './App.css'

const menuItems = [
  'Shirt',
  'Pants',
  'Dress',
  'Top',
  'Co ord set',
  'Shorts',
  'Accessories',
]

const offerSlides = [
  {
    id: 'welcome10',
    label: 'First Order Offer',
    title: 'Get 10% Off On Your First Aryass Order',
    description:
      'New customers ke liye instant welcome savings. Premium picks add karo aur checkout par code apply karo.',
    code: 'WELCOME10',
    highlight: 'New Shopper Favorite',
    metrics: [
      { value: '10%', label: 'Instant savings' },
      { value: '0', label: 'Minimum cart hassle' },
      { value: '24/7', label: 'Always visible offer' },
    ],
  },
  {
    id: 'duo12',
    label: 'Closet Builder',
    title: 'Buy Any 2 Styles And Save 12%',
    description:
      'Shirts, tops, pants, ya shorts ko mix karo aur wardrobe upgrade ko thoda aur rewarding banao.',
    code: 'DUO12',
    highlight: 'Best For Everyday Looks',
    metrics: [
      { value: '2+', label: 'Styles in cart' },
      { value: '12%', label: 'Bundle discount' },
      { value: '7 Days', label: 'Easy returns' },
    ],
  },
  {
    id: 'luxe15',
    label: 'Festive Edit',
    title: 'Flat 15% Off Above Rs. 4,999',
    description:
      'Dresses aur co ord sets ke saath elevated festive shopping. Higher cart value par bigger reward.',
    code: 'LUXE15',
    highlight: 'Limited Time Pick',
    metrics: [
      { value: '15%', label: 'Premium savings' },
      { value: '4999+', label: 'Order value' },
      { value: 'Fast', label: 'Dispatch support' },
    ],
  },
  {
    id: 'acc5',
    label: 'Finishing Touch',
    title: 'Accessories Par 5% Extra Off Above Rs. 2,999',
    description:
      'Statement add-ons ke saath final cart polish karo. Small accessories ko strong styling moment banao.',
    code: 'STYLE5',
    highlight: 'Perfect Add-On Deal',
    metrics: [
      { value: '5%', label: 'Extra discount' },
      { value: '2999+', label: 'Spend threshold' },
      { value: 'Gift Ready', label: 'Elegant packaging' },
    ],
  },
]

const categoryCards = [
  {
    name: 'Shirt',
    tag: 'Sharp Layers',
    description: 'Clean tailoring, premium textures, and day-to-night silhouettes.',
    gradient:
      'linear-gradient(135deg, rgba(255, 241, 225, 0.95), rgba(214, 173, 127, 0.72))',
    accent: '#c98a4d',
  },
  {
    name: 'Pants',
    tag: 'Easy Structure',
    description: 'Fluid fall, polished fits, and neutral tones for repeat styling.',
    gradient:
      'linear-gradient(135deg, rgba(231, 216, 204, 0.95), rgba(143, 104, 78, 0.75))',
    accent: '#8a5a3c',
  },
  {
    name: 'Dress',
    tag: 'Event Ready',
    description: 'Feminine drape and standout movement for festive or evening looks.',
    gradient:
      'linear-gradient(135deg, rgba(246, 218, 229, 0.95), rgba(196, 123, 150, 0.75))',
    accent: '#b85f82',
  },
  {
    name: 'Top',
    tag: 'Modern Basics',
    description: 'Soft statement pieces built for layering, brunch plans, and travel days.',
    gradient:
      'linear-gradient(135deg, rgba(255, 236, 214, 0.95), rgba(224, 145, 91, 0.74))',
    accent: '#d17b39',
  },
  {
    name: 'Co ord set',
    tag: 'Complete Looks',
    description: 'Minimal effort styling with elevated two-piece and matching sets.',
    gradient:
      'linear-gradient(135deg, rgba(238, 223, 203, 0.95), rgba(161, 124, 83, 0.75))',
    accent: '#9f7342',
  },
  {
    name: 'Shorts',
    tag: 'Breezy Edit',
    description: 'Relaxed fits and chic comfort for warm-weather dressing.',
    gradient:
      'linear-gradient(135deg, rgba(246, 230, 210, 0.95), rgba(190, 139, 101, 0.75))',
    accent: '#bb7b4b',
  },
  {
    name: 'Accessories',
    tag: 'Final Touches',
    description: 'Bags, accents, and luxe extras that finish every outfit beautifully.',
    gradient:
      'linear-gradient(135deg, rgba(242, 228, 202, 0.95), rgba(142, 117, 71, 0.78))',
    accent: '#8e6d36',
  },
]

const benefits = [
  'Free shipping above Rs. 1,999',
  'Easy returns within 7 days',
  'Fresh offers rotating automatically',
]

function Icon({ name }) {
  if (name === 'menu') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    )
  }

  if (name === 'close') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6 18 18M18 6 6 18" />
      </svg>
    )
  }

  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm8 14-3.2-3.2" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 8V7a5 5 0 0 1 10 0v1M5 8h14l-1 11H6L5 8Z" />
    </svg>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeOffer, setActiveOffer] = useState(0)

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setActiveOffer((currentOffer) => (currentOffer + 1) % offerSlides.length)
    }, 4200)

    return () => {
      window.clearInterval(timerId)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  const currentOffer = offerSlides[activeOffer]

  return (
    <div className="page-shell" id="top">
      <div className="promo-strip">
        <p>
          <span>{currentOffer.label}</span>
          {currentOffer.title} | Use code {currentOffer.code}
        </p>
      </div>

      <header className="site-header">
        <div className="header-start">
          <button
            type="button"
            className="menu-toggle"
            aria-label="Open categories menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setIsMenuOpen(true)}
          >
            <Icon name="menu" />
          </button>

          <a className="brand" href="#top">
            ARYASS
            <span>Feel before the moment</span>
          </a>
        </div>

        <nav className="desktop-nav" aria-label="Primary">
          <a href="#categories">Collections</a>
          <a href="#offers">Offers</a>
          <a href="#curated-edit">Curated Edit</a>
          <a href="#login">Account</a>
        </nav>

        <div className="header-actions">
          <button type="button" className="icon-button" aria-label="Search">
            <Icon name="search" />
          </button>
          <a className="login-button" href="#login">
            Login
          </a>
          <button type="button" className="icon-button bag-button" aria-label="Bag">
            <Icon name="bag" />
          </button>
        </div>
      </header>

      <div
        className={`drawer-backdrop ${isMenuOpen ? 'is-visible' : ''}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      <aside
        id="mobile-drawer"
        className={`mobile-drawer ${isMenuOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="drawer-header">
          <div>
            <p className="drawer-label">Shop Menu</p>
            <strong>Browse by category</strong>
          </div>
          <button
            type="button"
            className="drawer-close"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="drawer-nav">
          {menuItems.map((item) => (
            <a key={item} href="#categories" onClick={() => setIsMenuOpen(false)}>
              {item}
            </a>
          ))}
        </nav>

        <div className="drawer-footer">
          <a className="drawer-login" href="#login" onClick={() => setIsMenuOpen(false)}>
            Login / Account
          </a>
          <p>Free shipping above Rs. 1,999</p>
        </div>
      </aside>

      <main className="page-content">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Luxury edits for everyday glamour</p>
            <h1>Responsive fashion homepage with bold offers and a cleaner mobile menu.</h1>
            <p className="hero-text">
              Aryass ke liye homepage ko is tarah style kiya gaya hai ki mobile par hamburger
              menu clean lage, login CTA visible rahe, aur offers auto-slide hote hue
              instantly attention grab karein.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#categories">
                Shop Collection
              </a>
              <a className="secondary-button" href="#offers">
                View Offers
              </a>
            </div>

            <div className="hero-benefits">
              {benefits.map((benefit) => (
                <div key={benefit} className="benefit-pill">
                  <span />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-offer-card">
              <p>{currentOffer.label}</p>
              <h2>{currentOffer.title}</h2>
              <p className="hero-offer-copy">{currentOffer.description}</p>
              <div className="hero-offer-code">Use code: {currentOffer.code}</div>
            </div>

            <div className="fashion-portrait" aria-hidden="true">
              <div className="portrait-halo" />
              <div className="portrait-figure">
                <span className="figure-head" />
                <span className="figure-hair" />
                <span className="figure-body" />
                <span className="figure-bag" />
              </div>
            </div>

            <div className="floating-note">First order pe 10% off ab hero section me highlight hoga.</div>
          </div>
        </section>

        <section className="offers-section" id="offers">
          <div className="section-copy">
            <p className="eyebrow">Auto Sliding Offers</p>
            <h2>Shop more, save more</h2>
            <p>
              Slider automatically rotate karega aur aapka first order 10% discount hamesha
              pehla featured offer rahega.
            </p>
          </div>

          <div className="slider-frame">
            <div
              className="slider-track"
              style={{ transform: `translateX(-${activeOffer * 100}%)` }}
            >
              {offerSlides.map((offer) => (
                <article key={offer.id} className="offer-slide">
                  <div className="offer-copy">
                    <span className="offer-chip">{offer.highlight}</span>
                    <h3>{offer.title}</h3>
                    <p>{offer.description}</p>
                    <div className="offer-code">Use code: {offer.code}</div>
                  </div>

                  <div className="offer-metrics">
                    {offer.metrics.map((metric) => (
                      <div key={metric.label} className="metric-card">
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="slider-dots" role="tablist" aria-label="Offer slides">
            {offerSlides.map((offer, index) => (
              <button
                key={offer.id}
                type="button"
                className={index === activeOffer ? 'is-active' : ''}
                aria-label={`Show ${offer.label}`}
                aria-selected={index === activeOffer}
                onClick={() => setActiveOffer(index)}
              />
            ))}
          </div>
        </section>

        <section className="categories-section" id="categories">
          <div className="section-copy">
            <p className="eyebrow">Hamburger Menu Categories</p>
            <h2>Every requested category, now on the homepage too</h2>
            <p>
              Shirt se Accessories tak saare options mobile drawer aur landing grid dono me
              aligned hain, taki browsing simple aur consistent rahe.
            </p>
          </div>

          <div className="category-grid">
            {categoryCards.map((category) => (
              <article
                key={category.name}
                className="category-card"
                style={{
                  '--card-gradient': category.gradient,
                  '--card-accent': category.accent,
                }}
              >
                <div className="category-visual" aria-hidden="true">
                  <span className="shape shape-one" />
                  <span className="shape shape-two" />
                  <span className="shape shape-three" />
                </div>
                <p className="category-tag">{category.tag}</p>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="curated-section" id="curated-edit">
          <article className="curated-card curated-dark">
            <p className="eyebrow">Curated Edit</p>
            <h2>Made to feel festive, styled to stay wearable</h2>
            <p>
              Homepage ka mood luxury-meets-clean rakha gaya hai, jisme beige, black, aur warm
              gold palette Aryass brand reference ko support karti hai.
            </p>
          </article>

          <article className="curated-card curated-light">
            <p className="eyebrow">Ready For Login CTA</p>
            <h2>Account entry visible on both header and drawer</h2>
            <p>
              User ko login dhoondhna na pade, isliye desktop header aur mobile drawer dono
              me account action place kiya gaya hai.
            </p>
          </article>
        </section>

        <section className="login-banner" id="login">
          <div>
            <p className="eyebrow">Login Button Added</p>
            <h2>Welcome shoppers back with a clear account button</h2>
            <p>
              Sign in, saved wishlist, and exclusive drops jaise future flows ke liye ye CTA
              ready position me hai.
            </p>
          </div>

          <a className="primary-button" href="#top">
            Login
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>ARYASS</strong>
          <p>Luxury fashion edits with responsive browsing and rotating savings.</p>
        </div>
        <div>
          <span>Contact</span>
          <p>hello@aryass.com</p>
        </div>
        <div>
          <span>Policies</span>
          <p>Privacy Policy | Shipping | Returns</p>
        </div>
      </footer>
    </div>
  )
}

export default App
