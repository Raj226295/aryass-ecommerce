import { useEffect, useRef, useState } from 'react'
import './App.css'
import CollectionPage from './components/CollectionPage'
import { PriceFilterPage, SizeFilterPage } from './components/FilterPages'
import Icon from './components/Icon'
import LoginModal from './components/LoginModal'
import ProductDetailPage from './components/ProductDetailPage'
import SocialLinks from './components/SocialLinks'
import {
  announcementMessages,
  collectionContentByCategory,
  defaultCategory,
  filters,
  formatPrice,
  getOfferSlidesForCategory,
  landingCollectionContent,
  maskPhoneNumber,
  matchPriceFilter,
  matchSizeFilter,
  mobileMenuItems,
  products,
  quickLinks,
  shopLinks,
  sizeFilterLabels,
} from './data/catalog'

const emptyReviewData = {
  rating: 0,
  text: '',
  name: '',
  email: '',
  photos: [],
}

const PAGE_SIZE = 16

function getDefaultSize(product, preferredSize = '') {
  if (preferredSize && product.sizes.some((size) => size.label === preferredSize)) {
    return preferredSize
  }

  return product.sizes.find((size) => size.available)?.label || product.sizes[0]?.label || ''
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
  const [activeCategory, setActiveCategory] = useState(defaultCategory)
  const [isCategoryScoped, setIsCategoryScoped] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [reviews, setReviews] = useState([])
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewData, setReviewData] = useState(emptyReviewData)
  const [currentPage, setCurrentPage] = useState(1)

  const otpInputRefs = useRef([])

  const selectedProduct = products.find((product) => product.id === selectedProductId) || null
  const activeCategoryProducts = isCategoryScoped
    ? products.filter((product) => product.category === activeCategory)
    : products
  const currentOfferSlides = getOfferSlidesForCategory(activeCategory, !isCategoryScoped)
  const sizeMatchedProducts = activeCategoryProducts.filter((product) =>
    matchSizeFilter(product, selectedFilterSizes),
  )
  const filteredProducts = sizeMatchedProducts.filter((product) =>
    matchPriceFilter(product, minPriceInput, maxPriceInput),
  )
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const sizeFilterOptions = sizeFilterLabels.map((label) => ({
    label,
    count: activeCategoryProducts.filter((product) =>
      product.sizes.some((size) => size.label === label && size.available),
    ).length,
  }))
  const highestVisiblePrice = sizeMatchedProducts.length
    ? Math.max(...sizeMatchedProducts.map((product) => product.priceValue))
    : Math.max(...activeCategoryProducts.map((product) => product.priceValue))
  const currentCollectionContent = isCategoryScoped
    ? collectionContentByCategory[activeCategory] || collectionContentByCategory[defaultCategory]
    : landingCollectionContent
  const currentCollectionTitle = isCategoryScoped ? activeCategory : landingCollectionContent.title
  const relatedProducts = selectedProduct
    ? [
        ...products.filter(
          (product) =>
            product.category === selectedProduct.category && product.id !== selectedProduct.id,
        ),
        ...products.filter(
          (product) =>
            product.category !== selectedProduct.category && product.id !== selectedProduct.id,
        ),
      ].slice(0, 4)
    : []
  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const currentMessage = announcementMessages[activeMessage]

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
      setActiveOffer((current) => (current + 1) % currentOfferSlides.length)
    }, 4200)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [currentOfferSlides.length])

  useEffect(() => {
    setActiveOffer(0)
  }, [activeCategory, isCategoryScoped])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, isCategoryScoped, minPriceInput, maxPriceInput, selectedFilterSizes])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setIsLoginOpen(false)
        setIsCartOpen(false)
        setIsReviewOpen(false)
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
    document.body.style.overflow =
      isMenuOpen || isLoginOpen || isCartOpen || isReviewOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isCartOpen, isLoginOpen, isMenuOpen, isReviewOpen])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToCollectionStart = () => {
    const collectionNode = document.getElementById('collection')

    if (collectionNode) {
      collectionNode.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    scrollToTop()
  }

  const resetCollectionFilters = () => {
    setSelectedFilterSizes([])
    setMinPriceInput('')
    setMaxPriceInput('')
  }

  const handlePageChange = (nextPage) => {
    if (nextPage === currentPage) {
      return
    }

    setCurrentPage(nextPage)
    window.requestAnimationFrame(() => {
      scrollToCollectionStart()
    })
  }

  const navigateToCategory = (category) => {
    setSelectedProductId(null)
    setActiveFilterPage(null)
    setActiveCategory(category)
    setIsCategoryScoped(true)
    setSelectedImage('')
    setSelectedColor('')
    setSelectedSize('')
    setQuantity(1)
    setIsMenuOpen(false)
    setIsCartOpen(false)
    setIsReviewOpen(false)
    setActiveOffer(0)
    resetCollectionFilters()
    scrollToTop()
  }

  const handleMenuCategorySelect = (category) => {
    if (category === defaultCategory) {
      goHome()
      return
    }

    navigateToCategory(category)
  }

  const goHome = () => {
    setSelectedProductId(null)
    setActiveFilterPage(null)
    setActiveCategory(defaultCategory)
    setIsCategoryScoped(false)
    setSelectedImage('')
    setSelectedColor('')
    setSelectedSize('')
    setQuantity(1)
    setIsMenuOpen(false)
    setIsCartOpen(false)
    setIsReviewOpen(false)
    setActiveOffer(0)
    resetCollectionFilters()
    scrollToTop()
  }

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

  const openProduct = (product, initialSelection = {}) => {
    setSelectedProductId(product.id)
    setSelectedImage(product.gallery[0])
    setSelectedColor(initialSelection.color || product.colors[0] || '')
    setSelectedSize(getDefaultSize(product, initialSelection.size))
    setQuantity(1)
    setActiveFilterPage(null)
    setIsMenuOpen(false)
    setIsCartOpen(false)
    setIsReviewOpen(false)
    scrollToTop()
  }

  const closeProduct = () => {
    setSelectedProductId(null)
    setIsReviewOpen(false)
  }

  const openSizeFilterPage = () => {
    setSelectedProductId(null)
    setIsMenuOpen(false)
    setActiveFilterPage('size')
    scrollToTop()
  }

  const openPriceFilterPage = () => {
    setSelectedProductId(null)
    setIsMenuOpen(false)
    setActiveFilterPage('price')
    scrollToTop()
  }

  const closeSizeFilterPage = () => {
    setActiveFilterPage(null)
    scrollToTop()
  }

  const closePriceFilterPage = () => {
    setActiveFilterPage(null)
    scrollToTop()
  }

  const toggleFilterSize = (label) => {
    setSelectedFilterSizes((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  const handleMinPriceChange = (value) => {
    setMinPriceInput(value.replace(/\D/g, '').slice(0, 7))
  }

  const handleMaxPriceChange = (value) => {
    setMaxPriceInput(value.replace(/\D/g, '').slice(0, 7))
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

  const handleQuantityChange = (change) => {
    setQuantity((current) => Math.max(1, current + change))
  }

  const openReview = () => {
    setIsReviewOpen(true)
  }

  const updateCartQty = (id, type, size, color) => {
    setCartItems((current) =>
      current.map((item) => {
        if (item.id !== id || item.size !== size || item.color !== color) {
          return item
        }

        return {
          ...item,
          qty: type === 'inc' ? item.qty + 1 : Math.max(1, item.qty - 1),
        }
      }),
    )
  }

  const addToCart = () => {
    if (!selectedProduct) {
      return
    }

    const existingItem = cartItems.find(
      (item) =>
        item.id === selectedProduct.id &&
        item.size === selectedSize &&
        item.color === selectedColor,
    )

    if (existingItem) {
      setCartItems((current) =>
        current.map((item) =>
          item.id === selectedProduct.id &&
          item.size === selectedSize &&
          item.color === selectedColor
            ? { ...item, qty: item.qty + quantity }
            : item,
        ),
      )
    } else {
      setCartItems((current) => [
        ...current,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: Number(selectedProduct.price.replace(/,/g, '')),
          qty: quantity,
          size: selectedSize,
          color: selectedColor,
          image: selectedProduct.image,
        },
      ])
    }

    setIsCartOpen(true)
  }

  const submitReview = () => {
    if (!reviewData.rating || !reviewData.text || !reviewData.name || !reviewData.email) {
      window.alert('Fill all details')
      return
    }

    const newReview = {
      id: Date.now(),
      ...reviewData,
    }

    setReviews((current) => [newReview, ...current])
    setReviewData(emptyReviewData)
    setIsReviewOpen(false)
  }

  const handlePhoto = (event) => {
    const files = [...event.target.files]
    const images = files.map((file) => URL.createObjectURL(file))

    setReviewData((current) => ({
      ...current,
      photos: [...current.photos, ...images].slice(0, 5),
    }))
  }

  return (
    <div className="page-shell" id="top">
      <div className="top-announcement">
        <SocialLinks className="social-strip" />

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
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setIsMenuOpen((open) => !open)}
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
          onClick={goHome}
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
            aria-label="Open cart"
            onClick={() => setIsCartOpen(true)}
          >
            <Icon name="bag" />

            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                background: 'black',
                color: 'white',
                fontSize: '10px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cartItemCount}
            </span>
          </button>
        </div>
      </header>

      <div
        className={`drawer-backdrop ${isMenuOpen ? 'is-visible' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        id="mobile-drawer"
        className={`mobile-drawer ${isMenuOpen ? 'is-open' : ''}`}
        style={{
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
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
            <a
              key={item}
              href="#collection"
              onClick={() => handleMenuCategorySelect(item)}
            >
              <span>{item}</span>
              <Icon name="chevron" />
            </a>
          ))}
        </nav>

        <div className="drawer-footer">
          <SocialLinks
            className="drawer-socials"
            onLinkClick={() => {
              setIsMenuOpen(false)
            }}
          />
        </div>
      </div>

      {selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          onAddToCart={addToCart}
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
          onOpenReview={openReview}
          reviewCount={reviews.length}
        />
      ) : activeFilterPage === 'size' ? (
        <SizeFilterPage
          sizeOptions={sizeFilterOptions}
          selectedSizes={selectedFilterSizes}
          filteredCount={filteredProducts.length}
          onToggleSize={toggleFilterSize}
          onReset={resetCollectionFilters}
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
          onReset={resetCollectionFilters}
          onBack={closePriceFilterPage}
        />
      ) : (
        <CollectionPage
          activeCategory={activeCategory}
          collectionTitle={currentCollectionTitle}
          collectionContent={currentCollectionContent}
          offerSlides={currentOfferSlides}
          activeOffer={activeOffer}
          onSelectOffer={setActiveOffer}
          filters={filters}
          selectedFilterSizes={selectedFilterSizes}
          minPriceInput={minPriceInput}
          maxPriceInput={maxPriceInput}
          productCount={filteredProducts.length}
          products={paginatedProducts}
          onOpenSizeFilter={openSizeFilterPage}
          onOpenPriceFilter={openPriceFilterPage}
          onChooseOption={openProduct}
          onOpenLoginModal={openLoginModal}
          onClearFilters={resetCollectionFilters}
          loginCtaLabel={isLoggedIn ? 'Open account' : 'Login'}
          emptyStateLabel={isCategoryScoped ? `${activeCategory.toLowerCase()} products` : 'products'}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <footer className="site-footer" id="footer">
        <div className="footer-brand">
          <a
            href="#top"
            className="footer-logo"
            aria-label="Aryass home"
            onClick={goHome}
          >
            <span className="brand-word">ARYASS</span>
            <span className="brand-tagline">FEEL BEFORE THE MOMENT</span>
          </a>
          <SocialLinks className="footer-socials" />
        </div>

        <div className="footer-column">
          <h3>Shop</h3>
          {shopLinks.map((link) => (
            <a key={link} href="#collection" onClick={goHome}>
              {link}
            </a>
          ))}
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          {quickLinks.map((link) => (
            <a key={link} href="#collection" onClick={goHome}>
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

      <div className={`cart-overlay ${isCartOpen ? 'show' : ''}`} onClick={() => setIsCartOpen(false)} />

      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-top">
          <h2>Your cart</h2>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '35px',
              cursor: 'pointer',
            }}
          >
            &times;
          </button>
        </div>

        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={`${item.id}-${item.size}-${item.color}`}>
              <img src={item.image} alt={item.name} />

              <div>
                <h4>{item.name}</h4>

                <p>{formatPrice(item.price.toLocaleString('en-IN'))}</p>

                <p>Color: {item.color}</p>

                <p>Size: {item.size}</p>

                <div className="qty-box">
                  <button onClick={() => updateCartQty(item.id, 'dec', item.size, item.color)}>
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button onClick={() => updateCartQty(item.id, 'inc', item.size, item.color)}>
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="option-button"
                  onClick={() => {
                    const product = products.find((currentProduct) => currentProduct.id === item.id)
                    if (!product) {
                      return
                    }

                    openProduct(product, { color: item.color, size: item.size })
                  }}
                >
                  Choose options
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-bottom">
          <div className="total-row">
            <h3>Total</h3>

            <h3>{formatPrice(totalPrice.toLocaleString('en-IN'))}</h3>
          </div>

          <button className="checkout-btn">CHECKOUT</button>
        </div>
      </div>

      {isReviewOpen ? (
        <div className="review-overlay" onClick={() => setIsReviewOpen(false)}>
          <div className="review-popup" onClick={(event) => event.stopPropagation()}>
            <button className="review-close" onClick={() => setIsReviewOpen(false)}>
              &times;
            </button>

            <h2>Write a review</h2>

            <div className="review-product">
              <img src={selectedProduct?.image} alt={selectedProduct?.name || 'Selected product'} />

              <div>
                <h4>{selectedProduct?.name}</h4>
                <p>{selectedProduct ? formatPrice(selectedProduct.price) : ''}</p>
              </div>
            </div>

            <label>Rating</label>

            <div className="star-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: '30px',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    setReviewData((current) => ({
                      ...current,
                      rating: star,
                    }))
                  }
                >
                  {star <= reviewData.rating ? '\u2605' : '\u2606'}
                </span>
              ))}
            </div>

            <label>Review</label>

            <textarea
              placeholder="Share feedback..."
              rows="5"
              value={reviewData.text}
              onChange={(event) =>
                setReviewData((current) => ({
                  ...current,
                  text: event.target.value,
                }))
              }
            />

            <label>Your name</label>

            <input
              placeholder="Enter name"
              value={reviewData.name}
              onChange={(event) =>
                setReviewData((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />

            <label>Your email</label>

            <input
              placeholder="Enter email"
              value={reviewData.email}
              onChange={(event) =>
                setReviewData((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />

            <input type="file" multiple accept="image/*" onChange={handlePhoto} />

            <div className="photo-preview">
              {reviewData.photos.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`Review upload ${index + 1}`}
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    margin: '5px',
                  }}
                />
              ))}
            </div>
            <button className="submit-review" onClick={submitReview}>
              Submit review
            </button>
          </div>
        </div>
      ) : null}

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
