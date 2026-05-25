import Icon from './Icon'
import { formatPrice } from '../data/catalog'

const paymentOptions = [
  {
    id: 'upi',
    title: 'UPI Payment',
    note: 'Instant confirmation and the fastest checkout flow.',
    badge: 'Recommended',
  },
  {
    id: 'card',
    title: 'Credit / Debit Card',
    note: 'Visa, Mastercard and RuPay cards are supported.',
    badge: 'Secure',
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    note: 'Pay at delivery after address confirmation.',
    badge: 'Popular',
  },
]

function formatDeliveryPhone(phone = '') {
  if (!phone) {
    return 'Not shared yet'
  }

  return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
}

function CheckoutModal({
  isOpen,
  step,
  items,
  total,
  deliveryForm,
  deliveryDetails,
  selectedPaymentMethod,
  orderId,
  checkoutError,
  hasSavedDeliveryDetails,
  onClose,
  onDeliveryFieldChange,
  onSubmitDelivery,
  onEditDelivery,
  onSelectPaymentMethod,
  onPlaceOrder,
  onContinueShopping,
}) {
  if (!isOpen) {
    return null
  }

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const totalLabel = formatPrice(total.toLocaleString('en-IN'))
  const deliverySummary = deliveryDetails
    ? [
        deliveryDetails.fullName,
        deliveryDetails.addressLine,
        deliveryDetails.landmark,
        `${deliveryDetails.city}, ${deliveryDetails.state} ${deliveryDetails.pincode}`,
        formatDeliveryPhone(deliveryDetails.phone),
        deliveryDetails.email,
      ].filter(Boolean)
    : []

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div
        className={`checkout-modal ${step === 'success' ? 'checkout-modal--success' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Checkout flow"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="checkout-header">
          <div>
            <p className="checkout-kicker">
              {step === 'delivery'
                ? 'Step 1 of 2'
                : step === 'payment'
                  ? 'Step 2 of 2'
                  : 'Order confirmed'}
            </p>
            <h2>
              {step === 'delivery'
                ? 'Delivery details'
                : step === 'payment'
                  ? 'Review and pay'
                  : 'Your order is locked in'}
            </h2>
          </div>

          <button type="button" className="checkout-close" aria-label="Close checkout" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        {step === 'success' ? (
          <div className="checkout-success">
            <span className="checkout-success-badge">
              <Icon name="check" />
            </span>
            <h3>Order {orderId} is confirmed</h3>
            <p>
              Payment mode selected successfully. Our team will use the saved delivery details to
              process this shipment.
            </p>

            {deliverySummary.length ? (
              <div className="checkout-address-card">
                <div className="checkout-address-head">
                  <strong>Delivering to</strong>
                </div>
                <div className="checkout-address-copy">
                  {deliverySummary.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ) : null}

            <button type="button" className="checkout-primary-button" onClick={onContinueShopping}>
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="checkout-grid">
            <section className="checkout-panel">
              <div className="checkout-stage-row">
                <span className={`checkout-stage ${step === 'delivery' ? 'is-active' : ''}`}>
                  1. Delivery
                </span>
                <span className={`checkout-stage ${step === 'payment' ? 'is-active' : ''}`}>
                  2. Payment
                </span>
              </div>

              {step === 'delivery' ? (
                <form className="checkout-form" onSubmit={onSubmitDelivery}>
                  <p className="checkout-note">
                    {hasSavedDeliveryDetails
                      ? 'Update the saved delivery profile if you want a different address for this order.'
                      : 'First order par delivery details zaroori hain. Inke bina payment step open nahi hoga.'}
                  </p>

                  <div className="checkout-form-grid">
                    <label className="checkout-field">
                      <span>Full Name</span>
                      <input
                        type="text"
                        value={deliveryForm.fullName}
                        onChange={(event) => onDeliveryFieldChange('fullName', event.target.value)}
                        placeholder="Receiver name"
                      />
                    </label>

                    <label className="checkout-field">
                      <span>Email Address</span>
                      <input
                        type="email"
                        value={deliveryForm.email}
                        onChange={(event) => onDeliveryFieldChange('email', event.target.value)}
                        placeholder="you@example.com"
                      />
                    </label>

                    <label className="checkout-field">
                      <span>Mobile Number</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={deliveryForm.phone}
                        onChange={(event) => onDeliveryFieldChange('phone', event.target.value)}
                        placeholder="10 digit number"
                      />
                    </label>

                    <label className="checkout-field">
                      <span>Pincode</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={deliveryForm.pincode}
                        onChange={(event) => onDeliveryFieldChange('pincode', event.target.value)}
                        placeholder="360020"
                      />
                    </label>

                    <label className="checkout-field checkout-field--full">
                      <span>Address</span>
                      <input
                        type="text"
                        value={deliveryForm.addressLine}
                        onChange={(event) => onDeliveryFieldChange('addressLine', event.target.value)}
                        placeholder="House no, street, area"
                      />
                    </label>

                    <label className="checkout-field checkout-field--full">
                      <span>Landmark</span>
                      <input
                        type="text"
                        value={deliveryForm.landmark}
                        onChange={(event) => onDeliveryFieldChange('landmark', event.target.value)}
                        placeholder="Near school, mall or main road"
                      />
                    </label>

                    <label className="checkout-field">
                      <span>City</span>
                      <input
                        type="text"
                        value={deliveryForm.city}
                        onChange={(event) => onDeliveryFieldChange('city', event.target.value)}
                        placeholder="Rajkot"
                      />
                    </label>

                    <label className="checkout-field">
                      <span>State</span>
                      <input
                        type="text"
                        value={deliveryForm.state}
                        onChange={(event) => onDeliveryFieldChange('state', event.target.value)}
                        placeholder="Gujarat"
                      />
                    </label>
                  </div>

                  {checkoutError ? <p className="checkout-error">{checkoutError}</p> : null}

                  <div className="checkout-action-row">
                    <button type="button" className="checkout-secondary-button" onClick={onClose}>
                      Cancel
                    </button>
                    <button type="submit" className="checkout-primary-button">
                      Save and continue
                    </button>
                  </div>
                </form>
              ) : (
                <div className="checkout-payment-panel">
                  <div className="checkout-address-card">
                    <div className="checkout-address-head">
                      <strong>Delivery details</strong>
                      <button type="button" onClick={onEditDelivery}>
                        Change
                      </button>
                    </div>
                    <div className="checkout-address-copy">
                      {deliverySummary.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>

                  <div className="checkout-payment-list">
                    {paymentOptions.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        className={`checkout-payment-option ${
                          selectedPaymentMethod === method.id ? 'is-active' : ''
                        }`}
                        onClick={() => onSelectPaymentMethod(method.id)}
                      >
                        <span className="checkout-payment-radio" aria-hidden="true" />
                        <span className="checkout-payment-copy">
                          <strong>{method.title}</strong>
                          <small>{method.note}</small>
                        </span>
                        <span className="checkout-payment-badge">{method.badge}</span>
                      </button>
                    ))}
                  </div>

                  {checkoutError ? <p className="checkout-error">{checkoutError}</p> : null}

                  <div className="checkout-action-row">
                    <button type="button" className="checkout-secondary-button" onClick={onEditDelivery}>
                      Back
                    </button>
                    <button type="button" className="checkout-primary-button" onClick={onPlaceOrder}>
                      Proceed to payment
                    </button>
                  </div>
                </div>
              )}
            </section>

            <aside className="checkout-summary-card">
              <p className="checkout-kicker">Order summary</p>
              <h3>
                {itemCount} item{itemCount > 1 ? 's' : ''}
              </h3>

              <div className="checkout-summary-list">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="checkout-summary-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <p>
                        {item.color} / {item.size} / Qty {item.qty}
                      </p>
                    </div>
                    <span>{formatPrice((item.price * item.qty).toLocaleString('en-IN'))}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-total-card">
                <div>
                  <span>Subtotal</span>
                  <strong>{totalLabel}</strong>
                </div>
                <div>
                  <span>Shipping</span>
                  <strong>Free</strong>
                </div>
                <div className="checkout-total-card__grand">
                  <span>Total payable</span>
                  <strong>{totalLabel}</strong>
                </div>
              </div>

              <p className="checkout-summary-note">
                Secure checkout opens only after delivery details are complete for first-time orders.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutModal
