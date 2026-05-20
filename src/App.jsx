import { useEffect, useRef, useState } from 'react'
import './App.css'

const mobileMenuItems = [
  'Shirt',
  'Pants',
  'Dress',
  'Top',
  'Co ord set',
  'Shorts',
  'Accessories',
]

const announcementMessages = [
  'First order par 10% off | Use code FIRST10',
  'Crafted in India. Delivered to the world.',
  'Buy 2 styles and save 12% on curated edits.',
  'Free shipping above Rs. 1,999 and easy returns.',
]

const offerSlides = [
  {
    id: 'welcome10',
    label: 'First Order Special',
    title: 'Get 10% Off On Your First Order',
    code: 'FIRST10',
    description:
      'Naye shoppers ke liye welcome offer. Shirt, dress, top ya co ord set par instant first order discount.',
    image: '/offers/first-order-special.png',
    alt: 'Aryass first order special banner showing 10% off on the first order with code FIRST10.',
    stats: [
      { value: '10%', label: 'Instant off' },
      { value: 'New', label: 'Customer deal' },
      { value: 'All', label: 'Main categories' },
    ],
  },
  {
    id: 'save5',
    label: 'Shop More Save More',
    title: 'Spend Rs. 2,999+ And Unlock 5% Off',
    code: 'SAVE5',
    description:
      'Shorts, pants aur accessories ko mix karke cart value badhao aur extra savings pao.',
    stats: [
      { value: '5%', label: 'Cart discount' },
      { value: '2999+', label: 'Order value' },
      { value: 'Easy', label: 'Auto apply ready' },
    ],
  },
  {
    id: 'duo12',
    label: 'Closet Combo',
    title: 'Buy Any 2 Styles And Save 12%',
    code: 'DUO12',
    description:
      'Top aur pants ya dress aur accessories combo ke saath weekend shopping ko aur rewarding banao.',
    stats: [
      { value: '2', label: 'Styles in cart' },
      { value: '12%', label: 'Combo off' },
      { value: 'Mix', label: 'Cross category' },
    ],
  },
  {
    id: 'luxe15',
    label: 'Premium Offer',
    title: 'Flat 15% Off Above Rs. 4,999',
    code: 'LUXE15',
    description:
      'Festive dresses, co ord sets aur statement looks ke liye higher cart par bigger offer ready hai.',
    stats: [
      { value: '15%', label: 'Big savings' },
      { value: '4999+', label: 'Premium spend' },
      { value: 'Fast', label: 'Luxury checkout' },
    ],
  },
]

const filters = ['Rs', 'Size']

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

const productImages = [
  '/catalog/pexels-photo-34959983.jpeg',
  '/catalog/pexels-photo-31589288.jpeg',
  '/catalog/pexels-photo-27379814.webp',
  '/catalog/pexels-photo-7572653.jpeg',
  '/catalog/pexels-photo-36104929.jpeg',
  '/catalog/pexels-photo-15569943.jpeg',
  '/catalog/pexels-photo-31303399.jpeg',
  '/catalog/pexels-photo-36409025.jpeg',
  '/catalog/pexels-photo-17018847.jpeg',
  '/catalog/pexels-photo-28683656.jpeg',
  '/catalog/pexels-photo-12002408.jpeg',
  '/catalog/pexels-photo-34421951.jpeg',
  '/catalog/pexels-photo-16814117.jpeg',
  '/catalog/pexels-photo-37255631.jpeg',
  '/catalog/pexels-photo-31649562%20(1).jpeg',
  '/catalog/pexels-photo-31649562.jpeg',
  '/catalog/pexels-photo-29666299.jpeg',
  '/catalog/pexels-photo-20544951.jpeg',
  '/catalog/pexels-photo-17472034.jpeg',
  '/catalog/pexels-photo-7249953.jpeg',
  '/catalog/pexels-photo-14108017.jpeg',
]

const baseProducts = [
  {
    name: 'Blush Bloom Dress',
    price: '1,650.00',
    rating: 5,
    reviews: 2,
    soldOut: true,
  },
  {
    name: 'Merlot Shirt Dress',
    price: '3,495.00',
  },
  {
    name: 'Cream Dot Shift',
    price: '2,990.00',
    rating: 5,
    reviews: 2,
    soldOut: true,
  },
  {
    name: 'Ivory Whisper Maxi',
    price: '3,490.00',
  },
  {
    name: 'Noa Stripe Dress',
    price: '3,448.00',
    soldOut: true,
  },
  {
    name: 'Mili Garden Dress',
    price: '2,200.00',
    soldOut: true,
  },
  {
    name: 'Pleated Candy Dress',
    price: '3,490.00',
    rating: 5,
    reviews: 1,
  },
  {
    name: 'Midnight Lane Gown',
    price: '3,500.00',
  },
  {
    name: 'Go Denim Co ord',
    price: '1,650.00',
    rating: 5,
    reviews: 4,
    soldOut: true,
    asSeenOn: true,
  },
  {
    name: 'Embroidered Noir',
    price: '1,600.00',
    rating: 5,
    reviews: 6,
    asSeenOn: true,
  },
  {
    name: 'Rose Wonder Dress',
    price: '1,600.00',
    asSeenOn: true,
  },
  {
    name: 'Meher Print Dress',
    price: '1,650.00',
    rating: 5,
    reviews: 1,
  },
  {
    name: 'Scarlet Sindoor',
    price: '1,850.00',
    rating: 5,
    reviews: 4,
    asSeenOn: true,
  },
  {
    name: 'Fuchsia V Neck Co ord',
    price: '1,232.00',
    oldPrice: '1,450.00',
    soldOut: true,
  },
  {
    name: 'Royal Blue Edit',
    price: '1,899.00',
    rating: 5,
    reviews: 6,
    asSeenOn: true,
  },
  {
    name: 'Little Heart Jeans',
    price: '2,500.00',
    asSeenOn: true,
  },
  {
    name: 'Lifafa Denim Vest',
    price: '1,800.00',
    rating: 5,
    reviews: 4,
    asSeenOn: true,
  },
  {
    name: 'Lara Cutwork Denim',
    price: '2,300.00',
    soldOut: true,
    asSeenOn: true,
  },
  {
    name: 'Cocoa Twist Set',
    price: '2,099.00',
  },
  {
    name: 'Rosey Gingham Maxi',
    price: '1,995.00',
    soldOut: true,
  },
  {
    name: 'Young White Rich Shirt',
    price: '5,145.00',
  },
]

const productCategories = [
  'Dress',
  'Shirt',
  'Dress',
  'Top',
  'Dress',
  'Dress',
  'Dress',
  'Dress',
  'Co ord set',
  'Dress',
  'Dress',
  'Dress',
  'Dress',
  'Co ord set',
  'Dress',
  'Pants',
  'Top',
  'Pants',
  'Co ord set',
  'Dress',
  'Shirt',
]

const productColorSets = [
  ['Baby Pink', 'Champagne', 'Pearl White'],
  ['Lilac', 'Black', 'Rose Gold'],
  ['Cream', 'Gold', 'Blush'],
  ['Mocha Dot', 'Dusty Rose', 'Sand'],
  ['Violet', 'Silver', 'Rosewood'],
  ['Sunflower', 'Moss', 'Ivory'],
  ['Ruby', 'Wine', 'Soft Gold'],
  ['Nude Gold', 'Silver Mist', 'Black'],
  ['Scarlet', 'Classic Red', 'Ruby Glow'],
  ['Mono Noir', 'Charcoal', 'Pearl'],
  ['Blue Floral', 'Cloud White', 'Dusty Blue'],
  ['Blush Princess', 'Powder Pink', 'Silver'],
  ['Lavender Garden', 'Mauve', 'Lilac Bloom'],
  ['Pink Bloom', 'Berry Rose', 'Soft Coral'],
  ['Black', 'Midnight', 'Olive Sand'],
  ['Ivory White', 'Champagne', 'Vanilla'],
  ['Ivory Lace', 'Bridal White', 'Silver'],
  ['Pearl White', 'Cream', 'Sage'],
  ['Storm Grey', 'Slate', 'Black'],
  ['Paisley Pink', 'Orchid', 'Mint'],
  ['Rose Nude', 'Mocha Pink', 'Champagne'],
]

const productSizeSets = [
  ['XS', 'S', 'M', 'L'],
  ['S', 'M', 'L', 'XL'],
  ['M', 'L', 'XL', 'XXL'],
]

const sizeFilterLabels = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const products = baseProducts.map((product, index) => {
  const gallery = Array.from({ length: 4 }, (_, offset) => {
    return productImages[(index + offset) % productImages.length]
  })
  const sizeLabels = productSizeSets[index % productSizeSets.length]
  const sizes = sizeLabels.map((label, sizeIndex) => ({
    label,
    available: product.soldOut ? false : !(sizeIndex === 0 && index % 4 === 0),
  }))
  const colors = productColorSets[index % productColorSets.length]
  const category = productCategories[index % productCategories.length]
  const availableSizeLabels = sizes
    .filter((size) => size.available)
    .map((size) => size.label)
    .join(', ')

  return {
    ...product,
    id: `aryass-product-${index + 1}`,
    image: gallery[0],
    gallery,
    priceValue: Number(product.price.replace(/,/g, '')),
    category,
    colors,
    sizes,
    sku: `ARY-${String(index + 1).padStart(3, '0')}-${category.slice(0, 2).toUpperCase()}`,
    stockCount: product.soldOut ? 0 : 4 + (index % 7),
    shippingNote:
      index % 2 === 0
        ? 'Shipping calculated at checkout'
        : 'Free shipping above Rs. 1,999',
    label: index % 3 === 0 ? 'Aryass Edit' : 'New Arrival',
    description: [
      `${product.name} modern festive dressing aur elevated daily styling ke beech ka balance create karta hai. Fluid silhouette aur polished finish is look ko day events se dinner plans tak easy banati hai.`,
      `Soft handfeel, graceful drape aur refined detailing ke saath yeh piece wardrobe me instantly premium feel add karta hai. Lightweight structure ki wajah se long wear ke liye bhi comfortable rehta hai.`,
    ],
    styleNotes: [
      `Perfect for ${category.toLowerCase()} lovers jo statement look ke saath comfort bhi chahte hain.`,
      `Best styled with minimal gold accessories, sleek heels, and a structured bag.`,
      `Sizes available: ${availableSizeLabels || sizeLabels.join(', ')}.`,
    ],
    deliveryMeta: [
      { icon: 'shipping', title: 'Estimated delivery', text: '2-6 business days' },
      { icon: 'return', title: 'Easy returns', text: 'Within 7 days of delivery' },
      { icon: 'lock', title: 'Secure payment', text: '100% safe checkout flow' },
    ],
    storyTitle: `${product.name} for polished moments`,
    storyText:
      'Aryass pieces are designed to move from intimate celebrations to elevated city looks without losing their soft, graceful appeal.',
  }
})

const sizeFilterOptions = sizeFilterLabels.map((label) => ({
  label,
  count: products.filter((product) =>
    product.sizes.some((size) => size.label === label && size.available),
  ).length,
}))

function formatPrice(price) {
  return `Rs. ${price}`
}

function formatPriceValue(price) {
  return formatPrice(
    price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  )
}

function matchSizeFilter(product, selectedSizes) {
  return (
    !selectedSizes.length ||
    product.sizes.some((size) => size.available && selectedSizes.includes(size.label))
  )
}

function getNormalizedPriceRange(minPriceInput, maxPriceInput) {
  const minPrice = minPriceInput ? Number(minPriceInput) : null
  const maxPrice = maxPriceInput ? Number(maxPriceInput) : null

  if (minPrice !== null && maxPrice !== null) {
    return {
      minPrice: Math.min(minPrice, maxPrice),
      maxPrice: Math.max(minPrice, maxPrice),
    }
  }

  return { minPrice, maxPrice }
}

function matchPriceFilter(product, minPriceInput, maxPriceInput) {
  const { minPrice, maxPrice } = getNormalizedPriceRange(minPriceInput, maxPriceInput)

  if (minPrice !== null && product.priceValue < minPrice) {
    return false
  }

  if (maxPrice !== null && product.priceValue > maxPrice) {
    return false
  }

  return true
}

function maskPhoneNumber(phoneNumber) {
  if (phoneNumber.length < 4) {
    return `+91 ${phoneNumber}`
  }

  return `+91 ${phoneNumber.slice(0, 2)}******${phoneNumber.slice(-2)}`
}

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
    left: <path d="m14.5 6.5-5 5.5 5 5.5" />,
    right: <path d="m9.5 6.5 5 5.5-5 5.5" />,
    shipping: (
      <path d="M3 8h10v8H3V8Zm10 2h3l2 2v4h-5v-6Zm-7 8h7M17 18h1M6 18a1.5 1.5 0 1 0 0 .01ZM17 18a1.5 1.5 0 1 0 0 .01Z" />
    ),
    return: <path d="M8 8H4v4M4.5 11.5A7.5 7.5 0 1 0 7 6.2M16 16h4v-4M19.5 12.5A7.5 7.5 0 0 0 17 17.8" />,
    lock: <path d="M7 11V8.8A5 5 0 0 1 17 8.8V11M6 11h12v8H6v-8Zm6 3v2.8" />,
    check: <path d="m5.5 12 4 4 9-9" />,
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
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function ProductArtwork({ product, onOpen }) {
  return (
    <button
      type="button"
      className="product-art-button"
      aria-label={`Open ${product.name}`}
      onClick={() => onOpen(product)}
    >
      <div className="product-art">
        {product.soldOut ? <span className="product-badge">Sold out</span> : null}
        {product.asSeenOn ? <span className="product-stamp">as seen on</span> : null}
        <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
      </div>
    </button>
  )
}

function ProductCard({ product, onChooseOption }) {
  return (
    <article className="product-card">
      <ProductArtwork product={product} onOpen={onChooseOption} />

      <div className="product-copy">
        <h3>{product.name}</h3>
        {product.rating ? (
          <p className="rating-row">
            {'\u2605'.repeat(product.rating)}
            <span>({product.reviews})</span>
          </p>
        ) : (
          <div className="rating-row rating-row--spacer" aria-hidden="true" />
        )}
        <p className="price-row">
          {product.oldPrice ? <span className="old-price">{formatPrice(product.oldPrice)}</span> : null}
          <span>{formatPrice(product.price)}</span>
        </p>
      </div>

      <button type="button" className="option-button" onClick={() => onChooseOption(product)}>
        Choose options
      </button>
    </article>
  )
}

function LoginModal({
  isOpen,
  onClose,
  loginStep,
  phoneNumber,
  otpDigits,
  loginError,
  loginMessage,
  onPhoneChange,
  onPhoneSubmit,
  onVerifyOtp,
  onOtpChange,
  onOtpKeyDown,
  onResendOtp,
  otpInputRefs,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="login-modal-backdrop" onClick={onClose} aria-hidden={!isOpen}>
      <div
        className="login-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-label="Login with OTP"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="login-close-button" aria-label="Close login" onClick={onClose}>
          <Icon name="close" />
        </button>

        <div className="login-modal-card">
          <div className="login-modal-brand">
            <span className="brand-word">ARYASS</span>
            <span className="brand-tagline">FEEL BEFORE THE MOMENT</span>
          </div>

          {loginStep === 'phone' ? (
            <form className="login-form" onSubmit={onPhoneSubmit}>
              <p className="login-step-kicker">Enter your mobile number</p>
              <div className="phone-field">
                <span className="phone-prefix">
                  <span className="country-flag" />
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(event) => onPhoneChange(event.target.value)}
                  placeholder="Enter 10 digit number"
                  aria-label="Mobile number"
                />
              </div>

              <p className="login-helper-text">
                Submit karte hi OTP step open hoga. Demo flow ke liye code screen par show hoga.
              </p>

              {loginError ? <p className="login-error">{loginError}</p> : null}

              <button type="submit" className="login-submit-button">
                Submit
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={onVerifyOtp}>
              <p className="login-step-kicker">Enter OTP below</p>
              <div className="otp-input-row">
                {otpDigits.map((digit, index) => (
                  <input
                    key={`otp-${index}`}
                    ref={(element) => {
                      otpInputRefs.current[index] = element
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => onOtpChange(index, event.target.value)}
                    onKeyDown={(event) => onOtpKeyDown(event, index)}
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              <p className="login-helper-text">{loginMessage}</p>

              <button type="button" className="otp-resend-button" onClick={onResendOtp}>
                Resend OTP
              </button>

              {loginError ? <p className="login-error">{loginError}</p> : null}

              <button type="submit" className="login-submit-button">
                Verify
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function SizeFilterPage({
  sizeOptions,
  selectedSizes,
  filteredCount,
  onToggleSize,
  onReset,
  onBack,
}) {
  return (
    <main className="filter-page" id="collection">
      <section className="filter-page-shell" aria-label="Size filter">
        <div className="filter-page-top">
          <button type="button" className="back-button" onClick={onBack}>
            <Icon name="left" />
            Back to collection
          </button>

          <button
            type="button"
            className="filter-reset-button"
            onClick={onReset}
            disabled={!selectedSizes.length}
          >
            Reset
          </button>
        </div>

        <div className="filter-page-header">
          <p className="collection-label">Filter by</p>
          <h1>Size</h1>
          <p className="collection-text">
            Tap sizes to refine the collection, then open the filtered product grid.
          </p>
        </div>

        <div className="filter-selection-row">
          <strong>{selectedSizes.length} selected</strong>
          <span>{filteredCount} products</span>
        </div>

        <div className="size-filter-list">
          {sizeOptions.map((option) => {
            const isChecked = selectedSizes.includes(option.label)

            return (
              <label key={option.label} className="size-filter-item">
                <input
                  className="size-filter-checkbox"
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleSize(option.label)}
                />
                <span className="size-filter-label">
                  {option.label} ({option.count})
                </span>
              </label>
            )
          })}
        </div>

        <div className="filter-page-actions">
          <button
            type="button"
            className="secondary-action-button"
            onClick={onReset}
            disabled={!selectedSizes.length}
          >
            Clear sizes
          </button>
          <button type="button" className="primary-action-button" onClick={onBack}>
            Show {filteredCount} products
          </button>
        </div>
      </section>
    </main>
  )
}

function PriceFilterPage({
  highestPrice,
  minPriceInput,
  maxPriceInput,
  filteredCount,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
  onBack,
}) {
  return (
    <main className="filter-page price-filter-page" id="collection">
      <button type="button" className="back-button" onClick={onBack}>
        <Icon name="left" />
        Back to collection
      </button>

      <section className="price-filter-panel" aria-label="Price filter">
        <div className="price-filter-summary">
          <p>The highest price is {formatPriceValue(highestPrice)}</p>
          <button
            type="button"
            className="filter-reset-button"
            onClick={onReset}
            disabled={!minPriceInput && !maxPriceInput}
          >
            Reset
          </button>
        </div>

        <div className="price-filter-input-row">
          <label className="price-filter-input-group">
            <span>&#8377;</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="From"
              value={minPriceInput}
              onChange={(event) => onMinPriceChange(event.target.value)}
              aria-label="Minimum price"
            />
          </label>

          <label className="price-filter-input-group">
            <span>&#8377;</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="To"
              value={maxPriceInput}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              aria-label="Maximum price"
            />
          </label>
        </div>
      </section>

      <div className="filter-page-actions filter-page-actions--single">
        <button type="button" className="primary-action-button" onClick={onBack}>
          Show {filteredCount} products
        </button>
      </div>
    </main>
  )
}

function ProductDetailPage({
  product,
  selectedImage,
  selectedColor,
  selectedSize,
  quantity,
  onBack,
  onSelectImage,
  onSelectColor,
  onSelectSize,
  onChangeQuantity,
  onChooseOption,
  relatedProducts,
}) {
  return (
    <main className="detail-page">
      <section className="detail-breadcrumb-row">
        <button type="button" className="back-button" onClick={onBack}>
          <Icon name="left" />
          Back to collection
        </button>
        <p>
          Aryass / {product.category} / <span>{product.name}</span>
        </p>
      </section>

      <section className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-main-media">
            {product.soldOut ? <span className="detail-main-badge">Sold out</span> : null}
            <img src={selectedImage} alt={product.name} />
          </div>

          <div className="detail-thumb-row">
            {product.gallery.map((image, index) => (
              <button
                key={`${product.id}-thumb-${index}`}
                type="button"
                className={`detail-thumb-button ${selectedImage === image ? 'is-active' : ''}`}
                aria-label={`Show image ${index + 1} for ${product.name}`}
                onClick={() => onSelectImage(image)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-summary">
          <p className="detail-label">{product.label}</p>
          <h1>{product.name}</h1>

          {product.rating ? (
            <p className="detail-rating">
              {'\u2605'.repeat(product.rating)}
              <span>{product.reviews} reviews</span>
            </p>
          ) : (
            <p className="detail-rating detail-rating--muted">No reviews yet</p>
          )}

          <p className="detail-price">
            {product.oldPrice ? <span className="old-price">{formatPrice(product.oldPrice)}</span> : null}
            <strong>{formatPrice(product.price)}</strong>
          </p>
          <p className="detail-shipping-note">{product.shippingNote}</p>

          <div className="detail-option-group">
            <div className="detail-option-head">
              <span>Color</span>
              <strong>{selectedColor}</strong>
            </div>
            <div className="detail-chip-row">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`detail-chip ${selectedColor === color ? 'is-active' : ''}`}
                  onClick={() => onSelectColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-option-group">
            <div className="detail-option-head">
              <span>Size</span>
              <strong>{selectedSize}</strong>
            </div>
            <div className="detail-chip-row detail-chip-row--sizes">
              {product.sizes.map((size) => (
                <button
                  key={size.label}
                  type="button"
                  className={`detail-chip detail-chip--size ${
                    selectedSize === size.label ? 'is-active' : ''
                  }`}
                  onClick={() => onSelectSize(size.label)}
                  disabled={!size.available}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <p className="detail-sku">{product.sku}</p>
          <p className={`detail-stock ${product.soldOut ? 'is-soldout' : ''}`}>
            <Icon name="check" />
            {product.soldOut
              ? 'Currently sold out. Join upcoming restock edit.'
              : `${product.stockCount} pieces in stock`}
          </p>

          <div className="detail-buy-row">
            <div className="quantity-selector" aria-label="Quantity selector">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => onChangeQuantity(-1)}
                disabled={quantity === 1 || product.soldOut}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => onChangeQuantity(1)}
                disabled={product.soldOut}
              >
                +
              </button>
            </div>

            <button type="button" className="size-chart-button">
              Size chart
            </button>
          </div>

          <div className="detail-action-stack">
            <button type="button" className="primary-action-button" disabled={product.soldOut}>
              {product.soldOut ? 'Notify me' : 'Add to cart'}
            </button>
            <button type="button" className="secondary-action-button" disabled={product.soldOut}>
              Buy it now
            </button>
          </div>

          <div className="detail-benefit-grid">
            {product.deliveryMeta.map((item) => (
              <div key={item.title} className="detail-benefit-card">
                <Icon name={item.icon} />
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <div className="detail-copy-block">
            <h2>{product.storyTitle}</h2>
            {product.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="detail-style-notes">
              {product.styleNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </div>

          <div className="detail-accordion">
            <details open>
              <summary>Shipping and Delivery</summary>
              <p>Metro cities me 2-4 working days aur other locations me 4-6 working days.</p>
            </details>
            <details>
              <summary>Return and Exchange</summary>
              <p>Eligible pieces par easy exchange support available hai within 7 days of delivery.</p>
            </details>
            <details>
              <summary>Fabric and Care</summary>
              <p>Gentle steam, light hand care aur padded hanger storage se finish longer fresh rahegi.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="detail-reviews-section">
        <div className="detail-section-head">
          <p className="collection-label">Customer Reviews</p>
          <h2>People are saving this look for their next occasion.</h2>
        </div>
        <div className="review-card">
          <p className="review-empty">There are no reviews yet. Be the first to review this style.</p>
          <button type="button" className="review-button">
            Write a review
          </button>
        </div>
      </section>

      <section className="detail-related-section">
        <div className="detail-section-head">
          <p className="collection-label">You may also like</p>
          <h2>More Aryass picks around this mood</h2>
        </div>

        <div className="product-grid product-grid--related">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              product={relatedProduct}
              onChooseOption={onChooseOption}
            />
          ))}
        </div>
      </section>

      <section className="story-feature-card">
        <div className="story-feature-media">
          <img src={product.gallery[1]} alt={`${product.name} editorial look`} />
        </div>
        <div className="story-feature-copy">
          <p className="collection-label">Our Story</p>
          <h2>{product.storyTitle}</h2>
          <p>{product.storyText}</p>
          <button type="button" className="story-read-button" onClick={onBack}>
            Continue shopping
          </button>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeMessage, setActiveMessage] = useState(0)
  const [activeOffer, setActiveOffer] = useState(0)
  const [activeFilterPage, setActiveFilterPage] = useState(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginStep, setLoginStep] = useState('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', ''])
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginMessage, setLoginMessage] = useState(
    'Enter your mobile number to continue with secure sign in.',
  )
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [accountPhone, setAccountPhone] = useState('')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedFilterSizes, setSelectedFilterSizes] = useState([])
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [quantity, setQuantity] = useState(1)
  const otpInputRefs = useRef([])

  const selectedProduct = products.find((product) => product.id === selectedProductId) || null
  const sizeMatchedProducts = products.filter((product) =>
    matchSizeFilter(product, selectedFilterSizes),
  )
  const filteredProducts = sizeMatchedProducts.filter((product) =>
    matchPriceFilter(product, minPriceInput, maxPriceInput),
  )
  const highestVisiblePrice = sizeMatchedProducts.length
    ? Math.max(...sizeMatchedProducts.map((product) => product.priceValue))
    : Math.max(...products.map((product) => product.priceValue))
  const relatedProducts = selectedProduct
    ? products.filter((product) => product.id !== selectedProduct.id).slice(0, 4)
    : []

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveMessage((current) => (current + 1) % announcementMessages.length)
    }, 3800)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveOffer((current) => (current + 1) % offerSlides.length)
    }, 4200)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setIsLoginOpen(false)
        setActiveFilterPage(null)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = isMenuOpen || isLoginOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isLoginOpen, isMenuOpen])

  const currentMessage = announcementMessages[activeMessage]

  const openLoginModal = () => {
    setLoginStep('phone')
    setPhoneNumber('')
    setOtpDigits(['', '', '', ''])
    setGeneratedOtp('')
    setLoginError('')
    setLoginMessage(
      isLoggedIn
        ? `Signed in as ${accountPhone}. Enter another number if you want to switch account.`
        : 'Enter your mobile number to continue with secure sign in.',
    )

    setIsMenuOpen(false)
    setIsLoginOpen(true)
  }

  const closeLoginModal = () => {
    setIsLoginOpen(false)
    setLoginError('')
  }

  const openProduct = (product) => {
    const defaultSize =
      product.sizes.find((size) => size.available)?.label || product.sizes[0].label

    setSelectedProductId(product.id)
    setSelectedImage(product.gallery[0])
    setSelectedColor(product.colors[0])
    setSelectedSize(defaultSize)
    setQuantity(1)
    setActiveFilterPage(null)
    setIsMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeProduct = () => {
    setSelectedProductId(null)
  }

  const openSizeFilterPage = () => {
    setSelectedProductId(null)
    setIsMenuOpen(false)
    setActiveFilterPage('size')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openPriceFilterPage = () => {
    setSelectedProductId(null)
    setIsMenuOpen(false)
    setActiveFilterPage('price')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeSizeFilterPage = () => {
    setActiveFilterPage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closePriceFilterPage = () => {
    setActiveFilterPage(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleFilterSize = (label) => {
    setSelectedFilterSizes((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  const resetFilterSizes = () => {
    setSelectedFilterSizes([])
  }

  const handleMinPriceChange = (value) => {
    setMinPriceInput(value.replace(/\D/g, '').slice(0, 7))
  }

  const handleMaxPriceChange = (value) => {
    setMaxPriceInput(value.replace(/\D/g, '').slice(0, 7))
  }

  const resetPriceFilter = () => {
    setMinPriceInput('')
    setMaxPriceInput('')
  }

  const handlePhoneSubmit = (event) => {
    event.preventDefault()

    const cleanedNumber = phoneNumber.replace(/\D/g, '').slice(0, 10)

    if (cleanedNumber.length !== 10) {
      setLoginError('Please enter a valid 10 digit mobile number.')
      return
    }

    const nextOtp = String(1000 + Math.floor(Math.random() * 9000))
    setGeneratedOtp(nextOtp)
    setPhoneNumber(cleanedNumber)
    setOtpDigits(['', '', '', ''])
    setLoginStep('otp')
    setLoginError('')
    setLoginMessage(`OTP sent to ${maskPhoneNumber(cleanedNumber)}. Demo OTP: ${nextOtp}`)

    window.setTimeout(() => {
      otpInputRefs.current[0]?.focus()
    }, 40)
  }

  const handleOtpChange = (index, value) => {
    const numericValue = value.replace(/\D/g, '').slice(-1)
    const nextOtpDigits = [...otpDigits]
    nextOtpDigits[index] = numericValue
    setOtpDigits(nextOtpDigits)
    setLoginError('')

    if (numericValue && index < otpInputRefs.current.length - 1) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendOtp = () => {
    if (phoneNumber.length !== 10) {
      setLoginError('Please go back and enter your number again.')
      return
    }

    const nextOtp = String(1000 + Math.floor(Math.random() * 9000))
    setGeneratedOtp(nextOtp)
    setOtpDigits(['', '', '', ''])
    setLoginError('')
    setLoginMessage(`Fresh OTP sent to ${maskPhoneNumber(phoneNumber)}. Demo OTP: ${nextOtp}`)

    window.setTimeout(() => {
      otpInputRefs.current[0]?.focus()
    }, 40)
  }

  const handleVerifyOtp = (event) => {
    event.preventDefault()

    if (otpDigits.join('') !== generatedOtp) {
      setLoginError('OTP does not match. Please try again or resend OTP.')
      return
    }

    setIsLoggedIn(true)
    setAccountPhone(maskPhoneNumber(phoneNumber))
    setLoginError('')
    setIsLoginOpen(false)
  }

  const handleMenuLinkClick = () => {
    setSelectedProductId(null)
    setActiveFilterPage(null)
    setIsMenuOpen(false)
  }

  const handleQuantityChange = (change) => {
    setQuantity((current) => Math.max(1, current + change))
  }

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

        <a
          className="brand-mark"
          href="#top"
          aria-label="Aryass home"
          onClick={() => {
            setSelectedProductId(null)
            setActiveFilterPage(null)
          }}
        >
          <span className="brand-word">ARYASS</span>
          <span className="brand-tagline">FEEL BEFORE THE MOMENT</span>
        </a>

        <div className="header-side header-side--right">
          <button type="button" className="header-login" onClick={openLoginModal}>
            {isLoggedIn ? 'My Account' : 'Login'}
          </button>
          <button type="button" className="header-icon" aria-label="Account" onClick={openLoginModal}>
            <Icon name="account" />
          </button>
          <button
            type="button"
            className="header-icon header-icon--cart"
            aria-label="Shopping bag"
            onClick={selectedProduct ? () => setSelectedProductId(selectedProduct.id) : undefined}
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
          <div className="drawer-tool-row">
            <button
              type="button"
              className="drawer-tool-button drawer-tool-button--close"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon name="close" />
            </button>

            <button type="button" className="drawer-tool-button" aria-label="Search collection">
              <Icon name="search" />
            </button>
          </div>
        </div>

        <nav className="drawer-links">
          {mobileMenuItems.map((item) => (
            <a key={item} href="#collection" onClick={handleMenuLinkClick}>
              <span>{item}</span>
              <Icon name="chevron" />
            </a>
          ))}
        </nav>

        <div className="drawer-footer">
          <div className="drawer-socials">
            <a href="#footer" aria-label="Facebook" onClick={() => setIsMenuOpen(false)}>
              <Icon name="facebook" />
            </a>
            <a href="#footer" aria-label="Instagram" onClick={() => setIsMenuOpen(false)}>
              <Icon name="instagram" />
            </a>
            <a href="#footer" aria-label="YouTube" onClick={() => setIsMenuOpen(false)}>
              <Icon name="youtube" />
            </a>
          </div>
        </div>
      </aside>

      {selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          selectedImage={selectedImage}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          quantity={quantity}
          onBack={closeProduct}
          onSelectImage={setSelectedImage}
          onSelectColor={setSelectedColor}
          onSelectSize={setSelectedSize}
          onChangeQuantity={handleQuantityChange}
          onChooseOption={openProduct}
          relatedProducts={relatedProducts}
        />
      ) : activeFilterPage === 'size' ? (
        <SizeFilterPage
          sizeOptions={sizeFilterOptions}
          selectedSizes={selectedFilterSizes}
          filteredCount={filteredProducts.length}
          onToggleSize={toggleFilterSize}
          onReset={resetFilterSizes}
          onBack={closeSizeFilterPage}
        />
      ) : activeFilterPage === 'price' ? (
        <PriceFilterPage
          highestPrice={highestVisiblePrice}
          minPriceInput={minPriceInput}
          maxPriceInput={maxPriceInput}
          filteredCount={filteredProducts.length}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onReset={resetPriceFilter}
          onBack={closePriceFilterPage}
        />
      ) : (
        <main className="collection-page" id="collection">
          <section className="offer-slider-section" aria-label="Offers">
            <div className="offer-slider-frame">
              <div
                className="offer-slider-track"
                style={{ transform: `translateX(-${activeOffer * 100}%)` }}
              >
                {offerSlides.map((offer) => (
                  <article
                    key={offer.id}
                    className={`offer-slide-card ${offer.image ? 'offer-slide-card--visual' : ''}`}
                  >
                    {offer.image ? (
                      <img className="offer-slide-banner" src={offer.image} alt={offer.alt} />
                    ) : (
                      <>
                        <div className="offer-slide-content">
                          <span className="offer-pill">{offer.label}</span>
                          <h3>{offer.title}</h3>
                          <p>{offer.description}</p>
                          <div className="offer-code-row">
                            <span>Use code</span>
                            <strong>{offer.code}</strong>
                          </div>
                        </div>

                        <div className="offer-stats-grid">
                          {offer.stats.map((stat) => (
                            <div key={stat.label} className="offer-stat-card">
                              <strong>{stat.value}</strong>
                              <span>{stat.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            </div>

            <div className="offer-dots" role="tablist" aria-label="Offer slides">
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
                <button
                  key={filter}
                  type="button"
                  className={`toolbar-chip ${
                    (filter === 'Size' && selectedFilterSizes.length) ||
                    (filter === 'Rs' && (minPriceInput || maxPriceInput))
                      ? 'is-active'
                      : ''
                  }`}
                  onClick={
                    filter === 'Size'
                      ? openSizeFilterPage
                      : filter === 'Rs'
                        ? openPriceFilterPage
                        : undefined
                  }
                >
                  {filter === 'Size' && selectedFilterSizes.length
                    ? `Size (${selectedFilterSizes.length})`
                    : filter}
                  <Icon name="chevron" />
                </button>
              ))}
            </div>

            <div className="sort-group">
              <strong>{filteredProducts.length} products</strong>
            </div>
          </section>

          <section className="product-grid" aria-label="Best seller products">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onChooseOption={openProduct} />
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
              <p className="callout-kicker">Login and OTP Added</p>
              <h2>Tap login, enter your number, and continue through the OTP card flow.</h2>
            </div>
            <button type="button" onClick={openLoginModal}>
              {isLoggedIn ? 'Open account' : 'Login'}
            </button>
          </section>
        </main>
      )}

      <footer className="site-footer" id="footer">
        <div className="footer-brand">
          <a
            href="#top"
            className="footer-logo"
            aria-label="Aryass home"
            onClick={() => {
              setSelectedProductId(null)
              setActiveFilterPage(null)
            }}
          >
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
            <a
              key={link}
              href="#collection"
              onClick={() => {
                setSelectedProductId(null)
                setActiveFilterPage(null)
              }}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          {quickLinks.map((link) => (
            <a
              key={link}
              href="#collection"
              onClick={() => {
                setSelectedProductId(null)
                setActiveFilterPage(null)
              }}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="footer-column">
          <h3>Our Achievements</h3>
          <p>Forbes Recognized</p>
          <p>Luxury edits made lighter for mobile browsing.</p>
          {isLoggedIn ? <p>Signed in as {accountPhone}</p> : null}
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

      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLoginModal}
        loginStep={loginStep}
        phoneNumber={phoneNumber}
        otpDigits={otpDigits}
        loginError={loginError}
        loginMessage={loginMessage}
        onPhoneChange={(value) => {
          setPhoneNumber(value.replace(/\D/g, '').slice(0, 10))
          setLoginError('')
        }}
        onPhoneSubmit={handlePhoneSubmit}
        onVerifyOtp={handleVerifyOtp}
        onOtpChange={handleOtpChange}
        onOtpKeyDown={handleOtpKeyDown}
        onResendOtp={handleResendOtp}
        otpInputRefs={otpInputRefs}
      />
    </div>
  )
}

export default App
