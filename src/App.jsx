import { useEffect, useRef, useState } from 'react'
import './App.css'
import CollectionPage from './components/CollectionPage'
import CheckoutModal from './components/CheckoutModal'
import FooterPage from './components/FooterPage'
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
  sizeFilterLabels,
} from './data/catalog'
import {
  FOOTER_PAGE_IDS,
  footerLegalLinks,
  getFooterPageById,
  getFooterPageForLabel,
} from './data/footerPages'

const emptyReviewData = {
  rating: 0,
  text: '',
  name: '',
  email: '',
  photos: [],
}

const emptyAccountForm = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
}

const emptyDeliveryForm = {
  fullName: '',
  email: '',
  phone: '',
  addressLine: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
}

const PAGE_SIZE = 16

function normalizePhoneNumber(value = '') {
  return value.replace(/\D/g, '').slice(0, 10)
}

function getMembershipStamp() {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

function buildAccountProfileFromForm(form) {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim().toLowerCase(),
    phone: normalizePhoneNumber(form.phone),
    city: form.city.trim(),
    memberSince: getMembershipStamp(),
    tier: 'Private Client',
    isGuest: false,
  }
}

function buildGuestProfile(phone) {
  return {
    fullName: 'Aryass Member',
    email: 'Not added yet',
    phone: normalizePhoneNumber(phone),
    city: 'Not shared yet',
    memberSince: getMembershipStamp(),
    tier: 'Guest Access',
    isGuest: true,
  }
}

function formatAccountPhone(phone = '') {
  if (!phone) {
    return 'Not shared yet'
  }

  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
}

function hasCompleteDeliveryDetails(details) {
  return Boolean(
    details?.fullName &&
      details?.phone &&
      details?.addressLine &&
      details?.city &&
      details?.state &&
      details?.pincode,
  )
}

function getDeliveryFormPrefill(savedDetails, account) {
  return {
    fullName: savedDetails?.fullName || account?.fullName || '',
    email:
      savedDetails?.email ||
      (account?.email && account.email !== 'Not added yet' ? account.email : ''),
    phone: savedDetails?.phone || account?.phone || '',
    addressLine: savedDetails?.addressLine || '',
    landmark: savedDetails?.landmark || '',
    city:
      savedDetails?.city ||
      (account?.city && account.city !== 'Not shared yet' ? account.city : ''),
    state: savedDetails?.state || '',
    pincode: savedDetails?.pincode || '',
  }
}

function buildDeliveryDetails(form) {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim().toLowerCase(),
    phone: normalizePhoneNumber(form.phone),
    addressLine: form.addressLine.trim(),
    landmark: form.landmark.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    pincode: form.pincode.replace(/\D/g, '').slice(0, 6),
  }
}

function createOrderId() {
  return `ARY${Date.now().toString().slice(-6)}`
}

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
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [authView, setAuthView] = useState('login')
  const [loginStep, setLoginStep] = useState('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', ''])
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginMessage, setLoginMessage] = useState(
      'Enter your mobile number to continue with secure sign in.',
  )
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [accountProfile, setAccountProfile] = useState(null)
  const [accountForm, setAccountForm] = useState(emptyAccountForm)
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
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [wishlistItems, setWishlistItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState('delivery')
  const [checkoutSource, setCheckoutSource] = useState('buy-now')
  const [checkoutItems, setCheckoutItems] = useState([])
  const [deliveryForm, setDeliveryForm] = useState(emptyDeliveryForm)
  const [savedDeliveryDetails, setSavedDeliveryDetails] = useState(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi')
  const [checkoutOrderId, setCheckoutOrderId] = useState('')
  const [reviews, setReviews] = useState([])
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewData, setReviewData] = useState(emptyReviewData)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeInfoPage, setActiveInfoPage] = useState(null)

  const otpInputRefs = useRef([])
  const isWishlistItemSaved = (productId, size, color) =>
    wishlistItems.some(
      (item) => item.id === productId && item.size === size && item.color === color,
    )

  const selectedProduct = products.find((product) => product.id === selectedProductId) || null
  const isSelectedProductWishlisted = selectedProduct
    ? isWishlistItemSaved(selectedProduct.id, selectedSize, selectedColor)
    : false
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
  const wishlistCount = wishlistItems.length
  const cartItemCount = cartItems.reduce((total, item) => total + item.qty, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const checkoutTotal = checkoutItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const currentMessage = announcementMessages[activeMessage]
  const activeFooterPage = activeInfoPage ? getFooterPageById(activeInfoPage) : null
  const signedInLabel =
    accountProfile?.fullName || (accountProfile?.phone ? maskPhoneNumber(accountProfile.phone) : '')
  const hasSavedDelivery = hasCompleteDeliveryDetails(savedDeliveryDetails)

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
        setIsWishlistOpen(false)
        setIsCartOpen(false)
        setIsCheckoutOpen(false)
        setIsReviewOpen(false)
        setActiveInfoPage(null)
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
      isMenuOpen || isLoginOpen || isWishlistOpen || isCartOpen || isCheckoutOpen || isReviewOpen
        ? 'hidden'
        : ''

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isCartOpen, isCheckoutOpen, isLoginOpen, isMenuOpen, isReviewOpen, isWishlistOpen])

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

  const clearSizeFilters = () => {
    setSelectedFilterSizes([])
  }

  const clearPriceFilters = () => {
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
    setActiveCategory(category)
    setIsCategoryScoped(true)
    setSelectedImage('')
    setSelectedColor('')
    setSelectedSize('')
    setQuantity(1)
    setActiveInfoPage(null)
    setIsMenuOpen(false)
    setIsWishlistOpen(false)
    setIsCartOpen(false)
    setIsCheckoutOpen(false)
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
    setActiveCategory(defaultCategory)
    setIsCategoryScoped(false)
    setSelectedImage('')
    setSelectedColor('')
    setSelectedSize('')
    setQuantity(1)
    setActiveInfoPage(null)
    setIsMenuOpen(false)
    setIsWishlistOpen(false)
    setIsCartOpen(false)
    setIsCheckoutOpen(false)
    setIsReviewOpen(false)
    setActiveOffer(0)
    resetCollectionFilters()
    scrollToTop()
  }

  const resetLoginDraft = (nextPhone = '') => {
    setAuthView('login')
    setLoginStep('phone')
    setPhoneNumber(nextPhone)
    setOtpDigits(['', '', '', ''])
    setGeneratedOtp('')
  }

  const openLoginModal = () => {
    resetLoginDraft(accountProfile?.phone || '')
    setLoginError('')
    setLoginMessage(
      accountProfile?.phone
        ? `Use your registered number ${maskPhoneNumber(accountProfile.phone)} to continue.`
        : 'Enter your mobile number to continue with secure sign in.',
    )

    setIsMenuOpen(false)
    setIsWishlistOpen(false)
    setIsCartOpen(false)
    setIsCheckoutOpen(false)
    setIsReviewOpen(false)
    setIsLoginOpen(true)
  }

  const openSignupModal = () => {
    setAuthView('signup')
    setLoginStep('phone')
    setPhoneNumber('')
    setOtpDigits(['', '', '', ''])
    setGeneratedOtp('')
    setLoginError('')
    setLoginMessage('Fill your details below and create your Aryass account.')
    setAccountForm(
      accountProfile && !accountProfile.isGuest
        ? {
            fullName: accountProfile.fullName,
            email: accountProfile.email === 'Not added yet' ? '' : accountProfile.email,
            phone: accountProfile.phone,
            city: accountProfile.city === 'Not shared yet' ? '' : accountProfile.city,
          }
        : emptyAccountForm,
    )

    setIsMenuOpen(false)
    setIsWishlistOpen(false)
    setIsCartOpen(false)
    setIsCheckoutOpen(false)
    setIsReviewOpen(false)
    setIsLoginOpen(true)
  }

  const openProfileModal = () => {
    if (!isLoggedIn) {
      openLoginModal()
      return
    }

    setAuthView('profile')
    setLoginError('')
    setIsMenuOpen(false)
    setIsWishlistOpen(false)
    setIsCartOpen(false)
    setIsCheckoutOpen(false)
    setIsReviewOpen(false)
    setIsLoginOpen(true)
  }

  const closeLoginModal = () => {
    setIsLoginOpen(false)
    setLoginError('')
  }

  const handleAccountTrigger = () => {
    if (isLoggedIn) {
      openProfileModal()
      return
    }

    openLoginModal()
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsLoginOpen(false)
    setIsWishlistOpen(false)
    setIsCartOpen(false)
    setIsCheckoutOpen(false)
    setIsReviewOpen(false)
    setLoginError('')
    setLoginMessage('You have been signed out.')
    resetLoginDraft(accountProfile?.phone || '')
  }

  const handleHeaderAuthAction = () => {
    if (isLoggedIn) {
      handleLogout()
      return
    }

    openLoginModal()
  }

  const openProduct = (product, initialSelection = {}) => {
    setSelectedProductId(product.id)
    setSelectedImage(product.gallery[0])
    setSelectedColor(initialSelection.color || product.colors[0] || '')
    setSelectedSize(getDefaultSize(product, initialSelection.size))
    setQuantity(1)
    setIsMenuOpen(false)
    setIsWishlistOpen(false)
    setIsCartOpen(false)
    setIsCheckoutOpen(false)
    setIsReviewOpen(false)
    setActiveInfoPage(null)
    scrollToTop()
  }

  const closeProduct = () => {
    setSelectedProductId(null)
    setIsReviewOpen(false)
  }

  const openFooterPage = (pageId) => {
    setActiveInfoPage(pageId)
    setIsMenuOpen(false)
    setIsWishlistOpen(false)
    setIsCartOpen(false)
    setIsCheckoutOpen(false)
    setIsReviewOpen(false)
    setIsLoginOpen(false)
    scrollToTop()
  }

  const closePolicyPage = () => {
    setActiveInfoPage(null)
    scrollToTop()
  }

  const handleFooterLinkClick = (label) => {
    const targetPage = getFooterPageForLabel(label)

    if (targetPage) {
      openFooterPage(targetPage.id)
      return
    }

    goHome()
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

  const handleAccountFormChange = (field, value) => {
    setAccountForm((current) => ({
      ...current,
      [field]: field === 'phone' ? normalizePhoneNumber(value) : value,
    }))
    setLoginError('')
  }

  const handleCreateAccount = (event) => {
    event.preventDefault()

    const nextProfile = buildAccountProfileFromForm(accountForm)
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextProfile.email)

    if (!nextProfile.fullName || nextProfile.fullName.length < 3) {
      setLoginError('Please enter your full name.')
      return
    }

    if (!isEmailValid) {
      setLoginError('Please enter a valid email address.')
      return
    }

    if (nextProfile.phone.length !== 10) {
      setLoginError('Please enter a valid 10 digit mobile number.')
      return
    }

    if (!nextProfile.city || nextProfile.city.length < 2) {
      setLoginError('Please add your city so we can complete the profile.')
      return
    }

    setAccountProfile(nextProfile)
    setIsLoggedIn(true)
    setLoginError('')
    setLoginMessage(`Account created for ${nextProfile.fullName}.`)
    setAccountForm(emptyAccountForm)
    setIsLoginOpen(false)
    resetLoginDraft(nextProfile.phone)
  }

  const handlePhoneSubmit = (event) => {
    event.preventDefault()

    const cleanedNumber = normalizePhoneNumber(phoneNumber)

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

    const matchingAccount = accountProfile?.phone === phoneNumber ? accountProfile : null

    setIsLoggedIn(true)
    setAccountProfile(matchingAccount || buildGuestProfile(phoneNumber))
    setLoginError('')
    setLoginMessage(
      matchingAccount
        ? `Welcome back, ${matchingAccount.fullName}.`
        : `Signed in with ${maskPhoneNumber(phoneNumber)}.`,
    )
    setIsLoginOpen(false)
    resetLoginDraft(phoneNumber)
  }

  const createCheckoutItem = (product, itemQuantity, color, size) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price.replace(/,/g, '')),
    qty: itemQuantity,
    size,
    color,
    image: product.image,
  })

  const createWishlistItem = (product, color, size, image = product.image) => ({
    id: product.id,
    name: product.name,
    price: Number(product.price.replace(/,/g, '')),
    size,
    color,
    image,
    soldOut: product.soldOut,
  })

  const closeCheckout = () => {
    setIsCheckoutOpen(false)
    setCheckoutError('')
    setCheckoutStep('delivery')
    setCheckoutOrderId('')
  }

  const openCheckout = (items, source) => {
    if (!items.length) {
      return
    }

    setCheckoutItems(items)
    setCheckoutSource(source)
    setSelectedPaymentMethod('upi')
    setCheckoutOrderId('')
    setCheckoutError('')
    setDeliveryForm(getDeliveryFormPrefill(savedDeliveryDetails, accountProfile))
    setCheckoutStep(hasSavedDelivery ? 'payment' : 'delivery')
    setIsWishlistOpen(false)
    setIsCartOpen(false)
    setIsLoginOpen(false)
    setIsReviewOpen(false)
    setIsCheckoutOpen(true)
  }

  const openBuyNowCheckout = () => {
    if (!selectedProduct) {
      return
    }

    openCheckout(
      [createCheckoutItem(selectedProduct, quantity, selectedColor, selectedSize)],
      'buy-now',
    )
  }

  const openCartCheckout = () => {
    openCheckout(cartItems, 'cart')
  }

  const handleDeliveryFieldChange = (field, value) => {
    setDeliveryForm((current) => ({
      ...current,
      [field]:
        field === 'phone'
          ? normalizePhoneNumber(value)
          : field === 'pincode'
            ? value.replace(/\D/g, '').slice(0, 6)
            : value,
    }))
    setCheckoutError('')
  }

  const handleDeliverySubmit = (event) => {
    event.preventDefault()

    const nextDelivery = buildDeliveryDetails(deliveryForm)
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextDelivery.email)

    if (!nextDelivery.fullName || nextDelivery.fullName.length < 3) {
      setCheckoutError('Please enter the receiver full name.')
      return
    }

    if (!isEmailValid) {
      setCheckoutError('Please enter a valid delivery email address.')
      return
    }

    if (nextDelivery.phone.length !== 10) {
      setCheckoutError('Please enter a valid 10 digit mobile number.')
      return
    }

    if (!nextDelivery.addressLine || nextDelivery.addressLine.length < 8) {
      setCheckoutError('Please enter a complete street address.')
      return
    }

    if (!nextDelivery.city || !nextDelivery.state) {
      setCheckoutError('Please add your city and state.')
      return
    }

    if (nextDelivery.pincode.length !== 6) {
      setCheckoutError('Please enter a valid 6 digit pincode.')
      return
    }

    setSavedDeliveryDetails(nextDelivery)
    setDeliveryForm(getDeliveryFormPrefill(nextDelivery, accountProfile))
    setCheckoutError('')
    setCheckoutStep('payment')
  }

  const handleEditDelivery = () => {
    setDeliveryForm(getDeliveryFormPrefill(savedDeliveryDetails, accountProfile))
    setCheckoutError('')
    setCheckoutStep('delivery')
  }

  const handlePlaceOrder = () => {
    if (!hasCompleteDeliveryDetails(savedDeliveryDetails)) {
      setCheckoutStep('delivery')
      setCheckoutError('Please complete delivery details before payment.')
      return
    }

    if (checkoutSource === 'cart') {
      setCartItems([])
    }

    setCheckoutError('')
    setCheckoutOrderId(createOrderId())
    setCheckoutStep('success')
  }

  const handleQuantityChange = (change) => {
    setQuantity((current) => Math.max(1, current + change))
  }

  const openWishlist = () => {
    setIsMenuOpen(false)
    setIsLoginOpen(false)
    setIsCartOpen(false)
    setIsCheckoutOpen(false)
    setIsReviewOpen(false)
    setIsWishlistOpen(true)
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

  const addSelectionToCart = (product, itemQuantity, color, size) => {
    setCartItems((current) => {
      const existingItem = current.find(
        (item) => item.id === product.id && item.size === size && item.color === color,
      )

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, qty: item.qty + itemQuantity }
            : item,
        )
      }

      return [...current, createCheckoutItem(product, itemQuantity, color, size)]
    })
  }

  const toggleWishlist = (product, selection = {}) => {
    if (!product) {
      return
    }

    const color = selection.color || product.colors[0] || ''
    const size = getDefaultSize(product, selection.size)
    const image = selection.image || product.image

    setWishlistItems((current) => {
      const exists = current.some(
        (item) => item.id === product.id && item.size === size && item.color === color,
      )

      if (exists) {
        return current.filter(
          (item) => item.id !== product.id || item.size !== size || item.color !== color,
        )
      }

      return [...current, createWishlistItem(product, color, size, image)]
    })
  }

  const removeFromWishlist = (id, size, color) => {
    setWishlistItems((current) =>
      current.filter((item) => item.id !== id || item.size !== size || item.color !== color),
    )
  }

  const toggleSelectedProductWishlist = () => {
    if (!selectedProduct) {
      return
    }

    toggleWishlist(selectedProduct, {
      color: selectedColor,
      size: selectedSize,
      image: selectedImage,
    })
  }

  const addWishlistItemToCart = (item) => {
    const product = products.find((currentProduct) => currentProduct.id === item.id)

    if (!product || item.soldOut) {
      return
    }

    addSelectionToCart(product, 1, item.color, item.size)
    setIsWishlistOpen(false)
    setIsCartOpen(true)
  }

  const addToCart = () => {
    if (!selectedProduct) {
      return
    }

    addSelectionToCart(selectedProduct, quantity, selectedColor, selectedSize)
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
          <button
            type="button"
            className={`header-login ${isLoggedIn ? 'header-login--logout' : ''}`}
            onClick={handleHeaderAuthAction}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
          <button
            type="button"
            className={`header-icon ${isLoggedIn ? 'header-icon--account-live' : ''}`}
            aria-label={isLoggedIn ? 'Open profile' : 'Account'}
            onClick={handleAccountTrigger}
          >
            <Icon name="account" />
          </button>
          <button
            type="button"
            className={`header-icon header-icon--wishlist ${
              isWishlistOpen || wishlistCount ? 'is-active' : ''
            }`}
            aria-label="Open wishlist"
            onClick={openWishlist}
          >
            <Icon name="heart" />
            {wishlistCount ? <span className="header-count-badge">{wishlistCount}</span> : null}
          </button>
          <button
            type="button"
            className="header-icon header-icon--cart"
            aria-label="Open cart"
            onClick={() => {
              setIsWishlistOpen(false)
              setIsCartOpen(true)
            }}
          >
            <Icon name="bag" />
            <span className="header-count-badge">{cartItemCount}</span>
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

      {activeFooterPage ? (
        <FooterPage
          page={activeFooterPage}
          onBack={closePolicyPage}
          onContinueShopping={goHome}
        />
      ) : selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          onAddToCart={addToCart}
          onBuyNow={openBuyNowCheckout}
          onToggleWishlist={toggleSelectedProductWishlist}
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
          onOpenShippingPolicy={() => openFooterPage(FOOTER_PAGE_IDS.shippingPolicy)}
          onOpenReturnPolicy={() => openFooterPage(FOOTER_PAGE_IDS.returnsExchanges)}
          reviewCount={reviews.length}
          isWishlisted={isSelectedProductWishlisted}
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
          sizeOptions={sizeFilterOptions}
          highestPrice={highestVisiblePrice}
          productCount={filteredProducts.length}
          products={paginatedProducts}
          onToggleSize={toggleFilterSize}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onClearSizeFilters={clearSizeFilters}
          onClearPriceFilters={clearPriceFilters}
          onChooseOption={openProduct}
          onOpenLoginModal={handleAccountTrigger}
          onClearFilters={resetCollectionFilters}
          loginCtaLabel={isLoggedIn ? 'View profile' : 'Login'}
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
          {mobileMenuItems.map((link) => (
            <button
              key={link}
              type="button"
              className="footer-link-button"
              onClick={() => handleMenuCategorySelect(link)}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          {quickLinks.map((link) => (
            <button
              key={link}
              type="button"
              className="footer-link-button"
              onClick={() => handleFooterLinkClick(link)}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="footer-column">
          <h3>Our Achievements</h3>
          <p>Forbes Recognized</p>
          <p>Luxury edits made lighter for mobile browsing.</p>
          {isLoggedIn ? <p>Signed in as {signedInLabel}</p> : null}
        </div>
      </footer>

      <div className="footer-legal">
        <p>
          (c) 2026, Aryass.
          {' '}
          {footerLegalLinks.map((link, index) => (
            <span key={link}>
              {index ? ' | ' : ''}
              <button
                type="button"
                className="footer-legal-button"
                onClick={() => handleFooterLinkClick(link)}
              >
                {link}
              </button>
            </span>
          ))}
        </p>
      </div>

      <div
        className={`cart-overlay ${isCartOpen || isWishlistOpen ? 'show' : ''}`}
        onClick={() => {
          setIsCartOpen(false)
          setIsWishlistOpen(false)
        }}
      />

      <div className={`wishlist-drawer ${isWishlistOpen ? 'open' : ''}`}>
        <div className="cart-top">
          <h2>Your wishlist</h2>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
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
          {wishlistItems.length ? (
            wishlistItems.map((item) => (
              <div className="cart-item" key={`${item.id}-${item.size}-${item.color}`}>
                <img src={item.image} alt={item.name} />

                <div className="wishlist-item-copy">
                  <h4>{item.name}</h4>
                  <p>{formatPrice(item.price.toLocaleString('en-IN'))}</p>
                  <p>Color: {item.color}</p>
                  <p>Size: {item.size}</p>

                  <div className="wishlist-item-actions">
                    <button
                      type="button"
                      className="option-button"
                      onClick={() => addWishlistItemToCart(item)}
                      disabled={item.soldOut}
                    >
                      {item.soldOut ? 'Sold out' : 'Add to cart'}
                    </button>

                    <button
                      type="button"
                      className="wishlist-remove-button"
                      onClick={() => removeFromWishlist(item.id, item.size, item.color)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="wishlist-empty-state">
              <h3>No saved styles yet</h3>
              <p>Jo product pasand aaye usse heart icon se wishlist me save kar lo.</p>
              <button
                type="button"
                className="secondary-action-button"
                onClick={() => setIsWishlistOpen(false)}
              >
                Continue shopping
              </button>
            </div>
          )}
        </div>
      </div>

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

          <button
            type="button"
            className="checkout-btn"
            onClick={openCartCheckout}
            disabled={!cartItems.length}
          >
            CHECKOUT
          </button>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        step={checkoutStep}
        items={checkoutItems}
        total={checkoutTotal}
        deliveryForm={deliveryForm}
        deliveryDetails={savedDeliveryDetails}
        selectedPaymentMethod={selectedPaymentMethod}
        orderId={checkoutOrderId}
        checkoutError={checkoutError}
        hasSavedDeliveryDetails={hasSavedDelivery}
        onClose={closeCheckout}
        onDeliveryFieldChange={handleDeliveryFieldChange}
        onSubmitDelivery={handleDeliverySubmit}
        onEditDelivery={handleEditDelivery}
        onSelectPaymentMethod={setSelectedPaymentMethod}
        onPlaceOrder={handlePlaceOrder}
        onContinueShopping={closeCheckout}
      />

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
        authView={authView}
        loginStep={loginStep}
        phoneNumber={phoneNumber}
        otpDigits={otpDigits}
        loginError={loginError}
        loginMessage={loginMessage}
        accountForm={accountForm}
        accountProfile={accountProfile}
        onPhoneChange={(value) => {
          setPhoneNumber(normalizePhoneNumber(value))
          setLoginError('')
        }}
        onPhoneSubmit={handlePhoneSubmit}
        onVerifyOtp={handleVerifyOtp}
        onOtpChange={handleOtpChange}
        onOtpKeyDown={handleOtpKeyDown}
        onResendOtp={handleResendOtp}
        onSwitchToLogin={openLoginModal}
        onSwitchToSignup={openSignupModal}
        onAccountFormChange={handleAccountFormChange}
        onCreateAccount={handleCreateAccount}
        onLogout={handleLogout}
        formatAccountPhone={formatAccountPhone}
        otpInputRefs={otpInputRefs}
      />
    </div>
  )
}

export default App
