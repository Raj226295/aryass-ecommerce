import { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard'
import Icon from './Icon'
import { formatPriceValue } from '../data/catalog'

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
  sizeOptions,
  highestPrice,
  productCount,
  products,
  onToggleSize,
  onMinPriceChange,
  onMaxPriceChange,
  onClearSizeFilters,
  onClearPriceFilters,
  onChooseOption,
  onOpenLoginModal,
  onClearFilters,
  loginCtaLabel,
  emptyStateLabel,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const [openFilter, setOpenFilter] = useState(null)
  const hasActiveFilters = selectedFilterSizes.length > 0 || minPriceInput || maxPriceInput
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const filterGroupRef = useRef(null)
  const popupFilters = new Set(['Rs', 'Size'])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!filterGroupRef.current?.contains(event.target)) {
        setOpenFilter(null)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenFilter(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    setOpenFilter(null)
  }, [collectionTitle])

  const toggleFilterPopover = (filter) => {
    setOpenFilter((currentFilter) => (currentFilter === filter ? null : filter))
  }

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
        <div className="filter-group" ref={filterGroupRef}>
          <span>Filter:</span>
          {filters.map((filter) => {
            const supportsPopup = popupFilters.has(filter)
            const isActive =
              (filter === 'Size' && selectedFilterSizes.length) ||
              (filter === 'Rs' && (minPriceInput || maxPriceInput))

            return (
              <div
                key={filter}
                className={`filter-chip-wrap ${openFilter === filter ? 'is-open' : ''}`}
              >
              <button
                type="button"
                className={`toolbar-chip ${isActive ? 'is-active' : ''}`}
                aria-expanded={supportsPopup ? openFilter === filter : undefined}
                onClick={() => {
                  if (!supportsPopup) {
                    return
                  }

                  toggleFilterPopover(filter)
                }}
              >
                {filter === 'Size' && selectedFilterSizes.length
                  ? `Size (${selectedFilterSizes.length})`
                  : filter}
                <Icon name="chevron" />
              </button>

              {popupFilters.has(filter) && openFilter === filter ? (
                filter === 'Size' ? (
                  <div
                    className="filter-popover filter-popover--size"
                    role="dialog"
                    aria-label="Size filter"
                  >
                    <div className="filter-popover__head">
                      <strong>{selectedFilterSizes.length} selected</strong>
                      <button
                        type="button"
                        className="filter-popover__reset"
                        onClick={onClearSizeFilters}
                        disabled={!selectedFilterSizes.length}
                      >
                        Reset
                      </button>
                    </div>

                    <div className="filter-popover__list">
                      {sizeOptions.map((option) => {
                        const isChecked = selectedFilterSizes.includes(option.label)

                        return (
                          <label key={option.label} className="filter-popover__option">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => onToggleSize(option.label)}
                            />
                            <span>
                              {option.label} ({option.count})
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="filter-popover filter-popover--price" role="dialog" aria-label="Price filter">
                    <div className="filter-popover__head">
                      <strong>The highest price is {formatPriceValue(highestPrice)}</strong>
                      <button
                        type="button"
                        className="filter-popover__reset"
                        onClick={onClearPriceFilters}
                        disabled={!minPriceInput && !maxPriceInput}
                      >
                        Reset
                      </button>
                    </div>

                    <div className="filter-popover__price-grid">
                      <label className="filter-popover__currency-field">
                        <span>&#8377;</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="From"
                          value={minPriceInput}
                          onChange={(event) => onMinPriceChange(event.target.value)}
                          aria-label="Minimum price"
                        />
                      </label>

                      <label className="filter-popover__currency-field">
                        <span>&#8377;</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="To"
                          value={maxPriceInput}
                          onChange={(event) => onMaxPriceChange(event.target.value)}
                          aria-label="Maximum price"
                        />
                      </label>
                    </div>
                  </div>
                )
              ) : null}
              </div>
            )
          })}
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
