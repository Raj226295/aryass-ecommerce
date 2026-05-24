import Icon from './Icon'
import './FooterPage.css'

function FooterPage({ page, onBack, onContinueShopping }) {
  if (!page) {
    return null
  }

  return (
    <main className={`footer-info-page footer-info-page--${page.theme}`}>
      <div className="footer-info-page__shell">
        <div className="footer-info-page__top">
          <button type="button" className="back-button" onClick={onBack}>
            <Icon name="left" />
            Back
          </button>
        </div>

        <section className="footer-info-page__hero">
          <p className="footer-info-page__kicker">{page.kicker}</p>
          <h1>{page.title}</h1>
          <p className="footer-info-page__intro">{page.intro}</p>
        </section>

        {page.metrics?.length ? (
          <section className="footer-info-page__metric-grid" aria-label={`${page.title} highlights`}>
            {page.metrics.map((metric) => (
              <article key={metric.label} className="footer-info-page__metric-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>{metric.text}</p>
              </article>
            ))}
          </section>
        ) : null}

        {page.sections.map((section) => (
          <section key={section.title} className="footer-info-section">
            {section.eyebrow ? <p className="footer-info-section__eyebrow">{section.eyebrow}</p> : null}
            <h2>{section.title}</h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="footer-info-section__copy">
                {paragraph}
              </p>
            ))}

            {section.bullets?.length ? (
              <ul className="footer-info-section__list">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}

            {section.cards?.length ? (
              <div className="footer-info-section__card-grid">
                {section.cards.map((card) => (
                  <article key={card.title} className="footer-info-section__mini-card">
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                  </article>
                ))}
              </div>
            ) : null}

            {section.details?.length ? (
              <div className="footer-info-section__detail-grid">
                {section.details.map((detail) => (
                  <article key={detail.label} className="footer-info-section__detail-card">
                    <span>{detail.label}</span>
                    <strong>{detail.value}</strong>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        ))}

        {page.callout ? (
          <section className="footer-info-page__callout">
            <p>{page.callout.title}</p>
            <strong>{page.callout.body}</strong>
          </section>
        ) : null}

        <div className="footer-info-page__actions">
          <button type="button" className="story-read-button" onClick={onContinueShopping}>
            {page.actionLabel || 'Continue shopping'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default FooterPage
