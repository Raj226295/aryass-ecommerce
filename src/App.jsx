import { useEffect, useState } from 'react'
import './App.css'

const mobileMenuItems = [
  'Best Seller',
  'Shirt',
  'Pants',
  'Dress',
  'Top',
  'Co ord set',
  'Shorts',
  'Accessories',
]

const announcementMessages = [
  'First order par 10% off | Use code WELCOME10',
  'Crafted in India. Delivered to the world.',
  'Buy 2 styles and save 12% on curated edits.',
  'Free shipping above Rs. 1,999 and easy returns.',
]

const filters = ['Hindi', 'Rs', 'Color', 'Size']

const shopLinks = [
  'Daily Drop',
  'Winter Collection',
  'Best Seller',
  'Western Wear',
  'Returns & Exchanges',
  'Maharani Sale',
]

const quickLinks = [
  'About Us',
  'Collaboration',
  'Contact Information',
  'Privacy Policy',
  'Refund Policy',
  'Shipping Policy',
  'Terms of Service',
]

const products = [
  {
    name: 'Blush Bloom Dress',
    price: '1,650.00',
    rating: 5,
    reviews: 2,
    soldOut: true,
    art: 'mini',
    pose: 'lean',
    scene: 'studio',
    palette: {
      sceneBase: '#f3e5d9',
      sceneAccent: '#edcdc8',
      floorTone: '#ead7c6',
      garmentPrimary: '#f3b1d0',
      garmentSecondary: '#e57abb',
      accentTone: '#fff2f8',
      skinTone: '#d6a180',
      hairTone: '#6b402f',
    },
  },
  {
    name: 'Merlot Shirt Dress',
    price: '3,495.00',
    art: 'shirtdress',
    pose: 'hands',
    scene: 'studio',
    palette: {
      sceneBase: '#f0dfd1',
      sceneAccent: '#e8cab2',
      floorTone: '#e4d0bf',
      garmentPrimary: '#7f362f',
      garmentSecondary: '#57221d',
      accentTone: '#9f625d',
      skinTone: '#c88967',
      hairTone: '#402723',
    },
  },
  {
    name: 'Cream Dot Shift',
    price: '2,990.00',
    rating: 5,
    reviews: 2,
    soldOut: true,
    art: 'shift',
    pose: 'hands',
    scene: 'studio',
    palette: {
      sceneBase: '#f3e5d6',
      sceneAccent: '#edd3c0',
      floorTone: '#ead6c2',
      garmentPrimary: '#f3ebd9',
      garmentSecondary: '#d9cfb3',
      accentTone: '#a9864f',
      skinTone: '#d7a47f',
      hairTone: '#6a4732',
    },
  },
  {
    name: 'Ivory Whisper Maxi',
    price: '3,490.00',
    art: 'maxi',
    pose: 'front',
    scene: 'studio',
    palette: {
      sceneBase: '#efe5d8',
      sceneAccent: '#ead6c6',
      floorTone: '#e7d8ca',
      garmentPrimary: '#f6f4ef',
      garmentSecondary: '#ddd5ca',
      accentTone: '#ffffff',
      skinTone: '#c68f70',
      hairTone: '#5b382b',
    },
  },
  {
    name: 'Noa Stripe Dress',
    price: '3,448.00',
    soldOut: true,
    art: 'mini',
    pose: 'front',
    scene: 'studio',
    pattern: 'stripe',
    palette: {
      sceneBase: '#eee0d0',
      sceneAccent: '#e7d2bc',
      floorTone: '#e2cdb8',
      garmentPrimary: '#efe2cc',
      garmentSecondary: '#cfa06f',
      accentTone: '#ffffff',
      skinTone: '#d09b75',
      hairTone: '#664333',
    },
  },
  {
    name: 'Mili Garden Dress',
    price: '2,200.00',
    soldOut: true,
    art: 'mini',
    pose: 'hands',
    scene: 'studio',
    pattern: 'floral',
    palette: {
      sceneBase: '#efe2d4',
      sceneAccent: '#ead5bf',
      floorTone: '#e5d1bf',
      garmentPrimary: '#f6d9dd',
      garmentSecondary: '#de8ba8',
      accentTone: '#f8f1bf',
      skinTone: '#d09a73',
      hairTone: '#654432',
    },
  },
  {
    name: 'Pleated Candy Dress',
    price: '3,490.00',
    rating: 5,
    reviews: 1,
    art: 'mini',
    pose: 'walk',
    scene: 'studio',
    palette: {
      sceneBase: '#f5e7dc',
      sceneAccent: '#efd6cb',
      floorTone: '#ead2c0',
      garmentPrimary: '#f3c0df',
      garmentSecondary: '#d57eb2',
      accentTone: '#ffdceb',
      skinTone: '#d49d79',
      hairTone: '#57362c',
    },
  },
  {
    name: 'Midnight Lane Gown',
    price: '3,500.00',
    art: 'maxi',
    pose: 'walk',
    scene: 'night',
    hasBag: true,
    palette: {
      sceneBase: '#1f1d2b',
      sceneAccent: '#f1ad68',
      floorTone: '#4d3d4f',
      garmentPrimary: '#141414',
      garmentSecondary: '#050505',
      accentTone: '#3ee3ae',
      skinTone: '#d09c79',
      hairTone: '#2c1c18',
    },
  },
  {
    name: 'Go Denim Co ord',
    price: '1,650.00',
    rating: 5,
    reviews: 4,
    soldOut: true,
    art: 'coord',
    pose: 'front',
    scene: 'plain',
    palette: {
      sceneBase: '#f3efe9',
      sceneAccent: '#ece8e4',
      floorTone: '#e6dfd7',
      garmentPrimary: '#416a9d',
      garmentSecondary: '#24486f',
      accentTone: '#7bb4ff',
      skinTone: '#d29d79',
      hairTone: '#422b25',
    },
  },
  {
    name: 'Embroidered Noir',
    price: '1,600.00',
    rating: 5,
    reviews: 6,
    art: 'maxi',
    pose: 'front',
    scene: 'plain',
    asSeenOn: true,
    palette: {
      sceneBase: '#efeff2',
      sceneAccent: '#e6e6ec',
      floorTone: '#dfdfe6',
      garmentPrimary: '#171717',
      garmentSecondary: '#050505',
      accentTone: '#bfa16a',
      skinTone: '#d1a082',
      hairTone: '#3b2a27',
    },
  },
  {
    name: 'Rose Wonder Dress',
    price: '1,600.00',
    art: 'maxi',
    pose: 'front',
    scene: 'plain',
    asSeenOn: true,
    palette: {
      sceneBase: '#efeff3',
      sceneAccent: '#e7e7ec',
      floorTone: '#e1dfea',
      garmentPrimary: '#ef5f9a',
      garmentSecondary: '#c9336d',
      accentTone: '#f6c1d7',
      skinTone: '#d19f7f',
      hairTone: '#3f2826',
    },
  },
  {
    name: 'Meher Print Dress',
    price: '1,650.00',
    rating: 5,
    reviews: 1,
    art: 'maxi',
    pose: 'front',
    scene: 'plain',
    pattern: 'print',
    palette: {
      sceneBase: '#efeff2',
      sceneAccent: '#e9e8ef',
      floorTone: '#e1dfe7',
      garmentPrimary: '#3d3434',
      garmentSecondary: '#9e513c',
      accentTone: '#ed8f42',
      skinTone: '#cd9878',
      hairTone: '#3c2824',
    },
  },
  {
    name: 'Scarlet Sindoor',
    price: '1,850.00',
    rating: 5,
    reviews: 4,
    art: 'maxi',
    pose: 'front',
    scene: 'plain',
    asSeenOn: true,
    palette: {
      sceneBase: '#f1f0f4',
      sceneAccent: '#e8e6ee',
      floorTone: '#dedce6',
      garmentPrimary: '#e94a44',
      garmentSecondary: '#b72a26',
      accentTone: '#ffb6a7',
      skinTone: '#c99577',
      hairTone: '#402825',
    },
  },
  {
    name: 'Fuchsia V Neck Co ord',
    price: '1,232.00',
    oldPrice: '1,450.00',
    soldOut: true,
    art: 'coord',
    pose: 'hands',
    scene: 'plain',
    palette: {
      sceneBase: '#efeff3',
      sceneAccent: '#e8e8ee',
      floorTone: '#dfdfe7',
      garmentPrimary: '#f11b86',
      garmentSecondary: '#ca116b',
      accentTone: '#ff83be',
      skinTone: '#d09b79',
      hairTone: '#402827',
    },
  },
  {
    name: 'Royal Blue Edit',
    price: '1,899.00',
    rating: 5,
    reviews: 6,
    art: 'maxi',
    pose: 'front',
    scene: 'plain',
    asSeenOn: true,
    palette: {
      sceneBase: '#f1eff4',
      sceneAccent: '#e8e6ec',
      floorTone: '#dedce4',
      garmentPrimary: '#3066b8',
      garmentSecondary: '#1a4790',
      accentTone: '#b9d3ff',
      skinTone: '#cc987a',
      hairTone: '#372725',
    },
  },
  {
    name: 'Little Heart Jeans',
    price: '2,500.00',
    art: 'denim',
    scene: 'plain',
    asSeenOn: true,
    palette: {
      sceneBase: '#ececf2',
      sceneAccent: '#e3e3ec',
      floorTone: '#dadae4',
      garmentPrimary: '#9eb4ce',
      garmentSecondary: '#7694b8',
      accentTone: '#ead6c5',
      skinTone: '#c99773',
      hairTone: '#372826',
    },
  },
  {
    name: 'Lifafa Denim Vest',
    price: '1,800.00',
    rating: 5,
    reviews: 4,
    art: 'vest',
    pose: 'front',
    scene: 'plain',
    asSeenOn: true,
    palette: {
      sceneBase: '#f0f0f4',
      sceneAccent: '#e8e8ef',
      floorTone: '#e0dfe7',
      garmentPrimary: '#ece4d8',
      garmentSecondary: '#88a6cf',
      accentTone: '#f4f2ee',
      skinTone: '#cc9a78',
      hairTone: '#3a2726',
    },
  },
  {
    name: 'Lara Cutwork Denim',
    price: '2,300.00',
    soldOut: true,
    art: 'denim',
    scene: 'plain',
    asSeenOn: true,
    palette: {
      sceneBase: '#ededf2',
      sceneAccent: '#e4e5eb',
      floorTone: '#dcdce4',
      garmentPrimary: '#8dadce',
      garmentSecondary: '#6f8cb0',
      accentTone: '#b07d54',
      skinTone: '#cd9874',
      hairTone: '#372927',
    },
  },
  {
    name: 'Cocoa Twist Set',
    price: '2,099.00',
    art: 'coord',
    pose: 'hands',
    scene: 'plain',
    palette: {
      sceneBase: '#efeff2',
      sceneAccent: '#e7e7ed',
      floorTone: '#dddddf',
      garmentPrimary: '#6a412f',
      garmentSecondary: '#3a231a',
      accentTone: '#9d6a54',
      skinTone: '#d5a181',
      hairTone: '#30201b',
    },
  },
  {
    name: 'Rosey Gingham Maxi',
    price: '1,995.00',
    soldOut: true,
    art: 'maxi',
    pose: 'front',
    scene: 'plain',
    pattern: 'check',
    palette: {
      sceneBase: '#f0eff2',
      sceneAccent: '#e8e7ed',
      floorTone: '#dfe0e5',
      garmentPrimary: '#f8dbe2',
      garmentSecondary: '#e2b8c0',
      accentTone: '#fff4f7',
      skinTone: '#cf9c79',
      hairTone: '#3b2725',
    },
  },
  {
    name: 'Young White Rich Shirt',
    price: '5,145.00',
    art: 'skirtset',
    pose: 'front',
    scene: 'studio',
    palette: {
      sceneBase: '#eee0d1',
      sceneAccent: '#ead3bd',
      floorTone: '#e0cdb7',
      garmentPrimary: '#f8f6f2',
      garmentSecondary: '#bb9465',
      accentTone: '#e7c492',
      skinTone: '#d09b75',
      hairTone: '#5b3c30',
    },
  },
  {
    name: 'Florida Column Dress',
    price: '2,998.00',
    art: 'maxi',
    pose: 'front',
    scene: 'studio',
    palette: {
      sceneBase: '#efe1d3',
      sceneAccent: '#e7d1bd',
      floorTone: '#dfccb8',
      garmentPrimary: '#f1eadb',
      garmentSecondary: '#d6b27d',
      accentTone: '#ffecbe',
      skinTone: '#cf9c77',
      hairTone: '#54372d',
    },
  },
  {
    name: 'House Of Pop Art',
    price: '2,345.00',
    art: 'shift',
    pose: 'front',
    scene: 'studio',
    pattern: 'abstract',
    palette: {
      sceneBase: '#efdfd0',
      sceneAccent: '#ead1bb',
      floorTone: '#e1c9b4',
      garmentPrimary: '#f6e3ca',
      garmentSecondary: '#f08d55',
      accentTone: '#2d353f',
      skinTone: '#d19c75',
      hairTone: '#58382d',
    },
  },
  {
    name: 'Old Money Set',
    price: '1,449.00',
    soldOut: true,
    art: 'coord',
    pose: 'front',
    scene: 'plain',
    palette: {
      sceneBase: '#efeff3',
      sceneAccent: '#e7e7ee',
      floorTone: '#dddddf',
      garmentPrimary: '#ec5c15',
      garmentSecondary: '#c84a0c',
      accentTone: '#ff9a5c',
      skinTone: '#ce9877',
      hairTone: '#372724',
    },
  },
]

function Icon({ name }) {
  const icons = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M6 6 18 18M18 6 6 18" />,
    search: <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm8 14-3.2-3.2" />,
    account: (
      <path d="M12 5a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 12 5Zm-5.2 13a5.2 5.2 0 0 1 10.4 0" />
    ),
    bag: <path d="M7 8V7a5 5 0 0 1 10 0v1M5 8h14l-1 11H6L5 8Z" />,
    chevron: <path d="m9 6 6 6-6 6" />,
    facebook: (
      <path
        d="M13.5 8H15V5.5h-1.9c-2.3 0-3.6 1.3-3.6 3.7V11H8v2.4h1.5V19H12v-5.6h2l.4-2.4h-2.4V9.5c0-.9.3-1.5 1.5-1.5Z"
        fill="currentColor"
        stroke="none"
      />
    ),
    instagram: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="4" />
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="16.6" cy="7.6" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
    youtube: (
      <>
        <path
          d="M19 8.3c-.2-.9-.9-1.6-1.8-1.8C15.6 6 12 6 12 6s-3.6 0-5.2.5c-.9.2-1.6.9-1.8 1.8C4.5 10 4.5 12 4.5 12s0 2 .5 3.7c.2.9.9 1.6 1.8 1.8C8.4 18 12 18 12 18s3.6 0 5.2-.5c.9-.2 1.6-.9 1.8-1.8.5-1.7.5-3.7.5-3.7s0-2-.5-3.7Z"
          fill="currentColor"
          stroke="none"
        />
        <path d="m10.5 14.5 4-2.5-4-2.5Z" fill="currentColor" stroke="none" />
      </>
    ),
    left: <path d="m14.5 6.5-5 5.5 5 5.5" />,
    right: <path d="m9.5 6.5 5 5.5-5 5.5" />,
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function ProductArtwork({ product }) {
  return (
    <div
      className={`product-art product-art--${product.scene} product-art--${product.pattern || 'plain'}`}
      style={{
        '--scene-base': product.palette.sceneBase,
        '--scene-accent': product.palette.sceneAccent,
        '--floor-tone': product.palette.floorTone,
        '--garment-primary': product.palette.garmentPrimary,
        '--garment-secondary': product.palette.garmentSecondary,
        '--accent-tone': product.palette.accentTone,
        '--skin-tone': product.palette.skinTone,
        '--hair-tone': product.palette.hairTone,
      }}
    >
      {product.soldOut ? <span className="product-badge">Sold out</span> : null}
      {product.asSeenOn ? <span className="product-stamp">as seen on</span> : null}

      {product.art === 'denim' ? (
        <div className="denim-art">
          <span className="denim-top" />
          <span className="denim-leg denim-leg--left" />
          <span className="denim-leg denim-leg--right" />
          <span className="denim-cutout cutout-one" />
          <span className="denim-cutout cutout-two" />
          <span className="denim-cutout cutout-three" />
        </div>
      ) : (
        <div className={`art-figure art-figure--${product.art} art-figure--${product.pose || 'front'}`}>
          <span className="art-head" />
          <span className="art-hair" />
          <span className="art-arm art-arm--left" />
          <span className="art-arm art-arm--right" />
          <span className="art-garment" />
          <span className="art-overlay" />
          <span className="art-leg art-leg--left" />
          <span className="art-leg art-leg--right" />
          <span className="art-shoe art-shoe--left" />
          <span className="art-shoe art-shoe--right" />
          {product.hasBag ? <span className="art-bag" /> : null}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <ProductArtwork product={product} />

      <div className="product-copy">
        <h3>{product.name}</h3>
        {product.rating ? (
          <p className="rating-row">
            {'\u2605'.repeat(product.rating)}
            <span>({product.reviews})</span>
          </p>
        ) : null}
        <p className="price-row">
          {product.oldPrice ? <span className="old-price">Rs. {product.oldPrice}</span> : null}
          <span>Rs. {product.price}</span>
        </p>
      </div>

      <button type="button" className="option-button">
        Choose options
      </button>
    </article>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeMessage, setActiveMessage] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveMessage((current) => (current + 1) % announcementMessages.length)
    }, 3800)

    return () => {
      window.clearInterval(intervalId)
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

  const currentMessage = announcementMessages[activeMessage]

  return (
    <div className="page-shell" id="top">
      <div className="top-announcement">
        <div className="social-strip">
          <a href="#footer" aria-label="Facebook">
            <Icon name="facebook" />
          </a>
          <a href="#footer" aria-label="Instagram">
            <Icon name="instagram" />
          </a>
          <a href="#footer" aria-label="YouTube">
            <Icon name="youtube" />
          </a>
        </div>

        <div className="announcement-copy">
          <button
            type="button"
            aria-label="Previous message"
            onClick={() =>
              setActiveMessage(
                (activeMessage - 1 + announcementMessages.length) % announcementMessages.length,
              )
            }
          >
            <Icon name="left" />
          </button>
          <p>{currentMessage}</p>
          <button
            type="button"
            aria-label="Next message"
            onClick={() => setActiveMessage((activeMessage + 1) % announcementMessages.length)}
          >
            <Icon name="right" />
          </button>
        </div>
      </div>

      <header className="site-header">
        <div className="header-side header-side--left">
          <button
            type="button"
            className="header-icon"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setIsMenuOpen(true)}
          >
            <Icon name="menu" />
          </button>
          <button type="button" className="header-icon" aria-label="Search">
            <Icon name="search" />
          </button>
        </div>

        <a className="brand-mark" href="#top" aria-label="Aryass home">
          <span className="brand-word">ARYASS</span>
          <span className="brand-tagline">FEEL BEFORE THE MOMENT</span>
        </a>

        <div className="header-side header-side--right">
          <a className="header-login" href="#login">
            Login
          </a>
          <button type="button" className="header-icon" aria-label="Account">
            <Icon name="account" />
          </button>
          <button
            type="button"
            className="header-icon header-icon--cart"
            aria-label="Shopping bag"
          >
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
        aria-label="Navigation drawer"
      >
        <div className="drawer-header">
          <div>
            <p className="drawer-kicker">Collections</p>
            <strong>Browse Aryass</strong>
          </div>
          <button
            type="button"
            className="header-icon"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="drawer-links">
          {mobileMenuItems.map((item) => (
            <a key={item} href="#collection" onClick={() => setIsMenuOpen(false)}>
              {item}
            </a>
          ))}
        </nav>

        <a className="drawer-login" href="#login" onClick={() => setIsMenuOpen(false)}>
          Login / Account
        </a>
      </aside>

      <main className="collection-page" id="collection">
        <section className="collection-hero">
          <p className="collection-label">Home page direction inspired by your reference</p>
          <h1>Best Seller</h1>
          <p className="collection-text">
            Clean collection-style homepage with dense product grid, lightweight filters,
            center-brand header, and a responsive hamburger drawer.
          </p>
        </section>

        <section className="toolbar-row">
          <div className="filter-group">
            <span>Filter:</span>
            {filters.map((filter) => (
              <button key={filter} type="button" className="toolbar-chip">
                {filter}
                <Icon name="chevron" />
              </button>
            ))}
          </div>

          <div className="sort-group">
            <span>Sort by:</span>
            <button type="button" className="toolbar-chip">
              Featured
              <Icon name="chevron" />
            </button>
            <strong>66 products</strong>
          </div>
        </section>

        <section className="product-grid" aria-label="Best seller products">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </section>

        <div className="pagination">
          <button type="button" className="is-active">
            1
          </button>
          <button type="button">2</button>
          <button type="button" aria-label="Next page">
            <Icon name="chevron" />
          </button>
        </div>

        <section className="login-callout" id="login">
          <div>
            <p className="callout-kicker">Login Button Added</p>
            <h2>Saved wishlist, account access, and future offers are ready to plug in.</h2>
          </div>
          <a href="#top">Login</a>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="footer-brand">
          <a href="#top" className="footer-logo" aria-label="Aryass home">
            <span className="brand-word">ARYASS</span>
            <span className="brand-tagline">FEEL BEFORE THE MOMENT</span>
          </a>
          <div className="footer-socials">
            <a href="#footer" aria-label="Facebook">
              <Icon name="facebook" />
            </a>
            <a href="#footer" aria-label="Instagram">
              <Icon name="instagram" />
            </a>
            <a href="#footer" aria-label="YouTube">
              <Icon name="youtube" />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>
          {shopLinks.map((link) => (
            <a key={link} href="#collection">
              {link}
            </a>
          ))}
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          {quickLinks.map((link) => (
            <a key={link} href="#collection">
              {link}
            </a>
          ))}
        </div>

        <div className="footer-column">
          <h3>Our Achievements</h3>
          <p>Forbes Recognized</p>
          <p>Luxury edits made lighter for mobile browsing.</p>
        </div>
      </footer>

      <div className="footer-legal">
        <p>
          (c) 2026, Aryass. Refund policy | Privacy policy | Terms of service | Shipping
          policy | Contact information
        </p>
      </div>

      <div className="live-chat">
        <strong>Live Video Call</strong>
        <span>Open now | Till 7:30 PM</span>
      </div>
    </div>
  )
}

export default App
