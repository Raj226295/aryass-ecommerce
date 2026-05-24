import Icon from './Icon'
import { formatPriceValue } from '../data/catalog'

function SizeFilterPage({
  sizeOptions,
  selectedSizes,
  filteredCount,
  onToggleSize,
  onReset,
  onBack,
}) {
  return (
    <main className="filter-page" id="collection">
      <section className="filter-page-shell" aria-label="Size filter">
        <div className="filter-page-top">
          <button type="button" className="back-button" onClick={onBack}>
            <Icon name="left" />
            Back to collection
          </button>

          <button
            type="button"
            className="filter-reset-button"
            onClick={onReset}
            disabled={!selectedSizes.length}
          >
            Reset
          </button>
        </div>

        <div className="filter-page-header">
          <p className="collection-label">Filter by</p>
          <h1>Size</h1>
          <p className="collection-text">
            Tap sizes to refine the collection, then open the filtered product grid.
          </p>
        </div>

        <div className="filter-selection-row">
          <strong>{selectedSizes.length} selected</strong>
          <span>{filteredCount} products</span>
        </div>

        <div className="size-filter-list">
          {sizeOptions.map((option) => {
            const isChecked = selectedSizes.includes(option.label)

            return (
              <label key={option.label} className="size-filter-item">
                <input
                  className="size-filter-checkbox"
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleSize(option.label)}
                />
                <span className="size-filter-label">
                  {option.label} ({option.count})
                </span>
              </label>
            )
          })}
        </div>

        <div className="filter-page-actions">
          <button
            type="button"
            className="secondary-action-button"
            onClick={onReset}
            disabled={!selectedSizes.length}
          >
            Clear sizes
          </button>
          <button type="button" className="primary-action-button" onClick={onBack}>
            Show {filteredCount} products
          </button>
        </div>
      </section>
    </main>
  )
}

function PriceFilterPage({
  highestPrice,
  minPriceInput,
  maxPriceInput,
  filteredCount,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
  onBack,
}) {
  return (
    <main className="filter-page price-filter-page" id="collection">
      <button type="button" className="back-button" onClick={onBack}>
        <Icon name="left" />
        Back to collection
      </button>

      <section className="price-filter-panel" aria-label="Price filter">
        <div className="price-filter-summary">
          <p>The highest price is {formatPriceValue(highestPrice)}</p>
          <button
            type="button"
            className="filter-reset-button"
            onClick={onReset}
            disabled={!minPriceInput && !maxPriceInput}
          >
            Reset
          </button>
        </div>

        <div className="price-filter-input-row">
          <label className="price-filter-input-group">
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

          <label className="price-filter-input-group">
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
      </section>

      <div className="filter-page-actions filter-page-actions--single">
        <button type="button" className="primary-action-button" onClick={onBack}>
          Show {filteredCount} products
        </button>
      </div>
    </main>
  )
}

export { PriceFilterPage, SizeFilterPage }
