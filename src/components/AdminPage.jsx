import { useState } from 'react'
import Icon from './Icon'

const adminMenuItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'orders', label: 'Orders' },
  { key: 'products', label: 'Products' },
  { key: 'categories', label: 'Categories' },
  { key: 'customers', label: 'Customers' },
  { key: 'payments', label: 'Payments' },
  { key: 'coupons', label: 'Coupons' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Settings' },
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

const sampleCategories = [
  { name: 'Men', products: 86, note: 'Seasonal drops and shirt edits.' },
  { name: 'Women', products: 142, note: 'Main fashion catalog and occasionwear.' },
  { name: 'Shoes', products: 38, note: 'Footwear and statement heels.' },
  { name: 'Electronics', products: 12, note: 'Lifestyle add-ons and gifting range.' },
  { name: 'Fashion', products: 94, note: 'Accessories, essentials, and trend-led picks.' },
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

function AdminPage({
  onBack,
  onLogout,
  orders,
  products,
  reviews,
  coupons,
  accountProfile,
}) {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [activeOrderFilter, setActiveOrderFilter] = useState('all')
  const [activePaymentFilter, setActivePaymentFilter] = useState('all')
  const [activeCustomerFilter, setActiveCustomerFilter] = useState('all')
  const [managedCustomers, setManagedCustomers] = useState(() => buildInitialCustomers(accountProfile))
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    () => buildInitialCustomers(accountProfile)[0]?.id || '',
  )

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

  const inventoryRows = products.slice(0, 8).map((product) => {
    const oldPriceValue = parsePriceValue(product.oldPrice)
    const priceValue = parsePriceValue(product.price)
    const discount =
      oldPriceValue > priceValue
        ? `${Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100)}%`
        : '0%'

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      discount,
      stock: product.stockCount,
      colors: product.colors.slice(0, 3).join(', '),
      sizes: product.sizes.slice(0, 4).map((size) => size.label).join(', '),
      status: product.soldOut ? 'Out of Stock' : product.stockCount < 6 ? 'Low Stock' : 'In Stock',
    }
  })

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

      <div className="admin-record-list">
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
    <section className="admin-panel">
      <div className="admin-panel-head admin-panel-head--spread">
        <div>
          <p className="admin-panel-kicker">Products management</p>
          <h2>Control catalog data, stock, pricing, and media.</h2>
        </div>
        <div className="admin-action-grid admin-action-grid--compact">
          {['Add Product', 'Edit Product', 'Delete Product', 'Manage Stock'].map((action) => (
            <button key={action} type="button" className="admin-ghost-button">
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-record-list">
        {inventoryRows.map((product) => (
          <article key={product.id} className="admin-record-card">
            <div className="admin-record-head">
              <div>
                <strong>{product.name}</strong>
                <p>{product.category}</p>
              </div>
              <span className={`admin-status-pill admin-status-pill--${getStatusTone(product.status)}`}>
                {product.status}
              </span>
            </div>
            <div className="admin-record-grid">
              <div className="admin-record-field">
                <span>Price</span>
                <strong>Rs. {product.price}</strong>
              </div>
              <div className="admin-record-field">
                <span>Discount</span>
                <strong>{product.discount}</strong>
              </div>
              <div className="admin-record-field">
                <span>Stock</span>
                <strong>{product.stock}</strong>
              </div>
              <div className="admin-record-field">
                <span>Sizes</span>
                <strong>{product.sizes}</strong>
              </div>
              <div className="admin-record-field">
                <span>Colors</span>
                <strong>{product.colors}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )

  const renderCategories = () => (
    <section className="admin-panel">
      <div className="admin-panel-head admin-panel-head--spread">
        <div>
          <p className="admin-panel-kicker">Categories</p>
          <h2>Add, edit, or retire top-level catalog buckets.</h2>
        </div>
        <div className="admin-action-grid admin-action-grid--compact">
          {['Add Category', 'Edit Category', 'Delete Category'].map((action) => (
            <button key={action} type="button" className="admin-ghost-button">
              {action}
            </button>
          ))}
        </div>
      </div>
      <div className="admin-tile-grid">
        {sampleCategories.map((category) => (
          <article key={category.name} className="admin-tile-card">
            <span>{category.name}</span>
            <strong>{category.products} products</strong>
            <p>{category.note}</p>
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

      <div className="admin-record-list admin-record-list--roomy">
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
      <div className="admin-record-list">
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
      <div className="admin-record-list">
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
          <button type="button" className="admin-back-button" onClick={onBack}>
            <Icon name="left" />
            Back to Store
          </button>

          <div className="admin-sidebar-brand">
            <p>Main Admin Menu</p>
            <h1>ARYASS</h1>
            <span>{adminName}</span>
          </div>

          <nav className="admin-menu" aria-label="Admin sections">
            {adminMenuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={activeMenu === item.key ? 'is-active' : ''}
                onClick={() => setActiveMenu(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <span>Admin session active</span>
            <button type="button" className="admin-logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </aside>

        <section className="admin-content">
          <header className="admin-hero-card">
            <div>
              <p className="admin-kicker">Admin Control Room</p>
              <h2>{activeSectionLabel}</h2>
              <p>
                Manage orders, products, customers, payments, reviews, reports, and store settings
                from one polished responsive panel.
              </p>
            </div>
            <div className="admin-hero-meta">
              <span>Logged in as</span>
              <strong>{adminName}</strong>
            </div>
          </header>

          {activeContent}
        </section>
      </div>
    </main>
  )
}

export default AdminPage
