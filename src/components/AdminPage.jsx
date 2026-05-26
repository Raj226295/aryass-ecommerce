import { useEffect, useState } from 'react'
import Icon from './Icon'

const adminMenuItems = [
  { key: 'dashboard', label: 'Dashboard', note: 'Overview and business pulse' },
  { key: 'orders', label: 'Orders', note: 'Dispatch and status control' },
  { key: 'products', label: 'Products', note: 'Catalog, stock, and pricing' },
  { key: 'categories', label: 'Categories', note: 'Top-level catalog structure' },
  { key: 'customers', label: 'Customers', note: 'Accounts and moderation' },
  { key: 'payments', label: 'Payments', note: 'Transactions and reconciliation' },
  { key: 'coupons', label: 'Coupons', note: 'Discount campaigns and usage' },
  { key: 'reviews', label: 'Reviews', note: 'Approve and manage feedback' },
  { key: 'notifications', label: 'Notifications', note: 'Broadcasts and order alerts' },
  { key: 'reports', label: 'Reports', note: 'Performance and revenue trends' },
  { key: 'settings', label: 'Settings', note: 'Storefront and checkout controls' },
]

const orderFilters = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending Orders' },
  { key: 'shipped', label: 'Shipped Orders' },
  { key: 'delivered', label: 'Delivered Orders' },
  { key: 'cancelled', label: 'Cancelled Orders' },
]

const paymentFilters = [
  { key: 'all', label: 'All Payments' },
  { key: 'paid', label: 'Paid Orders' },
  { key: 'pending', label: 'Pending Payments' },
  { key: 'refund', label: 'Refunds' },
  { key: 'cod', label: 'COD Orders' },
]

const sampleOrders = [
  {
    id: 'ARY10234',
    customer: 'Riya Sharma',
    date: '25 May 2026',
    amount: 3490,
    status: 'Pending',
    paymentMethod: 'UPI',
    trackingId: 'TRK921431',
  },
  {
    id: 'ARY10208',
    customer: 'Aanya Gupta',
    date: '24 May 2026',
    amount: 5299,
    status: 'Shipped',
    paymentMethod: 'Card',
    trackingId: 'TRK921428',
  },
  {
    id: 'ARY10196',
    customer: 'Meher Batra',
    date: '23 May 2026',
    amount: 2899,
    status: 'Delivered',
    paymentMethod: 'COD',
    trackingId: 'TRK921401',
  },
  {
    id: 'ARY10174',
    customer: 'Tara Sethi',
    date: '22 May 2026',
    amount: 1899,
    status: 'Cancelled',
    paymentMethod: 'UPI',
    trackingId: 'TRK921366',
  },
]

const sampleUsers = [
  {
    id: 'USR1001',
    name: 'Ritika Jain',
    email: 'ritika@example.com',
    phone: '+91 98765 10231',
    city: 'Jaipur',
    status: 'Active',
    memberSince: 'Jan 2026',
    orders: 7,
    totalSpend: 18240,
    type: 'Registered',
  },
  {
    id: 'USR1002',
    name: 'Sana Ali',
    email: 'sana@example.com',
    phone: '+91 98911 45328',
    city: 'Delhi',
    status: 'Blocked',
    memberSince: 'Feb 2026',
    orders: 2,
    totalSpend: 4199,
    type: 'Registered',
  },
  {
    id: 'USR1003',
    name: 'Ishita Rao',
    email: 'ishita@example.com',
    phone: '+91 99331 11827',
    city: 'Pune',
    status: 'Active',
    memberSince: 'Mar 2026',
    orders: 4,
    totalSpend: 9650,
    type: 'Registered',
  },
  {
    id: 'USR1004',
    name: 'Neha Kapoor',
    email: 'neha@example.com',
    phone: '+91 99882 61234',
    city: 'Mumbai',
    status: 'Active',
    memberSince: 'Apr 2026',
    orders: 5,
    totalSpend: 12490,
    type: 'Registered',
  },
]

const sampleCoupons = [
  { code: 'WELCOME10', discount: '10% OFF', expiry: '30 Jun 2026', usageLimit: 500, used: 182 },
  { code: 'ARYASS15', discount: '15% OFF', expiry: '15 Jul 2026', usageLimit: 250, used: 76 },
  { code: 'FREESHIP', discount: 'Free Shipping', expiry: '20 Jun 2026', usageLimit: 800, used: 341 },
]

const sampleReviews = [
  {
    id: 'REV-1001',
    product: 'Noir Thread Dress',
    customer: 'Mitali',
    rating: 5,
    text: 'Fit and finish both felt premium. Ready to approve.',
    status: 'Pending Approval',
  },
  {
    id: 'REV-1002',
    product: 'Cocoa Twist Set',
    customer: 'Radhika',
    rating: 4,
    text: 'Comfortable fabric and fast delivery update.',
    status: 'Approved',
  },
]

const notificationRows = [
  { title: 'Offer Notification', audience: 'All users', note: 'Push latest festive discount alerts.' },
  { title: 'Order Update', audience: 'Recent customers', note: 'Dispatch and delivery milestone messages.' },
  { title: 'Discount Alert', audience: 'Wishlist users', note: 'Notify when saved products get discounts.' },
]

const reportRows = [
  { month: 'Jan', revenue: 32000 },
  { month: 'Feb', revenue: 41000 },
  { month: 'Mar', revenue: 38500 },
  { month: 'Apr', revenue: 47000 },
  { month: 'May', revenue: 52000 },
]

const settingsRows = [
  { title: 'Website Logo', note: 'Update storefront wordmark and favicon assets.' },
  { title: 'Banner Images', note: 'Replace campaign hero banners and offer slides.' },
  { title: 'Delivery Charges', note: 'Manage free shipping threshold and zone charges.' },
  { title: 'Payment Settings', note: 'Enable UPI, COD, cards, and refund policies.' },
  { title: 'Social Links', note: 'Edit Instagram, Facebook, and YouTube destinations.' },
]

function formatAdminCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString('en-IN')}`
}

function formatCompactCount(value) {
  return Number(value || 0).toLocaleString('en-IN')
}

function parsePriceValue(value) {
  return Number(String(value || 0).replace(/,/g, ''))
}

function mapOrderStatus(status = '', index = 0) {
  if (status === 'Cancelled') {
    return 'Cancelled'
  }

  return ['Pending', 'Shipped', 'Delivered'][index % 3]
}

function getStatusTone(status = '') {
  const normalized = status.toLowerCase()

  if (normalized.includes('in stock')) {
    return 'success'
  }

  if (normalized.includes('low stock')) {
    return 'warning'
  }

  if (normalized.includes('out of stock')) {
    return 'danger'
  }

  if (normalized.includes('deliver') || normalized.includes('paid') || normalized.includes('approve')) {
    return 'success'
  }

  if (normalized.includes('ship')) {
    return 'info'
  }

  if (normalized.includes('cancel') || normalized.includes('block') || normalized.includes('refund')) {
    return 'danger'
  }

  if (normalized.includes('pending') || normalized.includes('cod')) {
    return 'warning'
  }

  return 'neutral'
}

function getOrderFilterKey(status = '') {
  const normalized = status.toLowerCase()

  if (normalized.includes('cancel')) {
    return 'cancelled'
  }

  if (normalized.includes('deliver')) {
    return 'delivered'
  }

  if (normalized.includes('ship')) {
    return 'shipped'
  }

  return 'pending'
}

function getPaymentFilterKey(status = '') {
  const normalized = status.toLowerCase()

  if (normalized.includes('refund')) {
    return 'refund'
  }

  if (normalized.includes('pending')) {
    return 'pending'
  }

  if (normalized.includes('cod')) {
    return 'cod'
  }

  return 'paid'
}

function getCustomerFilterKey(status = '') {
  return status.toLowerCase().includes('block') ? 'blocked' : 'active'
}

function buildInitialCustomers(accountProfile) {
  const nextRows = [...sampleUsers]

  if (!accountProfile?.phone) {
    return nextRows
  }

  const adminCustomer = {
    id: 'USR-ADMIN',
    name: accountProfile.fullName || 'Aryass Member',
    email: accountProfile.email || 'Not added yet',
    phone: accountProfile.phone ? `+91 ${accountProfile.phone.slice(0, 5)} ${accountProfile.phone.slice(5)}` : 'Not shared yet',
    city: accountProfile.city || 'Not shared yet',
    status: 'Active',
    memberSince: accountProfile.memberSince || 'May 2026',
    orders: 3,
    totalSpend: 8790,
    type: accountProfile.isGuest ? 'Guest' : 'Registered',
  }

  const alreadyExists = nextRows.some(
    (customer) => customer.email === adminCustomer.email || customer.phone === adminCustomer.phone,
  )

  return alreadyExists ? nextRows : [adminCustomer, ...nextRows]
}

function createProductEditorState(product) {
  return {
    name: product.name,
    label: product.label || '',
    category: product.category,
    price: product.price,
    oldPrice: product.oldPrice || '',
    saleBadgeText: product.saleBadgeText || '',
    shippingNote: product.shippingNote || '',
    sku: product.sku || '',
    stockCount: String(product.stockCount ?? 0),
    coverImage: product.image || '',
    gallery: Array.isArray(product.gallery) ? product.gallery.join('\n') : product.image || '',
    colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
    sizes: Array.isArray(product.sizes) ? product.sizes.map((size) => ({ ...size })) : [],
    description: Array.isArray(product.description) ? product.description.join('\n\n') : '',
    styleNotes: Array.isArray(product.styleNotes) ? product.styleNotes.join('\n') : '',
    storyTitle: product.storyTitle || '',
    storyText: product.storyText || '',
  }
}

function parseEditorList(value) {
  const sourceValues = Array.isArray(value) ? value : String(value || '').split(/[\n,]+/)
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

function parseEditorParagraphs(value) {
  return String(value || '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}

function getInventoryStatus(product) {
  if (product.soldOut) {
    return 'Out of Stock'
  }

  if (product.stockCount < 6) {
    return 'Low Stock'
  }

  return 'In Stock'
}

function isCustomProduct(productId = '') {
  return String(productId).startsWith('aryass-custom-')
}

function AdminPage({
  onBack,
  onLogout,
  orders,
  products,
  reviews,
  coupons,
  accountProfile,
  menuCategories,
  categoryContentByCategory,
  onCreateProduct,
  onDeleteProduct,
  onUpdateProductDetails,
}) {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [activeOrderFilter, setActiveOrderFilter] = useState('all')
  const [activePaymentFilter, setActivePaymentFilter] = useState('all')
  const [activeCustomerFilter, setActiveCustomerFilter] = useState('all')
  const [activeProductCategoryFilter, setActiveProductCategoryFilter] = useState('all')
  const [selectedAdminProductId, setSelectedAdminProductId] = useState(() => products[0]?.id || '')
  const [productEditor, setProductEditor] = useState(() =>
    products[0] ? createProductEditorState(products[0]) : null,
  )
  const [productEditorNotice, setProductEditorNotice] = useState('')
  const [managedCustomers, setManagedCustomers] = useState(() => buildInitialCustomers(accountProfile))
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    () => buildInitialCustomers(accountProfile)[0]?.id || '',
  )
  const syncedCategories = menuCategories?.length
    ? menuCategories
    : [...new Set(products.map((product) => product.category))]

  const liveOrders = orders.map((order, index) => ({
    id: order.id,
    customer: order.deliveryName || 'Aryass Member',
    date: order.placedAt,
    amount: Number(order.total || 0),
    status: mapOrderStatus(order.status, index),
    paymentMethod: order.paymentMethod || 'UPI',
    trackingId: `TRK${String(order.id).slice(-6)}`,
  }))

  const orderRows = liveOrders.length ? liveOrders : sampleOrders
  const totalRevenueValue = orderRows.reduce((sum, order) => sum + Number(order.amount || 0), 0)
  const pendingOrders = orderRows.filter((order) => getOrderFilterKey(order.status) === 'pending').length
  const deliveredOrders = orderRows.filter((order) => getOrderFilterKey(order.status) === 'delivered').length
  const totalUsers = Math.max(1240, managedCustomers.length)
  const totalProducts = products.length

  const filteredOrders =
    activeOrderFilter === 'all'
      ? orderRows
      : orderRows.filter((order) => getOrderFilterKey(order.status) === activeOrderFilter)

  const paymentRows = orderRows.map((order, index) => ({
    id: `PAY-${String(index + 1).padStart(4, '0')}`,
    transactionId: `TXN${String(order.id).slice(-6)}`,
    customer: order.customer,
    amount: order.amount,
    method: order.paymentMethod,
    status:
      order.paymentMethod === 'COD'
        ? 'COD'
        : order.status === 'Cancelled'
          ? 'Refunded'
          : index % 3 === 0
            ? 'Pending'
            : 'Paid',
  }))

  const filteredPayments =
    activePaymentFilter === 'all'
      ? paymentRows
      : paymentRows.filter((payment) => getPaymentFilterKey(payment.status) === activePaymentFilter)

  const inventoryRows = products.map((product) => {
    const oldPriceValue = parsePriceValue(product.oldPrice)
    const priceValue = parsePriceValue(product.price)
    const discount =
      oldPriceValue > priceValue
        ? `${Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100)}%`
        : '0%'

    return {
      id: product.id,
      name: product.name,
      image: product.image,
      gallery: [product.image, ...(Array.isArray(product.gallery) ? product.gallery : [])]
        .filter(Boolean)
        .filter((image, index, gallery) => gallery.indexOf(image) === index)
        .slice(0, 4),
      category: product.category,
      price: product.price,
      discount,
      stock: product.stockCount,
      colors: product.colors.slice(0, 3).join(', '),
      sizes: product.sizes.slice(0, 4).map((size) => size.label).join(', '),
      status: product.soldOut ? 'Out of Stock' : product.stockCount < 6 ? 'Low Stock' : 'In Stock',
    }
  })
  const filteredManagedProducts =
    activeProductCategoryFilter === 'all'
      ? products
      : products.filter((product) => product.category === activeProductCategoryFilter)
  const categoryRows = syncedCategories.map((category) => {
    const categoryProducts = products.filter((product) => product.category === category)
    const liveCount = categoryProducts.filter((product) => !product.soldOut).length
    const soldOutCount = categoryProducts.filter((product) => product.soldOut).length

    return {
      name: category,
      products: categoryProducts.length,
      liveCount,
      soldOutCount,
      note:
        categoryContentByCategory?.[category]?.description ||
        'Customer storefront ke saath synced category listing.',
    }
  })
  const selectedManagedProduct =
    filteredManagedProducts.find((product) => product.id === selectedAdminProductId) ||
    filteredManagedProducts[0] ||
    null
  const filteredLowStockCount = filteredManagedProducts.filter(
    (product) => !product.soldOut && product.stockCount < 6,
  ).length
  const filteredSoldOutCount = filteredManagedProducts.filter((product) => product.soldOut).length
  const filteredRichGalleryCount = filteredManagedProducts.filter(
    (product) => Array.isArray(product.gallery) && product.gallery.length >= 4,
  ).length

  useEffect(() => {
    if (filteredManagedProducts.length) {
      const isSelectedProductVisible = filteredManagedProducts.some(
        (product) => product.id === selectedAdminProductId,
      )

      if (!isSelectedProductVisible) {
        setSelectedAdminProductId(filteredManagedProducts[0].id)
      }

      return
    }

    if (selectedAdminProductId) {
      setSelectedAdminProductId('')
    }
  }, [filteredManagedProducts, selectedAdminProductId])

  useEffect(() => {
    if (!selectedManagedProduct) {
      setProductEditor(null)
      setProductEditorNotice('')
      return
    }

    setProductEditor(createProductEditorState(selectedManagedProduct))
    setProductEditorNotice('')
  }, [selectedManagedProduct?.id])

  const customerRows =
    activeCustomerFilter === 'all'
      ? managedCustomers
      : managedCustomers.filter(
          (customer) => getCustomerFilterKey(customer.status) === activeCustomerFilter,
        )
  const selectedCustomer =
    managedCustomers.find((customer) => customer.id === selectedCustomerId) || customerRows[0] || null
  const couponRows = coupons.length
    ? coupons.map((coupon, index) => ({
        code: coupon.code,
        discount: index === 2 ? 'Free Shipping' : index === 1 ? '15% OFF' : '10% OFF',
        expiry: ['30 Jun 2026', '15 Jul 2026', '20 Jun 2026'][index % 3],
        usageLimit: [500, 250, 800][index % 3],
        used: [182, 76, 341][index % 3],
      }))
    : sampleCoupons

  const reviewRows = reviews.length
    ? reviews.slice(0, 6).map((review, index) => ({
        id: review.id,
        product: review.productName || 'Aryass Product',
        customer: review.name,
        rating: review.rating,
        text: review.text,
        status: index % 2 === 0 ? 'Pending Approval' : 'Approved',
      }))
    : sampleReviews

  const dashboardCards = [
    { label: 'Total Orders', value: formatCompactCount(Math.max(orderRows.length, 245)), note: 'Across all order stages' },
    { label: 'Total Revenue', value: formatAdminCurrency(Math.max(totalRevenueValue, 52000)), note: 'Gross captured value' },
    { label: 'Pending Orders', value: formatCompactCount(Math.max(pendingOrders, 12)), note: 'Need action or dispatch' },
    { label: 'Delivered Orders', value: formatCompactCount(Math.max(deliveredOrders, 178)), note: 'Completed deliveries' },
    { label: 'Total Users', value: formatCompactCount(totalUsers), note: 'Registered and guest users' },
    { label: 'Total Products', value: formatCompactCount(totalProducts), note: 'Live catalog inventory' },
  ]

  const topSellingRows = inventoryRows.slice(0, 4)
  const activeSectionLabel = adminMenuItems.find((item) => item.key === activeMenu)?.label || 'Dashboard'
  const adminName = accountProfile?.fullName || 'Aryass Admin'
  const heroHighlights = [
    `${formatCompactCount(Math.max(orderRows.length, 245))} orders`,
    `${formatCompactCount(Math.max(pendingOrders, 12))} pending`,
    `${formatCompactCount(totalProducts)} products live`,
  ]
  const openCategoryProducts = (category) => {
    setActiveProductCategoryFilter(category)
    setActiveMenu('products')
  }

  const createNewProductDraft = () => {
    const preferredCategory =
      activeProductCategoryFilter === 'all'
        ? selectedManagedProduct?.category || syncedCategories[0]
        : activeProductCategoryFilter
    const nextProduct = onCreateProduct(preferredCategory)

    if (!nextProduct) {
      return
    }

    setSelectedAdminProductId(nextProduct.id)
    setProductEditor(createProductEditorState(nextProduct))
    setProductEditorNotice('New product draft created. Ab fields fill karke save karo.')
  }

  const normalizeEditorSizesForStock = (sizes, stockCount) => {
    const nextStockCount = Math.max(0, Number(stockCount) || 0)
    const normalizedSizes = sizes.map((size) => ({
      ...size,
      available: nextStockCount === 0 ? false : Boolean(size.available),
    }))

    if (nextStockCount > 0 && normalizedSizes.length && !normalizedSizes.some((size) => size.available)) {
      normalizedSizes[0] = {
        ...normalizedSizes[0],
        available: true,
      }
    }

    return normalizedSizes
  }

  const updateProductEditorField = (field, value) => {
    setProductEditor((currentEditor) =>
      currentEditor
        ? {
            ...currentEditor,
            [field]: value,
          }
        : currentEditor,
    )
    setProductEditorNotice('')
  }

  const updateProductEditorStock = (nextStockValue) => {
    setProductEditor((currentEditor) => {
      if (!currentEditor) {
        return currentEditor
      }

      return {
        ...currentEditor,
        stockCount: String(Math.max(0, Number(nextStockValue) || 0)),
        sizes: normalizeEditorSizesForStock(currentEditor.sizes, nextStockValue),
      }
    })
    setProductEditorNotice('')
  }

  const updateProductEditorSizeList = (value) => {
    const nextLabels = parseEditorList(value).map((size) => size.toUpperCase())

    setProductEditor((currentEditor) => {
      if (!currentEditor) {
        return currentEditor
      }

      const currentSizesByLabel = new Map(
        currentEditor.sizes.map((size) => [size.label.toUpperCase(), Boolean(size.available)]),
      )
      const nextSizes = nextLabels.length
        ? nextLabels.map((label) => ({
            label,
            available: currentSizesByLabel.get(label) ?? true,
          }))
        : []

      return {
        ...currentEditor,
        sizes: normalizeEditorSizesForStock(nextSizes, currentEditor.stockCount),
      }
    })
    setProductEditorNotice('')
  }

  const toggleProductEditorSize = (sizeLabel) => {
    setProductEditor((currentEditor) => {
      if (!currentEditor) {
        return currentEditor
      }

      const toggledSizes = currentEditor.sizes.map((size) =>
        size.label === sizeLabel
          ? {
              ...size,
              available: !size.available,
            }
          : size,
      )

      return {
        ...currentEditor,
        sizes: normalizeEditorSizesForStock(toggledSizes, currentEditor.stockCount),
      }
    })
    setProductEditorNotice('')
  }

  const resetProductEditor = () => {
    if (!selectedManagedProduct) {
      return
    }

    setProductEditor(createProductEditorState(selectedManagedProduct))
    setProductEditorNotice('Unsaved edits discarded.')
  }

  const saveProductEditor = () => {
    if (!selectedManagedProduct || !productEditor) {
      return
    }

    onUpdateProductDetails(selectedManagedProduct.id, {
      name: productEditor.name,
      label: productEditor.label,
      category: productEditor.category,
      price: productEditor.price,
      oldPrice: productEditor.oldPrice,
      saleBadgeText: productEditor.saleBadgeText,
      shippingNote: productEditor.shippingNote,
      sku: productEditor.sku,
      stockCount: productEditor.stockCount,
      coverImage: productEditor.coverImage,
      gallery: parseEditorList(productEditor.gallery),
      colors: parseEditorList(productEditor.colors),
      sizes: productEditor.sizes,
      description: parseEditorParagraphs(productEditor.description),
      styleNotes: String(productEditor.styleNotes || '')
        .split(/\n+/)
        .map((note) => note.trim())
        .filter(Boolean),
      storyTitle: productEditor.storyTitle,
      storyText: productEditor.storyText,
    })
    setProductEditorNotice('Storefront product updated successfully.')
  }

  const deleteSelectedProduct = () => {
    if (!selectedManagedProduct || !isCustomProduct(selectedManagedProduct.id)) {
      return
    }

    const isDeleted = onDeleteProduct(selectedManagedProduct.id)

    if (isDeleted) {
      setProductEditorNotice('Custom product removed from the catalog.')
    }
  }

  const editorGalleryPreview = parseEditorList(productEditor?.gallery)
  const editorCoverImagePreview =
    String(productEditor?.coverImage || '').trim() ||
    editorGalleryPreview[0] ||
    selectedManagedProduct?.image ||
    ''
  const editorColorPreview = parseEditorList(productEditor?.colors)
  const editorDescriptionPreview = parseEditorParagraphs(productEditor?.description)
  const editorAvailableSizes = Array.isArray(productEditor?.sizes)
    ? productEditor.sizes.filter((size) => size.available).map((size) => size.label)
    : []

  const renderDashboard = () => (
    <div className="admin-section-stack">
      <section className="admin-metric-grid">
        {dashboardCards.map((card) => (
          <article key={card.label} className="admin-metric-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.note}</p>
          </article>
        ))}
      </section>

      <section className="admin-overview-grid">
        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Order pulse</p>
              <h2>Recent order stream</h2>
            </div>
          </div>
          <div className="admin-record-list">
            {orderRows.slice(0, 3).map((order) => (
              <article key={order.id} className="admin-record-card">
                <div className="admin-record-head">
                  <div>
                    <strong>{order.id}</strong>
                    <p>{order.customer}</p>
                  </div>
                  <span className={`admin-status-pill admin-status-pill--${getStatusTone(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="admin-record-grid">
                  <div className="admin-record-field">
                    <span>Amount</span>
                    <strong>{formatAdminCurrency(order.amount)}</strong>
                  </div>
                  <div className="admin-record-field">
                    <span>Payment</span>
                    <strong>{order.paymentMethod}</strong>
                  </div>
                  <div className="admin-record-field">
                    <span>Tracking</span>
                    <strong>{order.trackingId}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Quick actions</p>
              <h2>Core admin controls</h2>
            </div>
          </div>
          <div className="admin-action-grid">
            {[
              'Update order status',
              'Add product',
              'Create coupon',
              'Approve reviews',
              'Send offer alert',
              'Edit delivery charges',
            ].map((action) => (
              <button key={action} type="button" className="admin-ghost-button">
                {action}
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  )

  const renderOrders = () => (
    <section className="admin-panel">
      <div className="admin-panel-head admin-panel-head--spread">
        <div>
          <p className="admin-panel-kicker">Orders management</p>
          <h2>Track, update, and dispatch every order.</h2>
        </div>
        <div className="admin-chip-row">
          {orderFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`admin-filter-chip ${activeOrderFilter === filter.key ? 'is-active' : ''}`}
              onClick={() => setActiveOrderFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-record-list admin-record-list--split">
        {filteredOrders.map((order) => (
          <article key={order.id} className="admin-record-card">
            <div className="admin-record-head">
              <div>
                <strong>{order.id}</strong>
                <p>{order.customer}</p>
              </div>
              <span className={`admin-status-pill admin-status-pill--${getStatusTone(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="admin-record-grid">
              <div className="admin-record-field">
                <span>Date</span>
                <strong>{order.date}</strong>
              </div>
              <div className="admin-record-field">
                <span>Amount</span>
                <strong>{formatAdminCurrency(order.amount)}</strong>
              </div>
              <div className="admin-record-field">
                <span>Payment</span>
                <strong>{order.paymentMethod}</strong>
              </div>
              <div className="admin-record-field">
                <span>Tracking ID</span>
                <strong>{order.trackingId}</strong>
              </div>
            </div>
            <div className="admin-record-actions">
              {['View Order', 'Update Status', 'Add Tracking ID', 'Cancel Order', 'Print Invoice'].map((action) => (
                <button key={action} type="button" className="admin-inline-button">
                  {action}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )

  const renderProducts = () => (
    <section className="admin-panel admin-panel--product-studio">
      <div className="admin-panel-head admin-panel-head--spread">
        <div>
          <p className="admin-panel-kicker">Products management</p>
          <h2>Control every live storefront product from one focused workspace.</h2>
          <p>
            Description, cover image, gallery, colors, sizes, stock, pricing, aur story copy sab
            yahin se manage karo.
          </p>
        </div>
        <div className="admin-product-studio-toolbar">
          <div className="admin-chip-row">
            <button
              type="button"
              className={`admin-filter-chip ${activeProductCategoryFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveProductCategoryFilter('all')}
            >
              All Products ({inventoryRows.length})
            </button>
            {categoryRows.map((category) => (
              <button
                key={category.name}
                type="button"
                className={`admin-filter-chip ${activeProductCategoryFilter === category.name ? 'is-active' : ''}`}
                onClick={() => setActiveProductCategoryFilter(category.name)}
              >
                {category.name} ({category.products})
              </button>
            ))}
          </div>

          <button type="button" className="admin-ghost-button" onClick={createNewProductDraft}>
            Add new product
          </button>
        </div>
      </div>

      <div className="admin-product-summary-grid">
        {[
          {
            label: 'Visible products',
            value: formatCompactCount(filteredManagedProducts.length),
            note: 'Current category scope me itne products edit-ready hain.',
          },
          {
            label: 'Low stock alerts',
            value: formatCompactCount(filteredLowStockCount),
            note: 'Jaldi replenish karne wale SKUs.',
          },
          {
            label: 'Sold out styles',
            value: formatCompactCount(filteredSoldOutCount),
            note: 'Restock ya campaign cleanup ke liye flagged.',
          },
          {
            label: '4+ gallery shots',
            value: formatCompactCount(filteredRichGalleryCount),
            note: 'Visual merchandising ke liye richer products.',
          },
        ].map((card) => (
          <article key={card.label} className="admin-metric-card admin-metric-card--product">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.note}</p>
          </article>
        ))}
      </div>

      {selectedManagedProduct && productEditor ? (
        <div className="admin-product-workbench">
          <article className="admin-product-editor-card">
            <div className="admin-record-head">
              <div>
                <p className="admin-panel-kicker">Selected product</p>
                <strong>{selectedManagedProduct.name}</strong>
                <p>{selectedManagedProduct.category} storefront editor</p>
              </div>
              <span
                className={`admin-status-pill admin-status-pill--${getStatusTone(
                  getInventoryStatus(selectedManagedProduct),
                )}`}
              >
                {getInventoryStatus(selectedManagedProduct)}
              </span>
            </div>

            <div className="admin-editor-layout">
              <div className="admin-editor-preview">
                <div className="admin-editor-preview-media">
                  {editorCoverImagePreview ? (
                    <img src={editorCoverImagePreview} alt={productEditor.name || 'Product preview'} />
                  ) : (
                    <div className="admin-editor-preview-empty">
                      <strong>No image selected</strong>
                      <p>Cover image ya gallery URL add karte hi preview yahan dikh jayega.</p>
                    </div>
                  )}
                </div>

                <div className="admin-editor-preview-copy">
                  <p className="admin-editor-eyebrow">{productEditor.label || 'Storefront label'}</p>
                  <h3>{productEditor.name || 'Untitled Aryass Product'}</h3>
                  <p className="admin-editor-preview-category">{productEditor.category}</p>

                  <div className="admin-editor-price-row">
                    {productEditor.oldPrice ? <span>Rs. {productEditor.oldPrice}</span> : null}
                    <strong>Rs. {productEditor.price || '0.00'}</strong>
                  </div>

                  {productEditor.saleBadgeText ? (
                    <div className="admin-editor-pill-row">
                      <span className="admin-status-pill admin-status-pill--warning">
                        {productEditor.saleBadgeText}
                      </span>
                    </div>
                  ) : null}

                  <div className="admin-editor-stat-grid">
                    <div>
                      <span>Stock</span>
                      <strong>{productEditor.stockCount || '0'} units</strong>
                    </div>
                    <div>
                      <span>Available sizes</span>
                      <strong>{editorAvailableSizes.join(', ') || 'No size active'}</strong>
                    </div>
                    <div>
                      <span>Colors</span>
                      <strong>{editorColorPreview.join(', ') || 'No colors added'}</strong>
                    </div>
                    <div>
                      <span>Gallery shots</span>
                      <strong>{editorGalleryPreview.length || 0}</strong>
                    </div>
                  </div>

                  {editorGalleryPreview.length ? (
                    <div className="admin-product-gallery-strip" aria-label="Editor gallery preview">
                      {editorGalleryPreview.map((image, index) => (
                        <button
                          key={`${selectedManagedProduct.id}-editor-gallery-${index}`}
                          type="button"
                          className={`admin-gallery-thumb ${
                            editorCoverImagePreview === image ? 'is-active' : ''
                          }`}
                          onClick={() => updateProductEditorField('coverImage', image)}
                        >
                          <img
                            src={image}
                            alt={`${productEditor.name || 'Product'} gallery ${index + 1}`}
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="admin-editor-form">
                <section className="admin-editor-section">
                  <div className="admin-panel-head">
                    <div>
                      <p className="admin-panel-kicker">Core details</p>
                      <h3>Basic storefront information</h3>
                    </div>
                  </div>

                  <div className="admin-product-controls">
                    <label className="admin-form-field">
                      <span>Product name</span>
                      <input
                        type="text"
                        value={productEditor.name}
                        onChange={(event) => updateProductEditorField('name', event.target.value)}
                        placeholder="Blush Bloom Dress"
                      />
                    </label>

                    <label className="admin-form-field">
                      <span>Storefront label</span>
                      <input
                        type="text"
                        value={productEditor.label}
                        onChange={(event) => updateProductEditorField('label', event.target.value)}
                        placeholder="Aryass Edit"
                      />
                    </label>

                    <label className="admin-form-field">
                      <span>Category</span>
                      <select
                        value={productEditor.category}
                        onChange={(event) => updateProductEditorField('category', event.target.value)}
                      >
                        {syncedCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="admin-form-field">
                      <span>SKU</span>
                      <input
                        type="text"
                        value={productEditor.sku}
                        onChange={(event) => updateProductEditorField('sku', event.target.value)}
                        placeholder="ARY-001-DR"
                      />
                    </label>
                  </div>
                </section>

                <section className="admin-editor-section">
                  <div className="admin-panel-head">
                    <div>
                      <p className="admin-panel-kicker">Pricing and stock</p>
                      <h3>Commercial controls</h3>
                    </div>
                  </div>

                  <div className="admin-product-controls">
                    <label className="admin-form-field">
                      <span>Selling price</span>
                      <input
                        type="text"
                        value={productEditor.price}
                        onChange={(event) => updateProductEditorField('price', event.target.value)}
                        placeholder="1650.00"
                      />
                    </label>

                    <label className="admin-form-field">
                      <span>Compare at price</span>
                      <input
                        type="text"
                        value={productEditor.oldPrice}
                        onChange={(event) => updateProductEditorField('oldPrice', event.target.value)}
                        placeholder="1999.00"
                      />
                    </label>

                    <label className="admin-form-field">
                      <span>Discount badge</span>
                      <input
                        type="text"
                        value={productEditor.saleBadgeText}
                        onChange={(event) => updateProductEditorField('saleBadgeText', event.target.value)}
                        placeholder="15% OFF"
                      />
                      <small className="admin-form-hint">
                        Blank chhodo to compare price ke basis par auto discount badge ban jayega.
                      </small>
                    </label>

                    <label className="admin-form-field admin-form-field--wide">
                      <span>Shipping note</span>
                      <input
                        type="text"
                        value={productEditor.shippingNote}
                        onChange={(event) => updateProductEditorField('shippingNote', event.target.value)}
                        placeholder="Free shipping above Rs. 1,999"
                      />
                    </label>

                    <div className="admin-form-field admin-form-field--wide">
                      <span>Stock control</span>
                      <div className="admin-stock-stepper">
                        <button
                          type="button"
                          className="admin-inline-button"
                          onClick={() => updateProductEditorStock(Number(productEditor.stockCount || 0) - 1)}
                          disabled={Number(productEditor.stockCount || 0) <= 0}
                        >
                          -1
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={productEditor.stockCount}
                          onChange={(event) => updateProductEditorStock(event.target.value)}
                          aria-label={`Stock count for ${selectedManagedProduct.name}`}
                        />
                        <button
                          type="button"
                          className="admin-inline-button"
                          onClick={() => updateProductEditorStock(Number(productEditor.stockCount || 0) + 1)}
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="admin-editor-section">
                  <div className="admin-panel-head">
                    <div>
                      <p className="admin-panel-kicker">Options and visuals</p>
                      <h3>Images, colors, and sizes</h3>
                    </div>
                  </div>

                  <div className="admin-product-controls">
                    <label className="admin-form-field admin-form-field--wide">
                      <span>Cover image URL</span>
                      <input
                        type="text"
                        value={productEditor.coverImage}
                        onChange={(event) => updateProductEditorField('coverImage', event.target.value)}
                        placeholder="/catalog/your-main-image.jpeg"
                      />
                    </label>

                    <label className="admin-form-field admin-form-field--wide">
                      <span>Gallery image URLs</span>
                      <textarea
                        rows="5"
                        value={productEditor.gallery}
                        onChange={(event) => updateProductEditorField('gallery', event.target.value)}
                        placeholder={'/catalog/look-1.jpeg\n/catalog/look-2.jpeg\n/catalog/look-3.jpeg'}
                      />
                      <small className="admin-form-hint">
                        Har image URL ko new line par add karo. Preview thumbnail par click karke
                        cover image choose kar sakte ho.
                      </small>
                    </label>

                    <label className="admin-form-field admin-form-field--wide">
                      <span>Colors</span>
                      <input
                        type="text"
                        value={productEditor.colors}
                        onChange={(event) => updateProductEditorField('colors', event.target.value)}
                        placeholder="Baby Pink, Champagne, Pearl White"
                      />
                    </label>

                    <label className="admin-form-field admin-form-field--wide">
                      <span>Sizes</span>
                      <input
                        type="text"
                        value={productEditor.sizes.map((size) => size.label).join(', ')}
                        onChange={(event) => updateProductEditorSizeList(event.target.value)}
                        placeholder="XS, S, M, L"
                      />
                      <small className="admin-form-hint">
                        Size list comma separated rakho. Neeche chips par tap karke size live ya
                        unavailable mark karo.
                      </small>
                      <div className="admin-size-chip-row">
                        {productEditor.sizes.map((size) => (
                          <button
                            key={`${selectedManagedProduct.id}-${size.label}`}
                            type="button"
                            className={`admin-size-toggle ${size.available ? 'is-active' : ''}`}
                            onClick={() => toggleProductEditorSize(size.label)}
                            disabled={Number(productEditor.stockCount || 0) === 0}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </label>
                  </div>
                </section>

                <section className="admin-editor-section">
                  <div className="admin-panel-head">
                    <div>
                      <p className="admin-panel-kicker">Storefront copy</p>
                      <h3>Description and styling content</h3>
                    </div>
                  </div>

                  <div className="admin-product-controls">
                    <label className="admin-form-field admin-form-field--wide">
                      <span>Description paragraphs</span>
                      <textarea
                        rows="6"
                        value={productEditor.description}
                        onChange={(event) => updateProductEditorField('description', event.target.value)}
                        placeholder={'Paragraph 1\n\nParagraph 2'}
                      />
                    </label>

                    <label className="admin-form-field admin-form-field--wide">
                      <span>Style notes</span>
                      <textarea
                        rows="4"
                        value={productEditor.styleNotes}
                        onChange={(event) => updateProductEditorField('styleNotes', event.target.value)}
                        placeholder={'Best styled with metallic heels.\nGreat for festive evenings.\nSizes available: XS, S, M.'}
                      />
                    </label>

                    <label className="admin-form-field">
                      <span>Story title</span>
                      <input
                        type="text"
                        value={productEditor.storyTitle}
                        onChange={(event) => updateProductEditorField('storyTitle', event.target.value)}
                        placeholder="Blush Bloom Dress for polished moments"
                      />
                    </label>

                    <label className="admin-form-field">
                      <span>Story text</span>
                      <textarea
                        rows="4"
                        value={productEditor.storyText}
                        onChange={(event) => updateProductEditorField('storyText', event.target.value)}
                        placeholder="Add the editorial story customers see lower on the product page."
                      />
                    </label>
                  </div>
                </section>
              </div>
            </div>

            {editorDescriptionPreview.length ? (
              <div className="admin-editor-copy-preview">
                <p className="admin-panel-kicker">Copy preview</p>
                {editorDescriptionPreview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <div className="admin-editor-toolbar">
              <div className="admin-record-actions">
                <button type="button" className="admin-ghost-button" onClick={saveProductEditor}>
                  Save product
                </button>
                <button type="button" className="admin-inline-button" onClick={resetProductEditor}>
                  Reset draft
                </button>
                {isCustomProduct(selectedManagedProduct.id) ? (
                  <button
                    type="button"
                    className="admin-inline-button admin-inline-button--danger"
                    onClick={deleteSelectedProduct}
                  >
                    Delete custom product
                  </button>
                ) : null}
                <button
                  type="button"
                  className="admin-inline-button"
                  onClick={() =>
                    updateProductEditorStock(Number(productEditor.stockCount || 0) ? 0 : 8)
                  }
                >
                  {Number(productEditor.stockCount || 0) ? 'Set draft sold out' : 'Set draft stock 8'}
                </button>
                <button
                  type="button"
                  className="admin-inline-button"
                  onClick={() => openCategoryProducts(productEditor.category)}
                >
                  Open {productEditor.category}
                </button>
              </div>

              {productEditorNotice ? <p className="admin-editor-notice">{productEditorNotice}</p> : null}
            </div>
          </article>

          <aside className="admin-product-browser">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Catalog explorer</p>
                <h3>Pick a product to edit</h3>
              </div>
              <p>{filteredManagedProducts.length} products visible in this view.</p>
            </div>

            <div className="admin-product-browser-list">
              {filteredManagedProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className={`admin-browser-card ${
                    selectedManagedProduct.id === product.id ? 'is-active' : ''
                  }`}
                  onClick={() => setSelectedAdminProductId(product.id)}
                >
                  <div className="admin-browser-card-media">
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </div>

                  <div className="admin-browser-card-copy">
                    <div className="admin-browser-card-head">
                      <strong>{product.name}</strong>
                      <p>{product.category}</p>
                    </div>

                    <div className="admin-browser-card-meta">
                      <span>Rs. {product.price}</span>
                      <span>{product.stockCount} in stock</span>
                    </div>

                    <div className="admin-browser-card-footer">
                      <span
                        className={`admin-status-pill admin-status-pill--${getStatusTone(
                          getInventoryStatus(product),
                        )}`}
                      >
                        {getInventoryStatus(product)}
                      </span>
                      <small>{product.sizes.filter((size) => size.available).length} sizes live</small>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      ) : (
        <div className="admin-empty-state">
          <strong>No products in this category</strong>
          <p>Dusri category select karo ya storefront catalog me products ko move karo.</p>
          <button type="button" className="admin-inline-button" onClick={createNewProductDraft}>
            Add new product
          </button>
        </div>
      )}
    </section>
  )

  const renderCategories = () => (
    <section className="admin-panel">
      <div className="admin-panel-head admin-panel-head--spread">
        <div>
          <p className="admin-panel-kicker">Categories</p>
          <h2>Exactly the same categories that customers see in the storefront.</h2>
        </div>
      </div>
      <div className="admin-tile-grid">
        {categoryRows.map((category) => (
          <article key={category.name} className="admin-tile-card admin-tile-card--category">
            <span>{category.name}</span>
            <strong>{category.products} products</strong>
            <p>{category.note}</p>
            <div className="admin-category-stat-row">
              <p>{category.liveCount} live</p>
              <p>{category.soldOutCount} sold out</p>
            </div>
            <button
              type="button"
              className="admin-inline-button"
              onClick={() => openCategoryProducts(category.name)}
            >
              Manage {category.name}
            </button>
          </article>
        ))}
      </div>
    </section>
  )

  const renderCustomers = () => (
    <section className="admin-panel admin-panel--customers">
      <div className="admin-panel-head admin-panel-head--spread admin-panel-head--roomy">
        <div>
          <p className="admin-panel-kicker">Customers and users</p>
          <h2>Review account status and handle user moderation.</h2>
        </div>
        <div className="admin-chip-row">
          {[
            { key: 'all', label: `All Users (${managedCustomers.length})` },
            {
              key: 'blocked',
              label: `Blocked Users (${managedCustomers.filter((customer) => getCustomerFilterKey(customer.status) === 'blocked').length})`,
            },
            {
              key: 'active',
              label: `Active Users (${managedCustomers.filter((customer) => getCustomerFilterKey(customer.status) === 'active').length})`,
            },
          ].map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`admin-filter-chip ${activeCustomerFilter === filter.key ? 'is-active' : ''}`}
              onClick={() => setActiveCustomerFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {selectedCustomer ? (
        <article className="admin-customer-focus">
          <div className="admin-record-head">
            <div>
              <strong>{selectedCustomer.name}</strong>
              <p>{selectedCustomer.email}</p>
            </div>
            <span className={`admin-status-pill admin-status-pill--${getStatusTone(selectedCustomer.status)}`}>
              {selectedCustomer.status}
            </span>
          </div>

          <div className="admin-customer-grid">
            <div className="admin-record-field">
              <span>Phone</span>
              <strong>{selectedCustomer.phone}</strong>
            </div>
            <div className="admin-record-field">
              <span>City</span>
              <strong>{selectedCustomer.city}</strong>
            </div>
            <div className="admin-record-field">
              <span>Member Since</span>
              <strong>{selectedCustomer.memberSince}</strong>
            </div>
            <div className="admin-record-field">
              <span>Account Type</span>
              <strong>{selectedCustomer.type}</strong>
            </div>
            <div className="admin-record-field">
              <span>Total Orders</span>
              <strong>{selectedCustomer.orders}</strong>
            </div>
            <div className="admin-record-field">
              <span>Total Spend</span>
              <strong>{formatAdminCurrency(selectedCustomer.totalSpend)}</strong>
            </div>
          </div>

          <div className="admin-record-actions admin-record-actions--roomy">
            <button type="button" className="admin-inline-button" onClick={() => setSelectedCustomerId(selectedCustomer.id)}>
              View User
            </button>
            <button
              type="button"
              className="admin-inline-button"
              onClick={() =>
                setManagedCustomers((current) =>
                  current.map((customer) =>
                    customer.id === selectedCustomer.id
                      ? {
                          ...customer,
                          status: getCustomerFilterKey(customer.status) === 'blocked' ? 'Active' : 'Blocked',
                        }
                      : customer,
                  ),
                )
              }
            >
              {getCustomerFilterKey(selectedCustomer.status) === 'blocked' ? 'Unblock User' : 'Block User'}
            </button>
            <button
              type="button"
              className="admin-inline-button"
              onClick={() => {
                setManagedCustomers((current) =>
                  current.filter((customer) => customer.id !== selectedCustomer.id),
                )
                setSelectedCustomerId('')
              }}
            >
              Delete User
            </button>
          </div>
        </article>
      ) : null}

      <div className="admin-record-list admin-record-list--split admin-record-list--roomy">
        {customerRows.length ? (
          customerRows.map((customer) => (
            <article
              key={customer.id}
              className={`admin-record-card ${selectedCustomer?.id === customer.id ? 'is-selected' : ''}`}
            >
              <div className="admin-record-head">
                <div>
                  <strong>{customer.name}</strong>
                  <p>{customer.email}</p>
                </div>
                <span className={`admin-status-pill admin-status-pill--${getStatusTone(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
              <div className="admin-record-actions">
                <button
                  type="button"
                  className="admin-inline-button"
                  onClick={() => setSelectedCustomerId(customer.id)}
                >
                  View User
                </button>
                <button
                  type="button"
                  className="admin-inline-button"
                  onClick={() =>
                    setManagedCustomers((current) =>
                      current.map((item) =>
                        item.id === customer.id
                          ? {
                              ...item,
                              status: getCustomerFilterKey(item.status) === 'blocked' ? 'Active' : 'Blocked',
                            }
                          : item,
                      ),
                    )
                  }
                >
                  {getCustomerFilterKey(customer.status) === 'blocked' ? 'Unblock User' : 'Block User'}
                </button>
                <button
                  type="button"
                  className="admin-inline-button"
                  onClick={() => {
                    setManagedCustomers((current) => current.filter((item) => item.id !== customer.id))
                    if (selectedCustomerId === customer.id) {
                      setSelectedCustomerId('')
                    }
                  }}
                >
                  Delete User
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="admin-empty-state">
            <strong>No users found</strong>
            <p>Selected filter me abhi koi user available nahi hai.</p>
          </div>
        )}
      </div>
    </section>
  )

  const renderPayments = () => (
    <section className="admin-panel">
      <div className="admin-panel-head admin-panel-head--spread">
        <div>
          <p className="admin-panel-kicker">Payments</p>
          <h2>Keep transaction visibility and reconciliation in one place.</h2>
        </div>
        <div className="admin-chip-row">
          {paymentFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`admin-filter-chip ${activePaymentFilter === filter.key ? 'is-active' : ''}`}
              onClick={() => setActivePaymentFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="admin-record-list admin-record-list--split">
        {filteredPayments.map((payment) => (
          <article key={payment.id} className="admin-record-card">
            <div className="admin-record-head">
              <div>
                <strong>{payment.transactionId}</strong>
                <p>{payment.customer}</p>
              </div>
              <span className={`admin-status-pill admin-status-pill--${getStatusTone(payment.status)}`}>
                {payment.status}
              </span>
            </div>
            <div className="admin-record-grid">
              <div className="admin-record-field">
                <span>Payment method</span>
                <strong>{payment.method}</strong>
              </div>
              <div className="admin-record-field">
                <span>Amount</span>
                <strong>{formatAdminCurrency(payment.amount)}</strong>
              </div>
              <div className="admin-record-field">
                <span>Status</span>
                <strong>{payment.status}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )

  const renderCoupons = () => (
    <section className="admin-panel">
      <div className="admin-panel-head admin-panel-head--spread">
        <div>
          <p className="admin-panel-kicker">Coupons and offers</p>
          <h2>Create campaign codes and monitor usage limits.</h2>
        </div>
        <button type="button" className="admin-ghost-button">
          Create Coupon
        </button>
      </div>
      <div className="admin-tile-grid">
        {couponRows.map((coupon) => (
          <article key={coupon.code} className="admin-tile-card">
            <span>{coupon.code}</span>
            <strong>{coupon.discount}</strong>
            <p>Expiry: {coupon.expiry}</p>
            <p>Usage limit: {coupon.usageLimit}</p>
            <p>Used: {coupon.used}</p>
          </article>
        ))}
      </div>
    </section>
  )

  const renderReviews = () => (
    <section className="admin-panel">
      <div className="admin-panel-head admin-panel-head--spread">
        <div>
          <p className="admin-panel-kicker">Reviews and ratings</p>
          <h2>Moderate product feedback before it appears live.</h2>
        </div>
      </div>
      <div className="admin-record-list admin-record-list--split">
        {reviewRows.map((review) => (
          <article key={review.id} className="admin-record-card">
            <div className="admin-record-head">
              <div>
                <strong>{review.product}</strong>
                <p>{review.customer}</p>
              </div>
              <span className={`admin-status-pill admin-status-pill--${getStatusTone(review.status)}`}>
                {review.status}
              </span>
            </div>
            <div className="admin-record-grid">
              <div className="admin-record-field">
                <span>Rating</span>
                <strong>{review.rating}/5</strong>
              </div>
              <div className="admin-record-field admin-record-field--wide">
                <span>Review</span>
                <strong>{review.text}</strong>
              </div>
            </div>
            <div className="admin-record-actions">
              {['Approve Review', 'Delete Review'].map((action) => (
                <button key={action} type="button" className="admin-inline-button">
                  {action}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )

  const renderNotifications = () => (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="admin-panel-kicker">Notifications</p>
          <h2>Push offer alerts, order updates, and broadcast messages.</h2>
        </div>
      </div>
      <div className="admin-tile-grid">
        {notificationRows.map((row) => (
          <article key={row.title} className="admin-tile-card">
            <span>{row.title}</span>
            <strong>{row.audience}</strong>
            <p>{row.note}</p>
            <button type="button" className="admin-inline-button">
              Send Notification
            </button>
          </article>
        ))}
      </div>
    </section>
  )

  const renderReports = () => (
    <div className="admin-section-stack">
      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <p className="admin-panel-kicker">Reports and analytics</p>
            <h2>Monitor sales, monthly orders, and top performers.</h2>
          </div>
        </div>
        <div className="admin-report-grid">
          {reportRows.map((row) => (
            <div key={row.month} className="admin-report-bar-card">
              <span>{row.month}</span>
              <div className="admin-report-bar-track">
                <div
                  className="admin-report-bar-fill"
                  style={{ height: `${Math.round((row.revenue / 52000) * 100)}%` }}
                />
              </div>
              <strong>{formatAdminCurrency(row.revenue)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-overview-grid">
        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Top selling products</p>
              <h2>Best performing items</h2>
            </div>
          </div>
          <div className="admin-record-list">
            {topSellingRows.map((product) => (
              <article key={product.id} className="admin-record-card">
                <div className="admin-record-head">
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.category}</p>
                  </div>
                  <span className="admin-status-pill admin-status-pill--success">Top seller</span>
                </div>
                <div className="admin-record-grid">
                  <div className="admin-record-field">
                    <span>Price</span>
                    <strong>Rs. {product.price}</strong>
                  </div>
                  <div className="admin-record-field">
                    <span>Stock</span>
                    <strong>{product.stock}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="admin-panel-kicker">Summary</p>
              <h2>Monthly admin snapshot</h2>
            </div>
          </div>
          <div className="admin-summary-list">
            <div>
              <span>Sales report</span>
              <strong>{formatAdminCurrency(Math.max(totalRevenueValue, 52000))}</strong>
            </div>
            <div>
              <span>Revenue graph</span>
              <strong>5 month trend visible</strong>
            </div>
            <div>
              <span>Top selling products</span>
              <strong>{topSellingRows.length} highlighted items</strong>
            </div>
            <div>
              <span>Monthly orders</span>
              <strong>{formatCompactCount(Math.max(orderRows.length, 245))}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  )

  const renderSettings = () => (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="admin-panel-kicker">Settings</p>
          <h2>Fine tune storefront visuals, checkout, and social presence.</h2>
        </div>
      </div>
      <div className="admin-tile-grid">
        {settingsRows.map((setting) => (
          <article key={setting.title} className="admin-tile-card">
            <span>{setting.title}</span>
            <p>{setting.note}</p>
            <button type="button" className="admin-inline-button">
              Update Setting
            </button>
          </article>
        ))}
      </div>
    </section>
  )

  const activeContent = {
    dashboard: renderDashboard(),
    orders: renderOrders(),
    products: renderProducts(),
    categories: renderCategories(),
    customers: renderCustomers(),
    payments: renderPayments(),
    coupons: renderCoupons(),
    reviews: renderReviews(),
    notifications: renderNotifications(),
    reports: renderReports(),
    settings: renderSettings(),
  }[activeMenu]

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-top">
            <button type="button" className="admin-back-button" onClick={onBack}>
              <Icon name="left" />
              Back to Store
            </button>

            <div className="admin-sidebar-brand">
              <p>Admin Workspace</p>
              <h1>ARYASS</h1>
              <span>{adminName}</span>
            </div>
          </div>

          <div className="admin-sidebar-panel">
            <span className="admin-sidebar-label">Navigation</span>

            <nav className="admin-menu" aria-label="Admin sections">
              {adminMenuItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={activeMenu === item.key ? 'is-active' : ''}
                  onClick={() => setActiveMenu(item.key)}
                >
                  <span>{item.label}</span>
                  <small>{item.note}</small>
                </button>
              ))}

              <div className="admin-sidebar-footer">
                <span>Admin session active</span>
                <button type="button" className="admin-logout-button" onClick={onLogout}>
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

        <section className="admin-content">
          <div className="admin-content-inner">
            <header className="admin-hero-card">
              <div className="admin-hero-copy">
                <div className="admin-hero-heading">
                  <p className="admin-kicker">Admin Control Room</p>
                  <h2>{activeSectionLabel}</h2>
                  <p className="admin-hero-description">
                    Professional operations view for orders, products, customers, payments, and reports.
                  </p>
                </div>

                <div className="admin-hero-chip-row" aria-label="Admin overview highlights">
                  {heroHighlights.map((item) => (
                    <span key={item} className="admin-hero-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="admin-hero-meta">
                <span>Logged in as</span>
                <strong>{adminName}</strong>
                <p>
                  {activeSectionLabel} workspace active with a responsive admin-ready layout.
                </p>
              </div>
            </header>

            {activeContent}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminPage
