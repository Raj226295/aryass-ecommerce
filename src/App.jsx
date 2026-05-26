import { useEffect, useRef, useState } from 'react'
import './App.css'
import AdminPage from './components/AdminPage'
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
  products as initialProducts,
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
const paymentMethodLabels = {
  upi: 'UPI Payment',
  card: 'Card Payment',
  cod: 'Cash on Delivery',
}
const drawerCoupons = [
  { code: 'WELCOME10', note: 'First order par 10% off' },
  { code: 'ARYASS15', note: 'Selected styles par extra savings' },
  { code: 'FREESHIP', note: 'Eligible orders par shipping benefit' },
]
const ADMIN_PHONE_NUMBER = '9934622433'
const AUTH_STORAGE_KEY = 'aryass-auth-state'
const PRODUCTS_STORAGE_KEY = 'aryass-products-state'

function getStoredAuthState() {
  if (typeof window === 'undefined') {
    return {
      isLoggedIn: false,
      accountProfile: null,
      isAdminPageOpen: false,
    }
  }

  try {
    const rawAuthState = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (!rawAuthState) {
      return {
        isLoggedIn: false,
        accountProfile: null,
        isAdminPageOpen: false,
      }
    }

    const parsedAuthState = JSON.parse(rawAuthState)
    const isLoggedIn = parsedAuthState?.isLoggedIn === true
    const accountProfile =
      parsedAuthState?.accountProfile && typeof parsedAuthState.accountProfile === 'object'
        ? parsedAuthState.accountProfile
        : null
    const isAdminPageOpen = Boolean(
      isLoggedIn && accountProfile?.isAdmin && parsedAuthState?.isAdminPageOpen,
    )

    return {
      isLoggedIn: isLoggedIn && Boolean(accountProfile),
      accountProfile: isLoggedIn ? accountProfile : null,
      isAdminPageOpen,
    }
  } catch {
    return {
      isLoggedIn: false,
      accountProfile: null,
      isAdminPageOpen: false,
    }
  }
}

function persistAuthState({ isLoggedIn, accountProfile, isAdminPageOpen }) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (!isLoggedIn || !accountProfile) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isLoggedIn: true,
        accountProfile,
        isAdminPageOpen: Boolean(accountProfile.isAdmin && isAdminPageOpen),
      }),
    )
  } catch {
    // Ignore storage write errors and continue with in-memory auth state.
  }
}

function getDefaultManagedDeliveryMeta() {
  return [
    { icon: 'shipping', title: 'Estimated delivery', text: '2-6 business days' },
    { icon: 'return', title: 'Easy returns', text: 'Within 7 days of delivery' },
    { icon: 'lock', title: 'Secure payment', text: '100% safe checkout flow' },
  ]
}

function normalizeStoredManagedProduct(storedProduct, fallbackProduct = null) {
  const baseProduct = fallbackProduct || {}
  const resolvedCategory = mobileMenuItems.includes(storedProduct?.category)
    ? storedProduct.category
    : baseProduct.category || defaultCategory
  const resolvedName =
    String(storedProduct?.name || baseProduct.name || `Untitled ${resolvedCategory}`).trim() ||
    `Untitled ${resolvedCategory}`
  const resolvedPrice =
    normalizeManagedPriceInput(storedProduct?.price, baseProduct.price || '1,999.00') ||
    baseProduct.price ||
    '1,999.00'
  const resolvedOldPrice = Object.hasOwn(storedProduct || {}, 'oldPrice')
    ? normalizeManagedPriceInput(storedProduct?.oldPrice, '')
    : baseProduct.oldPrice
  const resolvedStockCount = Math.max(
    0,
    Number(storedProduct?.stockCount ?? baseProduct.stockCount ?? 0) || 0,
  )
  const resolvedSoldOut = resolvedStockCount === 0
  const resolvedImage = String(storedProduct?.image || baseProduct.image || '').trim()
  const resolvedGallery = normalizeManagedGalleryImages(
    storedProduct?.gallery ?? baseProduct.gallery ?? [resolvedImage],
    resolvedImage,
  )
  const resolvedColors = normalizeManagedList(
    storedProduct?.colors ?? baseProduct.colors ?? ['Ivory', 'Black'],
  )
  const resolvedSizes = normalizeManagedSizes(
    storedProduct?.sizes ?? baseProduct.sizes,
    baseProduct.sizes,
    resolvedSoldOut,
  )
  const resolvedDescription = normalizeManagedParagraphs(
    storedProduct?.description ??
      baseProduct.description ?? [
        `${resolvedName} ko premium storefront listing ke liye detailed description chahiye.`,
      ],
  )
  const resolvedStyleNotes = normalizeManagedLineList(
    storedProduct?.styleNotes ??
      baseProduct.styleNotes ?? [
        `Perfect for ${resolvedCategory.toLowerCase()} lovers jo statement look ke saath comfort bhi chahte hain.`,
      ],
  )
  const resolvedDeliveryMeta =
    Array.isArray(storedProduct?.deliveryMeta) && storedProduct.deliveryMeta.length
      ? storedProduct.deliveryMeta
      : Array.isArray(baseProduct.deliveryMeta) && baseProduct.deliveryMeta.length
        ? baseProduct.deliveryMeta
        : getDefaultManagedDeliveryMeta()
  const normalizedProduct = {
    ...baseProduct,
    ...storedProduct,
    id: storedProduct?.id || baseProduct.id,
    name: resolvedName,
    price: resolvedPrice,
    oldPrice: resolvedOldPrice || undefined,
    priceValue: Number(String(resolvedPrice || 0).replace(/,/g, '')),
    category: resolvedCategory,
    image: resolvedImage || resolvedGallery[0] || baseProduct.image || '',
    gallery:
      resolvedGallery.length
        ? resolvedGallery
        : [resolvedImage || baseProduct.image].filter(Boolean),
    colors: resolvedColors.length ? resolvedColors : baseProduct.colors || ['Ivory', 'Black'],
    sizes: resolvedSizes,
    stockCount: resolvedStockCount,
    soldOut: resolvedSoldOut,
    shippingNote:
      String(storedProduct?.shippingNote || baseProduct.shippingNote || '').trim() ||
      'Free shipping above Rs. 1,999',
    sku:
      String(storedProduct?.sku || baseProduct.sku || '').trim().toUpperCase() ||
      `ARY-CUSTOM-${resolvedCategory.slice(0, 2).toUpperCase()}`,
    label: String(storedProduct?.label || baseProduct.label || '').trim() || 'Aryass Edit',
    description:
      resolvedDescription.length
        ? resolvedDescription
        : baseProduct.description || [`${resolvedName} is ready for a better storefront story.`],
    styleNotes:
      resolvedStyleNotes.length
        ? resolvedStyleNotes
        : baseProduct.styleNotes || [
            `Perfect for ${resolvedCategory.toLowerCase()} lovers jo statement look ke saath comfort bhi chahte hain.`,
          ],
    deliveryMeta: resolvedDeliveryMeta,
    storyTitle:
      String(storedProduct?.storyTitle || baseProduct.storyTitle || '').trim() ||
      `${resolvedName} for polished moments`,
    storyText:
      String(storedProduct?.storyText || baseProduct.storyText || '').trim() ||
      'Aryass pieces are designed to move from intimate celebrations to elevated city looks without losing their soft, graceful appeal.',
    saleBadgeText: String(storedProduct?.saleBadgeText || baseProduct.saleBadgeText || '').trim(),
    rating: Number(storedProduct?.rating ?? baseProduct.rating ?? 0) || 0,
    reviews: Number(storedProduct?.reviews ?? baseProduct.reviews ?? 0) || 0,
    asSeenOn: Boolean(storedProduct?.asSeenOn ?? baseProduct.asSeenOn),
  }

  return {
    ...normalizedProduct,
    badges: buildManagedProductBadges(
      normalizedProduct,
      normalizedProduct.soldOut,
      normalizedProduct.price,
      normalizedProduct.oldPrice,
      normalizedProduct.saleBadgeText,
    ),
  }
}

function mergeStoredProducts(storedProducts) {
  if (!Array.isArray(storedProducts) || !storedProducts.length) {
    return initialProducts
  }

  const storedProductsById = new Map(
    storedProducts
      .filter((product) => product && typeof product === 'object' && typeof product.id === 'string')
      .map((product) => [product.id, product]),
  )

  const mergedBaseProducts = initialProducts.map((product) => {
    const storedProduct = storedProductsById.get(product.id)

    if (!storedProduct) {
      return product
    }

    return normalizeStoredManagedProduct(storedProduct, product)
  })

  const customProducts = storedProducts
    .filter(
      (product) =>
        product &&
        typeof product === 'object' &&
        typeof product.id === 'string' &&
        !initialProducts.some((initialProduct) => initialProduct.id === product.id),
    )
    .map((product) => normalizeStoredManagedProduct(product))

  return [...customProducts, ...mergedBaseProducts]
}

function getStoredProducts() {
  if (typeof window === 'undefined') {
    return initialProducts
  }

  try {
    const rawProductsState = window.localStorage.getItem(PRODUCTS_STORAGE_KEY)

    if (!rawProductsState) {
      return initialProducts
    }

    return mergeStoredProducts(JSON.parse(rawProductsState))
  } catch {
    return initialProducts
  }
}

function persistProductsState(products) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
  } catch {
    // Ignore storage write errors and continue with in-memory catalog state.
  }
}

function normalizePhoneNumber(value = '') {
  return value.replace(/\D/g, '').slice(0, 10)
}

function isAdminPhoneNumber(phone = '') {
  return normalizePhoneNumber(phone) === ADMIN_PHONE_NUMBER
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

function buildAdminProfile(phone, account = null) {
  const normalizedPhone = normalizePhoneNumber(phone)

  return {
    fullName: account?.fullName || 'Aryass Admin',
    email:
      account?.email && account.email !== 'Not added yet' ? account.email : 'admin@aryass.com',
    phone: normalizedPhone,
    city: account?.city && account.city !== 'Not shared yet' ? account.city : 'Admin Access',
    memberSince: account?.memberSince || getMembershipStamp(),
    tier: 'Admin Access',
    isGuest: false,
    isAdmin: true,
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

function formatOrderDateStamp(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getTrackingStatusNote(status) {
  if (status === 'Cancelled') {
    return 'Tracking stopped because this order was cancelled.'
  }

  return 'Order confirmed. Dispatch and delivery updates will appear here.'
}

function getDefaultSize(product, preferredSize = '') {
  if (preferredSize && product.sizes.some((size) => size.label === preferredSize)) {
    return preferredSize
  }

  return product.sizes.find((size) => size.available)?.label || product.sizes[0]?.label || ''
}

function buildManagedProductBadges(
  product,
  soldOut,
  nextPrice = product.price,
  nextOldPrice = product.oldPrice,
  nextSaleBadgeText = product.saleBadgeText,
) {
  const badges = Array.isArray(product.badges) ? product.badges : []
  const nextBadges = badges
    .map((badge) =>
      typeof badge === 'string'
        ? { text: badge, tone: 'neutral' }
        : {
            text: String(badge?.text || '').trim(),
            tone: badge?.tone || 'neutral',
          },
    )
    .filter((badge) => badge.text && badge.text !== 'Sold Out' && badge.tone !== 'sale')

  const saleBadgeText = String(nextSaleBadgeText || '').trim()
  const oldPriceValue = Number(String(nextOldPrice || 0).replace(/,/g, ''))
  const priceValue = Number(String(nextPrice || 0).replace(/,/g, ''))

  if (saleBadgeText) {
    nextBadges.unshift({ text: saleBadgeText, tone: 'sale' })
  } else if (oldPriceValue > priceValue && priceValue > 0) {
    const discountPercent = Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100)

    if (discountPercent >= 5) {
      nextBadges.unshift({ text: `${discountPercent}% Off`, tone: 'sale' })
    }
  }

  if (soldOut) {
    nextBadges.push({ text: 'Sold Out', tone: 'neutral' })
  }

  return nextBadges
}

function buildProductSku(product, nextCategory) {
  const skuParts = String(product.sku || '').split('-')
  const skuBase =
    skuParts.length >= 2 ? `${skuParts[0]}-${skuParts[1]}` : product.id.toUpperCase()

  return `${skuBase}-${nextCategory.slice(0, 2).toUpperCase()}`
}

function normalizeManagedPriceInput(value, fallback = '') {
  const normalizedValue = String(value ?? '').replace(/[^0-9.]/g, '')
  const numericValue = Number(normalizedValue)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return fallback
  }

  return numericValue.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function normalizeManagedList(value) {
  const sourceValues = Array.isArray(value) ? value : String(value ?? '').split(/[\n,]+/)
  const seenValues = new Set()

  return sourceValues.reduce((items, item) => {
    const normalizedItem = String(item || '').trim()
    const normalizedKey = normalizedItem.toLowerCase()

    if (normalizedItem && !seenValues.has(normalizedKey)) {
      seenValues.add(normalizedKey)
      items.push(normalizedItem)
    }

    return items
  }, [])
}

function normalizeManagedParagraphs(value) {
  const sourceValues = Array.isArray(value)
    ? value
    : String(value ?? '')
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' '))

  return sourceValues
    .map((item) => String(item || '').trim())
    .filter(Boolean)
}

function normalizeManagedLineList(value) {
  const sourceValues = Array.isArray(value) ? value : String(value ?? '').split(/\n+/)

  return sourceValues
    .map((item) => String(item || '').trim())
    .filter(Boolean)
}

function normalizeManagedGalleryImages(value, coverImage = '') {
  const sourceValues = Array.isArray(value) ? value : String(value ?? '').split(/\n+/)
  const normalizedCoverImage = String(coverImage || '').trim()
  const nextGallery = [...(normalizedCoverImage ? [normalizedCoverImage] : []), ...sourceValues]
  const seenImages = new Set()

  return nextGallery.reduce((images, image) => {
    const normalizedImage = String(image || '').trim()

    if (normalizedImage && !seenImages.has(normalizedImage)) {
      seenImages.add(normalizedImage)
      images.push(normalizedImage)
    }

    return images
  }, [])
}

function normalizeManagedSizes(sizeInput, currentSizes = [], soldOut = false) {
  const fallbackSizes =
    Array.isArray(currentSizes) && currentSizes.length
      ? currentSizes
      : [
          { label: 'S', available: true },
          { label: 'M', available: true },
          { label: 'L', available: true },
        ]
  const currentSizeAvailability = new Map(
    fallbackSizes
      .map((size) => [String(size?.label || '').trim().toUpperCase(), Boolean(size?.available)])
      .filter(([label]) => label),
  )
  const sourceSizes =
    Array.isArray(sizeInput) && sizeInput.length ? sizeInput : fallbackSizes
  const nextSizes = sourceSizes
    .map((size) => {
      if (typeof size === 'string') {
        const label = size.trim().toUpperCase()

        return label
          ? { label, available: currentSizeAvailability.get(label) ?? true }
          : null
      }

      const label = String(size?.label || '').trim().toUpperCase()

      if (!label) {
        return null
      }

      return {
        label,
        available:
          typeof size?.available === 'boolean'
            ? size.available
            : currentSizeAvailability.get(label) ?? true,
      }
    })
    .filter(Boolean)
    .filter((size, index, sizes) => sizes.findIndex((item) => item.label === size.label) === index)
  const resolvedSizes = nextSizes.length
    ? nextSizes
    : fallbackSizes
        .map((size) => ({
          label: String(size?.label || '').trim().toUpperCase(),
          available: Boolean(size?.available),
        }))
        .filter((size) => size.label)
  const sizesWithStockState = resolvedSizes.map((size) => ({
    ...size,
    available: soldOut ? false : Boolean(size.available),
  }))

  if (!soldOut && sizesWithStockState.length && !sizesWithStockState.some((size) => size.available)) {
    sizesWithStockState[0] = {
      ...sizesWithStockState[0],
      available: true,
    }
  }

  return sizesWithStockState
}

function syncManagedProductDetails(product, nextDetails = {}) {
  const nextCategory =
    typeof nextDetails.category === 'string' && mobileMenuItems.includes(nextDetails.category)
      ? nextDetails.category
      : product.category
  const nextSaleBadgeText = Object.hasOwn(nextDetails, 'saleBadgeText')
    ? String(nextDetails.saleBadgeText || '').trim()
    : String(product.saleBadgeText || '').trim()
  const nextPrice =
    Object.hasOwn(nextDetails, 'price')
      ? normalizeManagedPriceInput(nextDetails.price, product.price)
      : product.price
  const nextOldPrice =
    Object.hasOwn(nextDetails, 'oldPrice')
      ? normalizeManagedPriceInput(nextDetails.oldPrice, '')
      : product.oldPrice
  const nextStockCount = Object.hasOwn(nextDetails, 'stockCount')
    ? Math.max(0, Number(nextDetails.stockCount) || 0)
    : product.stockCount
  const soldOut = nextStockCount === 0
  const nextColors = Object.hasOwn(nextDetails, 'colors')
    ? normalizeManagedList(nextDetails.colors)
    : product.colors
  const nextDescription = Object.hasOwn(nextDetails, 'description')
    ? normalizeManagedParagraphs(nextDetails.description)
    : product.description
  const nextStyleNotesBase = Object.hasOwn(nextDetails, 'styleNotes')
    ? normalizeManagedLineList(nextDetails.styleNotes)
    : product.styleNotes
  const nextStyleNotes =
    nextCategory !== product.category && !Object.hasOwn(nextDetails, 'styleNotes') && nextStyleNotesBase.length
      ? [
          `Perfect for ${nextCategory.toLowerCase()} lovers jo statement look ke saath comfort bhi chahte hain.`,
          ...nextStyleNotesBase.slice(1),
        ]
      : nextStyleNotesBase
  const requestedCoverImage = Object.hasOwn(nextDetails, 'coverImage')
    ? String(nextDetails.coverImage || '').trim()
    : product.image
  const nextGallery =
    Object.hasOwn(nextDetails, 'gallery') || Object.hasOwn(nextDetails, 'coverImage')
      ? normalizeManagedGalleryImages(
          Object.hasOwn(nextDetails, 'gallery') ? nextDetails.gallery : product.gallery,
          requestedCoverImage,
        )
      : Array.isArray(product.gallery) && product.gallery.length
        ? product.gallery
        : [product.image].filter(Boolean)
  const nextImage = requestedCoverImage || nextGallery[0] || product.image
  const nextSizes = normalizeManagedSizes(
    Object.hasOwn(nextDetails, 'sizes') ? nextDetails.sizes : product.sizes,
    product.sizes,
    soldOut,
  )
  const nextSku = Object.hasOwn(nextDetails, 'sku')
    ? String(nextDetails.sku || '').trim().toUpperCase()
    : nextCategory !== product.category
      ? buildProductSku(product, nextCategory)
      : product.sku
  const nextProduct = {
    ...product,
    name: Object.hasOwn(nextDetails, 'name')
      ? String(nextDetails.name || '').trim() || product.name
      : product.name,
    label: Object.hasOwn(nextDetails, 'label')
      ? String(nextDetails.label || '').trim() || product.label
      : product.label,
    category: nextCategory,
    price: nextPrice,
    oldPrice: nextOldPrice || undefined,
    priceValue: Number(String(nextPrice || 0).replace(/,/g, '')),
    shippingNote: Object.hasOwn(nextDetails, 'shippingNote')
      ? String(nextDetails.shippingNote || '').trim() || product.shippingNote
      : product.shippingNote,
    saleBadgeText: nextSaleBadgeText,
    sku: nextSku || buildProductSku(product, nextCategory),
    stockCount: nextStockCount,
    soldOut,
    image: nextImage,
    gallery: nextGallery.length ? nextGallery : [nextImage],
    colors: nextColors.length ? nextColors : product.colors,
    sizes: nextSizes,
    description: nextDescription.length ? nextDescription : product.description,
    styleNotes: nextStyleNotes.length ? nextStyleNotes : product.styleNotes,
    storyTitle: Object.hasOwn(nextDetails, 'storyTitle')
      ? String(nextDetails.storyTitle || '').trim() || product.storyTitle
      : product.storyTitle,
    storyText: Object.hasOwn(nextDetails, 'storyText')
      ? String(nextDetails.storyText || '').trim() || product.storyText
      : product.storyText,
  }

  return {
    ...nextProduct,
    badges: buildManagedProductBadges(
      nextProduct,
      soldOut,
      nextProduct.price,
      nextProduct.oldPrice,
      nextProduct.saleBadgeText,
    ),
  }
}

function isCustomManagedProductId(productId = '') {
  return String(productId).startsWith('aryass-custom-')
}

function buildNewManagedProduct(products, preferredCategory = defaultCategory) {
  const nextCategory = mobileMenuItems.includes(preferredCategory) ? preferredCategory : defaultCategory
  const categoryTemplate =
    products.find((product) => product.category === nextCategory) ||
    products.find((product) => product.category === defaultCategory) ||
    products[0] ||
    null
  const nextId = `aryass-custom-${Date.now()}`
  const nextSku = `ARY-CUSTOM-${String(products.filter((product) => isCustomManagedProductId(product.id)).length + 1).padStart(3, '0')}`
  const nextName = `New ${nextCategory}`
  const templateImage =
    categoryTemplate?.image ||
    categoryTemplate?.gallery?.[0] ||
    '/catalog/pexels-photo-34959983.jpeg'
  const baseProduct = {
    ...(categoryTemplate || {}),
    id: nextId,
    name: nextName,
    category: nextCategory,
    price: '1,999.00',
    oldPrice: '',
    rating: 0,
    reviews: 0,
    soldOut: false,
    asSeenOn: false,
    stockCount: 8,
    image: templateImage,
    gallery: [templateImage].filter(Boolean),
    colors: ['Ivory', 'Champagne', 'Black'],
    sizes: [
      { label: 'XS', available: true },
      { label: 'S', available: true },
      { label: 'M', available: true },
      { label: 'L', available: true },
    ],
    sku: nextSku,
    shippingNote: 'Free shipping above Rs. 1,999',
    label: 'New Launch',
    description: [
      `${nextName} ko admin se complete detail ke saath customise karke live storefront par publish kiya ja sakta hai.`,
      'Fabric story, fit notes, aur occasion styling yahan add karke customer-facing product page ko complete banaya ja sakta hai.',
    ],
    styleNotes: [
      `Perfect for ${nextCategory.toLowerCase()} lovers jo statement look ke saath comfort bhi chahte hain.`,
      'Best styled with refined accessories, sleek footwear, and a confident evening mood.',
    ],
    deliveryMeta: getDefaultManagedDeliveryMeta(),
    storyTitle: `${nextName} for polished moments`,
    storyText:
      'Aryass pieces are designed to move from intimate celebrations to elevated city looks without losing their soft, graceful appeal.',
    saleBadgeText: '',
  }

  return normalizeStoredManagedProduct(baseProduct)
}

function App() {
  const initialAuthStateRef = useRef(getStoredAuthState())
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
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuthStateRef.current.isLoggedIn)
  const [accountProfile, setAccountProfile] = useState(initialAuthStateRef.current.accountProfile)
  const [accountForm, setAccountForm] = useState(emptyAccountForm)
  const [products, setProducts] = useState(() => getStoredProducts())
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
  const [orderHistory, setOrderHistory] = useState([])
  const [reviews, setReviews] = useState([])
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewData, setReviewData] = useState(emptyReviewData)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeInfoPage, setActiveInfoPage] = useState(null)
  const [isAdminPageOpen, setIsAdminPageOpen] = useState(
    initialAuthStateRef.current.isAdminPageOpen,
  )
  const [isDrawerAccountOpen, setIsDrawerAccountOpen] = useState(false)
  const [activeDrawerAccountPanel, setActiveDrawerAccountPanel] = useState('')

  const otpInputRefs = useRef([])
  const isWishlistItemSaved = (productId, size, color) =>
    wishlistItems.some(
      (item) => item.id === productId && item.size === size && item.color === color,
    )

  const selectedProduct = products.find((product) => product.id === selectedProductId) || null
  const selectedProductReviews = selectedProduct
    ? reviews.filter((review) => review.productId === selectedProduct.id)
    : []
  const selectedProductReviewCount = (selectedProduct?.reviews || 0) + selectedProductReviews.length
  const selectedProductReviewRating = selectedProductReviews.length
    ? selectedProductReviews.reduce((sum, review) => sum + review.rating, 0) / selectedProductReviews.length
    : selectedProduct?.rating || 0
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
  const savedAddressSummary = savedDeliveryDetails
    ? [
        savedDeliveryDetails.fullName,
        savedDeliveryDetails.addressLine,
        savedDeliveryDetails.landmark,
        `${savedDeliveryDetails.city}, ${savedDeliveryDetails.state} ${savedDeliveryDetails.pincode}`,
        formatAccountPhone(savedDeliveryDetails.phone),
      ].filter(Boolean)
    : []
  const recentOrders = orderHistory.slice(0, 3)
  const latestOrder = recentOrders[0] || null
  const drawerPaymentMethods = [
    {
      key: 'upi',
      label: paymentMethodLabels.upi,
      detail: 'Fast checkout with any UPI app.',
    },
    {
      key: 'card',
      label: paymentMethodLabels.card,
      detail: 'Visa, Mastercard, and RuPay cards are supported.',
    },
    {
      key: 'cod',
      label: paymentMethodLabels.cod,
      detail: 'Available on eligible deliveries.',
    },
  ].map((method) => ({
    ...method,
    isPreferred: method.key === selectedPaymentMethod,
  }))
  const drawerNotifications = [
    latestOrder
      ? {
          id: `order-${latestOrder.id}`,
          title: `${latestOrder.id} is ${latestOrder.status === 'Cancelled' ? 'cancelled' : 'active'}`,
          body:
            latestOrder.status === 'Cancelled'
              ? 'Tracking has been paused for this order.'
              : 'We will show dispatch and delivery updates here.',
        }
      : {
          id: 'orders-ready',
          title: 'Order alerts ready',
          body: 'Your future order updates will land here as soon as you place an order.',
        },
    wishlistCount
      ? {
          id: 'wishlist',
          title: `${wishlistCount} wishlist item${wishlistCount > 1 ? 's' : ''} saved`,
          body: 'Open wishlist anytime from this account menu.',
        }
      : {
          id: 'wishlist-reminder',
          title: 'Wishlist reminders',
          body: 'Save styles to keep your shortlist handy for later.',
        },
    {
      id: 'coupon',
      title: `${drawerCoupons[0].code} coupon available`,
      body: 'Apply saved coupons during checkout whenever the order is eligible.',
    },
  ]

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
    persistAuthState({ isLoggedIn, accountProfile, isAdminPageOpen })
  }, [accountProfile, isAdminPageOpen, isLoggedIn])

  useEffect(() => {
    persistProductsState(products)
  }, [products])

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

  const resetDrawerAccountView = () => {
    setIsDrawerAccountOpen(false)
    setActiveDrawerAccountPanel('')
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

  const updateAdminProductDetails = (productId, nextDetails) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? syncManagedProductDetails(product, nextDetails) : product,
      ),
    )
  }

  const createAdminProduct = (preferredCategory) => {
    const nextProduct = buildNewManagedProduct(products, preferredCategory)

    setProducts((currentProducts) => [nextProduct, ...currentProducts])
    return nextProduct
  }

  const deleteAdminProduct = (productId) => {
    if (!isCustomManagedProductId(productId)) {
      return false
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId),
    )
    setWishlistItems((currentItems) => currentItems.filter((item) => item.id !== productId))
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId))
    setCheckoutItems((currentItems) => currentItems.filter((item) => item.id !== productId))

    if (selectedProductId === productId) {
      setSelectedProductId(null)
      setSelectedImage('')
      setSelectedColor('')
      setSelectedSize('')
    }

    return true
  }

  const updateAdminProductCategory = (productId, nextCategory) => {
    if (!mobileMenuItems.includes(nextCategory)) {
      return
    }

    updateAdminProductDetails(productId, { category: nextCategory })
  }

  const updateAdminProductStock = (productId, nextStockValue) => {
    updateAdminProductDetails(productId, { stockCount: nextStockValue })
  }

  const adjustAdminProductStock = (productId, change) => {
    const selectedProduct = products.find((product) => product.id === productId)

    if (!selectedProduct) {
      return
    }

    updateAdminProductDetails(productId, {
      stockCount: selectedProduct.stockCount + change,
    })
  }

  const updateAdminProductImage = (productId, nextImage) => {
    const normalizedImage = String(nextImage || '').trim()

    if (!normalizedImage) {
      return
    }

    updateAdminProductDetails(productId, {
      coverImage: normalizedImage,
    })
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
    resetDrawerAccountView()
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
    resetDrawerAccountView()
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
    resetDrawerAccountView()
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
    resetDrawerAccountView()
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
    resetDrawerAccountView()
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

  const closeAdminPage = () => {
    setIsAdminPageOpen(false)
    scrollToTop()
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
    setIsAdminPageOpen(false)
    setIsMenuOpen(false)
    resetDrawerAccountView()
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
    resetDrawerAccountView()
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
    resetDrawerAccountView()
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

    const normalizedPhone = normalizePhoneNumber(phoneNumber)
    const matchingAccount = accountProfile?.phone === normalizedPhone ? accountProfile : null
    const nextProfile = isAdminPhoneNumber(normalizedPhone)
      ? buildAdminProfile(normalizedPhone, matchingAccount)
      : matchingAccount || buildGuestProfile(normalizedPhone)

    setIsLoggedIn(true)
    setAccountProfile(nextProfile)
    setLoginError('')
    setLoginMessage(
      isAdminPhoneNumber(normalizedPhone)
        ? 'Admin access granted.'
        : matchingAccount
          ? `Welcome back, ${matchingAccount.fullName}.`
          : `Signed in with ${maskPhoneNumber(normalizedPhone)}.`,
    )
    setIsLoginOpen(false)
    resetLoginDraft(normalizedPhone)

    if (isAdminPhoneNumber(normalizedPhone)) {
      setSelectedProductId(null)
      setActiveInfoPage(null)
      setIsMenuOpen(false)
      resetDrawerAccountView()
      setIsWishlistOpen(false)
      setIsCartOpen(false)
      setIsCheckoutOpen(false)
      setIsReviewOpen(false)
      setIsAdminPageOpen(true)
      scrollToTop()
    }
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

    if (!isLoggedIn) {
      openLoginModal()
      setLoginMessage('Login karke Buy Now checkout continue karein.')
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

    const nextOrderId = createOrderId()
    const nextOrder = {
      id: nextOrderId,
      placedAt: formatOrderDateStamp(),
      paymentMethod: paymentMethodLabels[selectedPaymentMethod] || 'Payment selected',
      total: checkoutTotal,
      items: checkoutItems.map((item) => ({ ...item })),
      deliveryName: savedDeliveryDetails?.fullName || accountProfile?.fullName || 'Aryass Member',
      status: 'Confirmed',
    }

    if (checkoutSource === 'cart') {
      setCartItems([])
    }

    setOrderHistory((current) => [nextOrder, ...current])
    setCheckoutError('')
    setCheckoutOrderId(nextOrderId)
    setCheckoutStep('success')
  }

  const handleQuantityChange = (change) => {
    setQuantity((current) => Math.max(1, current + change))
  }

  const toggleDrawerAccount = () => {
    setIsDrawerAccountOpen((current) => {
      const nextState = !current

      if (!nextState) {
        setActiveDrawerAccountPanel('')
      }

      return nextState
    })
  }

  const getDrawerAccountPanelTitle = (panel = '') =>
    ({
      profile: 'My Profile',
      orders: 'My Orders',
      tracking: 'Track Orders',
      wishlist: 'Wishlist',
      address: 'Address Book',
      coupons: 'Coupons',
      payments: 'Payments',
      notifications: 'Notifications',
      support: 'Help & Support',
      password: 'Change Password',
    })[panel] || 'Account'

  const toggleDrawerAccountPanel = (panel) => {
    if (!isLoggedIn) {
      openLoginModal()
      return
    }

    setIsDrawerAccountOpen(true)
    setActiveDrawerAccountPanel(panel)
  }

  const cancelOrder = (orderId) => {
    setOrderHistory((current) =>
      current.map((order) =>
        order.id === orderId && order.status !== 'Cancelled'
          ? { ...order, status: 'Cancelled' }
          : order,
      ),
    )
  }

  const openWishlist = () => {
    setIsMenuOpen(false)
    resetDrawerAccountView()
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
    if (!selectedProduct) {
      return
    }

    if (!reviewData.rating || !reviewData.text || !reviewData.name || !reviewData.email) {
      window.alert('Fill all details')
      return
    }

    const newReview = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      rating: reviewData.rating,
      text: reviewData.text.trim(),
      name: reviewData.name.trim(),
      email: reviewData.email.trim().toLowerCase(),
      photos: [...reviewData.photos],
      createdAt: new Date().toISOString(),
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

  const drawerAccountSubtitle = isLoggedIn
    ? signedInLabel || 'Aryass Member'
    : 'Login, register aur help support yahin se access karein.'

  if (isAdminPageOpen) {
    return (
      <div className="page-shell page-shell--admin" id="top">
        <AdminPage
          onBack={closeAdminPage}
          onLogout={handleLogout}
          orders={orderHistory}
          products={products}
          reviews={reviews}
          coupons={drawerCoupons}
          accountProfile={accountProfile}
          menuCategories={mobileMenuItems}
          categoryContentByCategory={collectionContentByCategory}
          onCreateProduct={createAdminProduct}
          onDeleteProduct={deleteAdminProduct}
          onUpdateProductDetails={updateAdminProductDetails}
          onUpdateProductCategory={updateAdminProductCategory}
          onUpdateProductStock={updateAdminProductStock}
          onAdjustProductStock={adjustAdminProductStock}
          onUpdateProductImage={updateAdminProductImage}
        />
      </div>
    )
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
            onClick={() => {
              if (isMenuOpen) {
                resetDrawerAccountView()
              }

              setIsMenuOpen((open) => !open)
            }}
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
          {!isLoggedIn ? (
            <button type="button" className="header-login" onClick={handleHeaderAuthAction}>
              Login
            </button>
          ) : null}
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
        onClick={() => {
          setIsMenuOpen(false)
          resetDrawerAccountView()
        }}
      />

      <div
        id="mobile-drawer"
        className={`mobile-drawer ${isMenuOpen ? 'is-open' : ''} ${
          isDrawerAccountOpen ? 'is-account-view' : ''
        }`}
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
              onClick={() => {
                setIsMenuOpen(false)
                resetDrawerAccountView()
              }}
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
            <a key={item} href="#collection" onClick={() => handleMenuCategorySelect(item)}>
              <span>{item}</span>
              <Icon name="chevron" />
            </a>
          ))}
        </nav>

        <div className="drawer-account-section">
          {!isLoggedIn ? (
            <>
              <button
                type="button"
                className={`drawer-account-button ${isDrawerAccountOpen ? 'is-open' : ''}`}
                aria-expanded={isDrawerAccountOpen}
                onClick={toggleDrawerAccount}
              >
                <span className="drawer-account-leading">
                  <span className="drawer-account-icon-wrap">
                    <Icon name="account" className="drawer-account-icon" />
                  </span>
                  <span className="drawer-account-copy">
                    <strong>Account</strong>
                    <small>{drawerAccountSubtitle}</small>
                  </span>
                </span>
                <Icon
                  name="chevron"
                  className={`drawer-account-chevron ${isDrawerAccountOpen ? 'is-open' : ''}`}
                />
              </button>

              {isDrawerAccountOpen ? (
                <div className="drawer-account-actions">
                  <div className="drawer-account-detail-head drawer-account-detail-head--root">
                    <button
                      type="button"
                      className="drawer-account-back"
                      onClick={resetDrawerAccountView}
                    >
                      <Icon name="left" />
                      Back
                    </button>
                    <div className="drawer-account-heading">
                      <strong>Account</strong>
                      <p>Login ya register karke apna account aur support access karein.</p>
                    </div>
                  </div>
                  <button type="button" className="drawer-account-action" onClick={openLoginModal}>
                    Login
                  </button>
                  <button type="button" className="drawer-account-action" onClick={openSignupModal}>
                    Register
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => openFooterPage(FOOTER_PAGE_IDS.contactInformation)}
                  >
                    Help & Support
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <button
                type="button"
                className={`drawer-account-button ${isDrawerAccountOpen ? 'is-open' : ''}`}
                aria-expanded={isDrawerAccountOpen}
                onClick={toggleDrawerAccount}
              >
                <span className="drawer-account-leading">
                  <span className="drawer-account-icon-wrap">
                    <Icon name="account" className="drawer-account-icon" />
                  </span>
                  <span className="drawer-account-copy">
                    <strong>Account</strong>
                    <small>{drawerAccountSubtitle}</small>
                  </span>
                </span>
                <Icon
                  name="chevron"
                  className={`drawer-account-chevron ${isDrawerAccountOpen ? 'is-open' : ''}`}
                />
              </button>

              {isDrawerAccountOpen ? (
                <div
                  className={`drawer-account-actions ${
                    activeDrawerAccountPanel ? 'is-detail-view' : ''
                  }`}
                >
                  <div
                    className={`drawer-account-detail-head ${
                      activeDrawerAccountPanel ? '' : 'drawer-account-detail-head--root'
                    }`}
                  >
                    <button
                      type="button"
                      className="drawer-account-back"
                      onClick={
                        activeDrawerAccountPanel
                          ? () => setActiveDrawerAccountPanel('')
                          : resetDrawerAccountView
                      }
                    >
                      <Icon name="left" />
                      Back
                    </button>
                    <div className="drawer-account-heading">
                      <strong>
                        {activeDrawerAccountPanel
                          ? getDrawerAccountPanelTitle(activeDrawerAccountPanel)
                          : 'Account'}
                      </strong>
                      {!activeDrawerAccountPanel ? <p>{drawerAccountSubtitle}</p> : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('profile')}
                  >
                    My Profile
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('orders')}
                  >
                    My Orders
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('tracking')}
                  >
                    Track Orders
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('wishlist')}
                  >
                    Wishlist
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('address')}
                  >
                    Address Book
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('coupons')}
                  >
                    Coupons
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('payments')}
                  >
                    Payments
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('notifications')}
                  >
                    Notifications
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('support')}
                  >
                    Help & Support
                  </button>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => toggleDrawerAccountPanel('password')}
                  >
                    Change Password
                  </button>
                  {isLoggedIn ? (
                    <button
                      type="button"
                      className="drawer-account-action drawer-account-action--logout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  ) : null}

              {activeDrawerAccountPanel === 'orders' ? (
                <div className="drawer-order-list">
                  {recentOrders.length ? (
                    recentOrders.map((order) => (
                      <article key={`${order.id}-summary`} className="drawer-order-card">
                        <div className="drawer-order-head">
                          <div>
                            <h4>{order.id}</h4>
                            <p>{order.placedAt}</p>
                          </div>
                          <span className={order.status === 'Cancelled' ? 'is-cancelled' : ''}>
                            {order.status}
                          </span>
                        </div>
                    <p className="drawer-order-meta">
                      {order.items.reduce((sum, item) => sum + item.qty, 0)} item
                      {order.items.reduce((sum, item) => sum + item.qty, 0) > 1 ? 's' : ''} |{' '}
                      {order.paymentMethod}
                        </p>
                        <p className="drawer-order-meta">
                          Deliver to {order.deliveryName} | {formatPrice(order.total.toLocaleString('en-IN'))}
                        </p>
                        <div className="drawer-order-footer">
                          <button
                            type="button"
                            className="drawer-cancel-order-button"
                            disabled={order.status === 'Cancelled'}
                            onClick={() => cancelOrder(order.id)}
                          >
                            {order.status === 'Cancelled' ? 'Order cancelled' : 'Cancel order'}
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="drawer-order-empty">
                      <strong>No orders yet</strong>
                      <p>Place your first order and details yahin menu me show ho jayengi.</p>
                    </div>
                  )}
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'tracking' ? (
                <div className="drawer-order-list">
                  {recentOrders.length ? (
                    recentOrders.map((order) => (
                      <article key={`${order.id}-tracking`} className="drawer-order-card">
                        <div className="drawer-order-head">
                          <div>
                            <h4>{order.id}</h4>
                            <p>{order.placedAt}</p>
                          </div>
                          <span className={order.status === 'Cancelled' ? 'is-cancelled' : ''}>
                            {order.status}
                          </span>
                        </div>
                        <p className="drawer-order-meta">{getTrackingStatusNote(order.status)}</p>
                        <p className="drawer-order-meta">Delivering to {order.deliveryName}</p>
                      </article>
                    ))
                  ) : (
                    <div className="drawer-order-empty">
                      <strong>No orders to track</strong>
                      <p>Jab order place hoga, uska live status yahin show hoga.</p>
                    </div>
                  )}
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'profile' ? (
                <div className="drawer-order-list">
                  <article className="drawer-order-card">
                    <div className="drawer-order-head">
                      <div>
                        <h4>{accountProfile?.fullName || 'Aryass Member'}</h4>
                        <p>{accountProfile?.tier || 'Account access'}</p>
                      </div>
                      <span>{accountProfile?.memberSince || 'Member'}</span>
                    </div>
                    <p className="drawer-order-meta">
                      Email: {accountProfile?.email || 'Not added yet'}
                    </p>
                    <p className="drawer-order-meta">
                      Phone: {formatAccountPhone(accountProfile?.phone)}
                    </p>
                    <p className="drawer-order-meta">
                      City: {accountProfile?.city || 'Not shared yet'}
                    </p>
                  </article>
                  <button type="button" className="drawer-account-action" onClick={openProfileModal}>
                    Edit Profile
                  </button>
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'wishlist' ? (
                <div className="drawer-order-list">
                  {wishlistItems.length ? (
                    wishlistItems.map((item) => (
                      <article
                        key={`${item.id}-${item.size}-${item.color}`}
                        className="drawer-order-card"
                      >
                        <div className="drawer-order-head">
                          <div>
                            <h4>{item.name}</h4>
                            <p>{formatPrice(item.price.toLocaleString('en-IN'))}</p>
                          </div>
                          <span>{item.soldOut ? 'Sold out' : 'Saved'}</span>
                        </div>
                        <p className="drawer-order-meta">Color: {item.color}</p>
                        <p className="drawer-order-meta">Size: {item.size}</p>
                        <div className="wishlist-item-actions">
                          <button
                            type="button"
                            className="drawer-account-action"
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
                      </article>
                    ))
                  ) : (
                    <div className="drawer-order-empty">
                      <strong>No saved styles yet</strong>
                      <p>Jo product pasand aaye usse heart icon se wishlist me save kar lo.</p>
                    </div>
                  )}
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'legacy-orders' ? (
                <div className="drawer-order-list">
                  {orderHistory.length ? (
                    orderHistory.slice(0, 3).map((order) => (
                      <article key={order.id} className="drawer-order-card">
                        <div className="drawer-order-head">
                          <div>
                            <h4>{order.id}</h4>
                            <p>{order.placedAt}</p>
                          </div>
                          <span>{order.status}</span>
                        </div>
                        <p className="drawer-order-meta">
                          {order.items.reduce((sum, item) => sum + item.qty, 0)} item
                          {order.items.reduce((sum, item) => sum + item.qty, 0) > 1 ? 's' : ''} ·{' '}
                          {order.paymentMethod}
                        </p>
                        <p className="drawer-order-meta">
                          Deliver to {order.deliveryName} · {formatPrice(order.total.toLocaleString('en-IN'))}
                        </p>
                      </article>
                    ))
                  ) : (
                    <div className="drawer-order-empty">
                      <strong>No orders yet</strong>
                      <p>Place your first order and details yahin menu me show ho jayengi.</p>
                    </div>
                  )}
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'address' ? (
                <div className="drawer-order-list">
                  {savedAddressSummary.length ? (
                    <article className="drawer-order-card">
                      <div className="drawer-order-head">
                        <div>
                          <h4>Address Book</h4>
                          <p>Ready for faster checkout</p>
                        </div>
                        <span>Active</span>
                      </div>
                      {savedAddressSummary.map((line) => (
                        <p key={line} className="drawer-order-meta">
                          {line}
                        </p>
                      ))}
                    </article>
                  ) : (
                    <div className="drawer-order-empty">
                      <strong>No saved address</strong>
                      <p>Checkout par address save karoge to yahan show ho jayega.</p>
                    </div>
                  )}
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'coupons' ? (
                <div className="drawer-order-list">
                  {drawerCoupons.map((coupon) => (
                    <article key={coupon.code} className="drawer-order-card">
                      <div className="drawer-order-head">
                        <div>
                          <h4>{coupon.code}</h4>
                          <p>{coupon.note}</p>
                        </div>
                        <span>Save</span>
                      </div>
                      <p className="drawer-order-meta">Apply this code during checkout if eligible.</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'payments' ? (
                <div className="drawer-order-list">
                  {drawerPaymentMethods.map((method) => (
                    <article key={method.key} className="drawer-order-card">
                      <div className="drawer-order-head">
                        <div>
                          <h4>{method.label}</h4>
                          <p>{method.detail}</p>
                        </div>
                        <span>{method.isPreferred ? 'Selected' : 'Available'}</span>
                      </div>
                      <p className="drawer-order-meta">
                        {latestOrder?.paymentMethod === method.label
                          ? `Used on your latest order ${latestOrder.id}.`
                          : 'Ready to use at checkout whenever you choose it.'}
                      </p>
                    </article>
                  ))}
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'notifications' ? (
                <div className="drawer-order-list">
                  {drawerNotifications.map((notification) => (
                    <article key={notification.id} className="drawer-order-card">
                      <div className="drawer-order-head">
                        <div>
                          <h4>{notification.title}</h4>
                          <p>Account update</p>
                        </div>
                        <span>New</span>
                      </div>
                      <p className="drawer-order-meta">{notification.body}</p>
                    </article>
                  ))}
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'support' ? (
                <div className="drawer-order-list">
                  <article className="drawer-order-card">
                    <div className="drawer-order-head">
                      <div>
                        <h4>Help & Support</h4>
                        <p>Order help, returns, aur general assistance</p>
                      </div>
                      <span>Open</span>
                    </div>
                    <p className="drawer-order-meta">
                      Email support: Use the support email shared in your order confirmation or footer
                      contact block.
                    </p>
                    <p className="drawer-order-meta">
                      WhatsApp assistance: Text-only support quick order updates ke liye available hai.
                    </p>
                    <p className="drawer-order-meta">
                      Working hours: Monday to Saturday, 10 AM to 7 PM IST.
                    </p>
                  </article>
                  <button
                    type="button"
                    className="drawer-account-action"
                    onClick={() => openFooterPage(FOOTER_PAGE_IDS.contactInformation)}
                  >
                    Open Support Page
                  </button>
                </div>
              ) : null}

              {activeDrawerAccountPanel === 'password' ? (
                <div className="drawer-order-list">
                  <article className="drawer-order-card">
                    <div className="drawer-order-head">
                      <div>
                        <h4>Change Password</h4>
                        <p>Secure access settings</p>
                      </div>
                      <span>OTP</span>
                    </div>
                    <p className="drawer-order-meta">
                      Abhi account secure OTP sign-in par chalta hai, isliye separate password setup
                      available nahi hai.
                    </p>
                    <p className="drawer-order-meta">
                      Jab password flow add hoga, update option isi account section me mil jayega.
                    </p>
                  </article>
                </div>
              ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>

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
          reviewCount={selectedProductReviewCount}
          reviewRating={selectedProductReviewRating}
          productReviews={selectedProductReviews}
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
