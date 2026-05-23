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
          {product.soldOut ? <span className="product-badge">Sold out</span> : null}
          {product.asSeenOn ? <span className="product-stamp">as seen on</span> : null}
          <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
        </div>
      </button>

      <div className="product-copy">
        <h3>{product.name}</h3>

        {product.rating ? (
          <p className="rating-row">
            {'★'.repeat(product.rating)} <span>({product.reviews})</span>
          </p>
        ) : (
          <div className="rating-row rating-row--spacer" aria-hidden="true" />
        )}

        <p className="price-row">
          {product.oldPrice ? <span className="old-price">Rs. {product.oldPrice}</span> : null}
          <span>Rs. {product.price}</span>
        </p>
      </div>

      <button type="button" className="option-button" onClick={() => onChooseOption(product)}>
        Choose options
      </button>
    </article>
  )
}

export default ProductCard

