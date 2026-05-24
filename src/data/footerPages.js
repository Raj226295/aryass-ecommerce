export const FOOTER_PAGE_IDS = {
  dailyDrop: 'daily-drop',
  winterCollection: 'winter-collection',
  bestSeller: 'best-seller',
  westernWear: 'western-wear',
  returnsExchanges: 'returns-exchanges',
  maharaniSale: 'maharani-sale',
  aboutUs: 'about-us',
  collaboration: 'collaboration',
  contactInformation: 'contact-information',
  privacyPolicy: 'privacy-policy',
  refundPolicy: 'refund-policy',
  shippingPolicy: 'shipping-policy',
  termsOfService: 'terms-of-service',
}

export const footerLegalLinks = [
  'Refund policy',
  'Privacy policy',
  'Terms of service',
  'Shipping policy',
  'Contact information',
]

export const footerPages = [
  {
    id: FOOTER_PAGE_IDS.dailyDrop,
    label: 'Daily Drop',
    matchLabels: ['Daily Drop'],
    theme: 'editorial',
    kicker: 'Fresh Arrival Edit',
    title: 'Daily Drop',
    intro:
      'Daily Drop is where Aryass surfaces fresh mood-led arrivals that feel current, elevated, and easy to style right away.',
    metrics: [
      { value: 'New Daily', label: 'Product refresh', text: 'Fresh picks rotate in with fast visibility.' },
      { value: 'Small Batch', label: 'Tight curation', text: 'The edit stays selective instead of overwhelming.' },
      { value: 'Fast Moving', label: 'Best to save early', text: 'Popular sizes and shades can move quickly.' },
    ],
    sections: [
      {
        eyebrow: 'What To Expect',
        title: 'A sharper landing space for the newest Aryass mood',
        paragraphs: [
          'This page is designed for shoppers who want the latest pieces without scanning the full catalog. Think of it as the first stop for new silhouettes, fresh color stories, and recently added occasionwear.',
          'Instead of a flat archive, the page frames newness through a premium editorial lens so every launch feels intentional.',
        ],
      },
      {
        title: 'Why customers use this page',
        cards: [
          { title: 'Quick discovery', text: 'See the newest edit first without filtering through older stock.' },
          { title: 'Trend-first styling', text: 'Catch the shapes, finishes, and palettes currently defining the brand mood.' },
          { title: 'Low-friction browsing', text: 'A focused page keeps exploration calm, mobile-friendly, and fast.' },
        ],
      },
    ],
    callout: {
      title: 'Styling note',
      body: 'Daily Drop works best when it feels alive, selective, and premium. The page should always feel more like a curated release than a long feed.',
    },
    actionLabel: 'Continue shopping',
  },
  {
    id: FOOTER_PAGE_IDS.winterCollection,
    label: 'Winter Collection',
    matchLabels: ['Winter Collection'],
    theme: 'editorial',
    kicker: 'Seasonal Edit',
    title: 'Winter Collection',
    intro:
      'The Winter Collection brings together richer textures, deeper tones, and layered silhouettes for festive evenings and cooler-day polish.',
    metrics: [
      { value: 'Layer Ready', label: 'Smart textures', text: 'Pieces are chosen to hold shape and visual depth.' },
      { value: 'Warm Tones', label: 'Season palette', text: 'Mocha, wine, charcoal, pearl, and muted gold lead the edit.' },
      { value: 'Occasion Forward', label: 'Day to evening', text: 'Works for intimate gatherings and dressed-up city plans.' },
    ],
    sections: [
      {
        title: 'Collection direction',
        paragraphs: [
          'This page should communicate seasonal richness rather than heavy winter basics. Aryass winter is about texture, layering, and elevated dressing instead of bulky outerwear.',
        ],
        bullets: [
          'Polished fabrics with visible depth and soft sheen.',
          'Silhouettes that pair easily with boots, heels, or structured bags.',
          'A mood that feels warm, calm, and slightly festive.',
        ],
      },
      {
        title: 'Best page blocks',
        cards: [
          { title: 'Hero story', text: 'Lead with a high-impact seasonal message and one standout campaign image.' },
          { title: 'Fabric cues', text: 'Use copy that highlights feel, drape, and the comfort of longer wear.' },
          { title: 'Giftable angle', text: 'Position select pieces as festive-season wardrobe upgrades.' },
        ],
      },
    ],
    actionLabel: 'Back to home',
  },
  {
    id: FOOTER_PAGE_IDS.bestSeller,
    label: 'Best Seller',
    matchLabels: ['Best Seller'],
    theme: 'editorial',
    kicker: 'Customer Favorites',
    title: 'Best Seller',
    intro:
      'Best Seller is the trust page. It should surface the looks shoppers save fastest, rebuy most, and recommend most confidently.',
    metrics: [
      { value: 'High Save', label: 'Repeat interest', text: 'These are the pieces users come back to often.' },
      { value: 'Reliable Fit', label: 'Easy picks', text: 'Popular styles tend to convert because they feel safer to choose.' },
      { value: 'Social Proof', label: 'Confidence driver', text: 'Favorites reduce hesitation and speed up checkout decisions.' },
    ],
    sections: [
      {
        title: 'What makes a best seller page work',
        bullets: [
          'Strong clarity on what is selling and why it stands out.',
          'Balanced mix of occasion pieces and easy wardrobe staples.',
          'Clear sizing, delivery, and styling confidence cues.',
        ],
      },
      {
        title: 'Recommended presentation',
        paragraphs: [
          'Best Seller should feel calm and confidence-building. Customers use it when they want an easy yes. Avoid clutter and push strong hierarchy, visible product value, and consistent trust signals.',
        ],
      },
    ],
    callout: {
      title: 'Trust layer',
      body: 'When in doubt, highlight reviews, repeat shopper behavior, and versatile styling notes close to the product cards.',
    },
    actionLabel: 'Continue shopping',
  },
  {
    id: FOOTER_PAGE_IDS.westernWear,
    label: 'Western Wear',
    matchLabels: ['Western Wear'],
    theme: 'editorial',
    kicker: 'Modern Occasionwear',
    title: 'Western Wear',
    intro:
      'The Western Wear page should frame Aryass as polished, feminine, and statement-ready with silhouettes that move from brunch to evening plans.',
    metrics: [
      { value: 'Day To Night', label: 'Flexible styling', text: 'Looks transition across events with small accessory changes.' },
      { value: 'Modern Cuts', label: 'Silhouette focus', text: 'Sharper necklines, drape, and structure define the page.' },
      { value: 'Premium Mood', label: 'Visual tone', text: 'The page should feel clean, confident, and editorial.' },
    ],
    sections: [
      {
        title: 'Page goals',
        paragraphs: [
          'Western Wear needs to feel like a dedicated destination, not just a catch-all label. It should guide shoppers toward confident styling and premium product storytelling.',
        ],
        bullets: [
          'Highlight dresses, tops, co-ords, and standout separates.',
          'Use confident copy with modern fashion language.',
          'Keep the layout sharp and aspirational on mobile.',
        ],
      },
      {
        title: 'Visual direction',
        cards: [
          { title: 'Neutral luxury', text: 'Warm white, ink, espresso, and brushed gold work well for the frame.' },
          { title: 'Strong typography', text: 'Use elegant serif headlines with crisp body copy for contrast.' },
          { title: 'Focused sections', text: 'Keep the browsing journey segmented by mood instead of endless product walls.' },
        ],
      },
    ],
    actionLabel: 'Explore collection',
  },
  {
    id: FOOTER_PAGE_IDS.returnsExchanges,
    label: 'Returns & Exchanges',
    matchLabels: ['Returns & Exchanges', 'Returns and Exchanges'],
    theme: 'policy',
    kicker: 'Policy Center',
    title: 'Returns & Exchanges',
    intro:
      'This page explains the return request window, exchange process, eligibility expectations, and how damaged-item cases should be raised.',
    sections: [
      {
        title: 'Request Window',
        bullets: [
          'Return or exchange requests should be raised within 4 days of delivery.',
          'Items must be unused, unwashed, unaltered, and sent back with original tags and packaging.',
          'Requests may be declined if the returned product does not pass the quality check.',
        ],
      },
      {
        title: 'Exchange Handling',
        bullets: [
          'Exchange requests are reviewed after the return is approved and stock availability is confirmed.',
          'If the requested size or style is unavailable, the request may be closed as store credit or refund based on the order type.',
          'A maximum of 3 pickup attempts may be made before the request is cancelled.',
        ],
      },
      {
        title: 'Damaged Or Wrong Item Cases',
        paragraphs: [
          'If the item arrives damaged, tampered with, or incorrect, customers should share clear product images and an unboxing video while creating the request. This helps the support team resolve the case faster and more accurately.',
        ],
      },
    ],
    callout: {
      title: 'Important',
      body: 'Exchange approvals depend on both the product condition and size availability at the time the return is processed.',
    },
    actionLabel: 'Back to home',
  },
  {
    id: FOOTER_PAGE_IDS.maharaniSale,
    label: 'Maharani Sale',
    matchLabels: ['Maharani Sale'],
    theme: 'editorial',
    kicker: 'Festive Campaign',
    title: 'Maharani Sale',
    intro:
      'Maharani Sale should feel celebratory, regal, and high-value, spotlighting standout Aryass occasionwear with a festive shopping tone.',
    metrics: [
      { value: 'Festive', label: 'Campaign mood', text: 'Designed for weddings, celebrations, and statement wardrobes.' },
      { value: 'Value Led', label: 'Offer page', text: 'Strong promotional framing should remain premium, not noisy.' },
      { value: 'High Intent', label: 'Sale shopper', text: 'Visitors here usually want quick clarity on savings and hero styles.' },
    ],
    sections: [
      {
        title: 'Page priorities',
        bullets: [
          "Lead with the offer clearly, but protect the brand's luxury feel.",
          'Group products by celebration mood, not just by price drop.',
          'Use richer copy, warm metallic tones, and a stronger festive visual pulse.',
        ],
      },
      {
        title: 'Ideal sections',
        cards: [
          { title: 'Hero offer banner', text: 'One clear statement on what the customer unlocks and where it applies.' },
          { title: 'Top festive picks', text: 'Feature the most dramatic and celebratory pieces first.' },
          { title: 'Fast checkout cues', text: 'Keep savings, dispatch confidence, and limited-time urgency visible.' },
        ],
      },
    ],
    actionLabel: 'Continue shopping',
  },
  {
    id: FOOTER_PAGE_IDS.aboutUs,
    label: 'About Us',
    matchLabels: ['About Us'],
    theme: 'brand',
    kicker: 'Brand Story',
    title: 'About Aryass',
    intro:
      'Aryass is imagined as a modern fashion label focused on elevated mobile shopping, premium edits, and occasion-ready styling with an easy, feminine point of view.',
    sections: [
      {
        title: 'What the brand stands for',
        paragraphs: [
          'The idea behind Aryass is simple: help shoppers discover polished looks without friction. Every collection, campaign, and product story should feel refined but still approachable.',
          'The tone of the brand balances warmth with confidence. It should never feel cold, chaotic, or overly mass-market.',
        ],
      },
      {
        title: 'Core principles',
        cards: [
          { title: 'Curated over crowded', text: 'The browsing experience should feel edited, not endless.' },
          { title: 'Visual clarity', text: 'Strong hierarchy and premium spacing keep mobile shopping elegant.' },
          { title: 'Confidence in choice', text: 'Customers should always understand why a piece is worth saving.' },
        ],
      },
    ],
    callout: {
      title: 'Brand mood',
      body: 'Every page should feel intentional, polished, and a little luxe without becoming stiff.',
    },
    actionLabel: 'Back to home',
  },
  {
    id: FOOTER_PAGE_IDS.collaboration,
    label: 'Collaboration',
    matchLabels: ['Collaboration'],
    theme: 'brand',
    kicker: 'Partnerships',
    title: 'Collaboration',
    intro:
      'This page is for creators, stylists, event partners, and brand collaborators who want to work with Aryass on campaigns, shoots, edits, or curated drops.',
    sections: [
      {
        title: 'Who this page is for',
        bullets: [
          'Content creators and influencers with a clear style point of view.',
          'Stylists, photographers, and creative teams for editorials or campaigns.',
          'Brand partners exploring curated launches, gifting, or event collaborations.',
        ],
      },
      {
        title: 'What helps a collaboration request stand out',
        cards: [
          { title: 'Clear concept', text: 'Explain the angle, audience, and outcome you want to create.' },
          { title: 'Relevant alignment', text: 'Show why your visual language matches the Aryass mood.' },
          { title: 'Practical details', text: 'Include timelines, expected deliverables, and contact readiness.' },
        ],
      },
      {
        title: 'Response expectations',
        paragraphs: [
          'The brand should prioritize concise, well-structured requests that clearly explain the opportunity. Collaboration pages work best when they feel selective and premium rather than open-ended.',
        ],
      },
    ],
    actionLabel: 'Back to home',
  },
  {
    id: FOOTER_PAGE_IDS.contactInformation,
    label: 'Contact Information',
    matchLabels: ['Contact Information'],
    theme: 'brand',
    kicker: 'Support Center',
    title: 'Contact Information',
    intro:
      'Customers should be able to quickly understand how to reach Aryass for order help, support questions, and general assistance.',
    sections: [
      {
        title: 'Support channels',
        details: [
          { label: 'Email support', value: 'Use the support email shared in your order confirmation or footer contact block.' },
          { label: 'WhatsApp assistance', value: 'Text-only support can be used for quick order updates and request help.' },
          { label: 'Working hours', value: 'Monday to Saturday, 10 AM to 7 PM IST is the recommended support window.' },
          { label: 'Response style', value: 'Faster help comes from sharing your order number and clear issue details up front.' },
        ],
      },
      {
        title: 'Best way to get help',
        bullets: [
          'Mention the order number in the first message.',
          'For damaged items, attach clear images and the unboxing video.',
          'For policy questions, mention whether you need refund, exchange, or delivery help.',
        ],
      },
    ],
    actionLabel: 'Back to home',
  },
  {
    id: FOOTER_PAGE_IDS.privacyPolicy,
    label: 'Privacy Policy',
    matchLabels: ['Privacy Policy', 'Privacy policy'],
    theme: 'policy',
    kicker: 'Legal Information',
    title: 'Privacy Policy',
    intro:
      'This page outlines how customer information is typically collected, used, protected, and retained during browsing, checkout, and post-order support.',
    sections: [
      {
        title: 'Information We Use',
        bullets: [
          'Basic customer details such as name, phone number, email address, and shipping address may be collected during checkout or support requests.',
          'Order details, payment status, and delivery updates may be used to fulfill and manage purchases.',
          'Browsing behavior may be used in aggregate to improve storefront performance and shopping experience.',
        ],
      },
      {
        title: 'How Information Supports The Experience',
        bullets: [
          'To confirm orders, process payments, and coordinate deliveries.',
          'To provide support for returns, exchanges, and refund requests.',
          'To improve site usability, content clarity, and collection merchandising over time.',
        ],
      },
      {
        title: 'Data Handling',
        paragraphs: [
          'Customer information should be handled carefully, used only for legitimate storefront and support purposes, and protected through reasonable safeguards. Sensitive payment information should never be exposed in plain customer-facing support flows.',
        ],
      },
    ],
    actionLabel: 'Back to home',
  },
  {
    id: FOOTER_PAGE_IDS.refundPolicy,
    label: 'Refund Policy',
    matchLabels: ['Refund Policy', 'Refund policy'],
    theme: 'policy',
    kicker: 'Refund Support',
    title: 'Refund Processing and Terms',
    intro:
      'This page explains how refund processing usually works after a return is received, checked, and approved.',
    sections: [
      {
        title: 'Refund Terms',
        bullets: [
          'The returned product typically reaches the warehouse within 6-7 days.',
          'A quality check is usually completed within 24 hours after the item is received.',
          'Prepaid order returns are refunded to the original payment method after approval.',
          'COD order returns are generally resolved as store credit valid for future use.',
          'If an item purchased with store credit is returned, the value may be reissued as store credit instead of a cash refund.',
          'Reward points and promotional store credits are non-refundable and can only be redeemed on the store.',
        ],
      },
      {
        title: 'How To Use Store Credit',
        paragraphs: [
          'Store credit can be applied during checkout after logging into the same account or contact flow tied to the original purchase. The experience should feel simple, visible, and low-friction for repeat shoppers.',
        ],
      },
      {
        title: 'Important Guidelines',
        bullets: [
          'Do not accept delivery if the package appears unsealed, tampered with, or visibly damaged.',
          'Refunds and exchanges are processed only if the returned item passes inspection and eligibility checks.',
        ],
      },
    ],
    actionLabel: 'Back to home',
  },
  {
    id: FOOTER_PAGE_IDS.shippingPolicy,
    label: 'Shipping Policy',
    matchLabels: ['Shipping Policy', 'Shipping policy'],
    theme: 'policy',
    kicker: 'Delivery Support',
    title: 'Shipping Policy',
    intro:
      'This page covers dispatch timing, estimated delivery windows, order movement expectations, and common shipping support notes.',
    sections: [
      {
        title: 'Dispatch and Delivery',
        bullets: [
          'Most confirmed orders are typically dispatched within 24-48 working hours.',
          'Metro cities usually receive deliveries in 2-4 working days after dispatch.',
          'Other serviceable locations usually receive deliveries in 4-7 working days after dispatch.',
          'Delivery timelines may extend slightly during launches, festive drops, or courier-side delays.',
        ],
      },
      {
        title: 'Order Tracking Support',
        bullets: [
          'Customers should receive tracking details once the shipment is created and scanned by the courier partner.',
          'Shipping support works best when the order number and delivery pin code are shared together.',
          'Address corrections may not always be possible after dispatch is completed.',
        ],
      },
      {
        title: 'Important Notes',
        paragraphs: [
          'Shipping charges, delivery timelines, and serviceability can vary by order value and destination. High-traffic sale windows may slightly affect normal movement times.',
        ],
      },
    ],
    actionLabel: 'Back to home',
  },
  {
    id: FOOTER_PAGE_IDS.termsOfService,
    label: 'Terms of Service',
    matchLabels: ['Terms of Service', 'Terms of service'],
    theme: 'policy',
    kicker: 'Legal Information',
    title: 'Terms of Service',
    intro:
      'These terms describe the basic expectations around browsing, purchasing, policy use, and responsible interaction with the Aryass storefront.',
    sections: [
      {
        title: 'Using The Store',
        bullets: [
          'Product availability, sizes, and offers may change without prior notice based on stock and campaign timing.',
          'Orders may be reviewed or cancelled if payment issues, fraud concerns, or clear pricing errors are identified.',
          'Customers are expected to provide accurate order and delivery details while placing purchases.',
        ],
      },
      {
        title: 'Content And Pricing',
        bullets: [
          'Product imagery and styling are intended to reflect the closest possible visual representation, though slight variation may occur.',
          'Pricing, promotions, and policy terms should be read together with collection-specific notes where applicable.',
          'Using the storefront implies acceptance of the current store terms and policies at the time of purchase.',
        ],
      },
      {
        title: 'Support And Resolution',
        paragraphs: [
          'If a dispute or order issue occurs, the support flow should be used first with accurate order context. Clear communication helps resolve shipping, returns, and payment concerns much faster.',
        ],
      },
    ],
    actionLabel: 'Back to home',
  },
]

const footerPageLookup = Object.fromEntries(
  footerPages.flatMap((page) => page.matchLabels.map((label) => [label.toLowerCase(), page])),
)

const footerPageById = Object.fromEntries(footerPages.map((page) => [page.id, page]))

export function getFooterPageForLabel(label) {
  return footerPageLookup[label.toLowerCase()] || null
}

export function getFooterPageById(pageId) {
  return footerPageById[pageId] || null
}
