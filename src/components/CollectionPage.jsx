import ProductCard from './ProductCard'
import Icon from './Icon'

function CollectionPage({
  activeCategory,
  collectionTitle,
  collectionContent,
  offerSlides,
  activeOffer,
  onSelectOffer,
  filters,
  selectedFilterSizes,
  minPriceInput,
  maxPriceInput,
  productCount,
  products,
  onOpenSizeFilter,
  onOpenPriceFilter,
  onChooseOption,
  onOpenLoginModal,
  onClearFilters,
  loginCtaLabel,
  emptyStateLabel,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const hasActiveFilters = selectedFilterSizes.length > 0 || minPriceInput || maxPriceInput
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
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
              onClick={() => onSelectOffer(index)}
            />
          ))}
        </div>
      </section>

      <section className="collection-hero">
        <p className="collection-label">{collectionContent.eyebrow}</p>
        <h1>{collectionTitle}</h1>
        <p className="collection-text">{collectionContent.description}</p>
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
              onClick={filter === 'Size' ? onOpenSizeFilter : onOpenPriceFilter}
            >
              {filter === 'Size' && selectedFilterSizes.length
                ? `Size (${selectedFilterSizes.length})`
                : filter}
              <Icon name="chevron" />
            </button>
          ))}
        </div>

        <div className="sort-group">
          <strong>{productCount} products</strong>
        </div>
      </section>

      {products.length ? (
        <section className="product-grid" aria-label={`${activeCategory} products`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onChooseOption={onChooseOption} />
          ))}
        </section>
      ) : (
        <section className="collection-empty-state" aria-live="polite">
          <p className="collection-label">No match found</p>
          <h2>No {emptyStateLabel} match the current filters.</h2>
          <p>Filters clear karke full collection dobara dekho.</p>
          {hasActiveFilters ? (
            <button type="button" className="secondary-action-button" onClick={onClearFilters}>
              Clear filters
            </button>
          ) : null}
        </section>
      )}

      {totalPages > 1 ? (
        <div className="pagination" aria-label="Collection pagination">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={pageNumber === currentPage ? 'is-active' : ''}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          >
            <Icon name="chevron" />
          </button>
        </div>
      ) : null}

      <section className="login-callout" id="login">
        <div>
          <p className="callout-kicker">Login and OTP Added</p>
          <h2>Tap login, enter your number, and continue through the OTP card flow.</h2>
        </div>
        <button type="button" onClick={onOpenLoginModal}>
          {loginCtaLabel}
        </button>
      </section>
    </main>
  )
}

export default CollectionPage
