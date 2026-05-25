import { formatPrice } from '../data/catalog'

function ProductCard({ product, onChooseOption }) {
  return (
    <article className="product-card">
      <button
        type="button"
        className="product-art-button"
        aria-label={`Open ${product.name}`}
        onClick={() => onChooseOption(product)}
      >
        <div className="product-art">
          {product.badges?.length ? (
            <div className="product-badge-stack">
              {product.badges.map((badge, index) => (
                <span
                  key={`${product.id}-badge-${badge.text}-${index}`}
                  className={`product-badge product-badge--${badge.tone || 'neutral'}`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          ) : null}
          <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
        </div>
      </button>

      <div className="product-copy">
        <h3>{product.name}</h3>

        {product.rating ? (
          <p className="rating-row">
            {'\u2605'.repeat(product.rating)} <span>({product.reviews})</span>
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

export default ProductCard
