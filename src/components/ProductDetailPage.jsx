import ProductCard from './ProductCard'
import Icon from './Icon'
import { formatPrice } from '../data/catalog'

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
  onAddToCart,
  onOpenReview,
  reviewCount,
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
            <button
              type="button"
              className="primary-action-button"
              disabled={product.soldOut}
              onClick={onAddToCart}
            >
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
          <p className="review-empty">
            {reviewCount
              ? `${reviewCount} customer review${reviewCount > 1 ? 's are' : ' is'} captured for this style.`
              : 'There are no reviews yet. Be the first to review this style.'}
          </p>
          <button type="button" className="review-button" onClick={onOpenReview}>
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

export default ProductDetailPage
