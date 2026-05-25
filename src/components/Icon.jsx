function Icon({ name, className = '' }) {
  const icons = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M6 6 18 18M18 6 6 18" />,
    search: <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm8 14-3.2-3.2" />,
    account: (
      <path d="M12 5a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 12 5Zm-5.2 13a5.2 5.2 0 0 1 10.4 0" />
    ),
    heart: (
      <path d="M12 20.5 5.8 14.7a4.5 4.5 0 0 1 6.2-6.5L12 9l.01-.8a4.5 4.5 0 0 1 6.2 6.5L12 20.5Z" />
    ),
    bag: <path d="M7 8V7a5 5 0 0 1 10 0v1M5 8h14l-1 11H6L5 8Z" />,
    chevron: <path d="m9 6 6 6-6 6" />,
    left: <path d="m14.5 6.5-5 5.5 5 5.5" />,
    right: <path d="m9.5 6.5 5 5.5-5 5.5" />,
    shipping: (
      <path d="M3 8h10v8H3V8Zm10 2h3l2 2v4h-5v-6Zm-7 8h7M17 18h1M6 18a1.5 1.5 0 1 0 0 .01ZM17 18a1.5 1.5 0 1 0 0 .01Z" />
    ),
    return: <path d="M8 8H4v4M4.5 11.5A7.5 7.5 0 1 0 7 6.2M16 16h4v-4M19.5 12.5A7.5 7.5 0 0 0 17 17.8" />,
    lock: <path d="M7 11V8.8A5 5 0 0 1 17 8.8V11M6 11h12v8H6v-8Zm6 3v2.8" />,
    check: <path d="m5.5 12 4 4 9-9" />,
    facebook: (
      <path
        d="M13.36 20v-6.27h2.1l.31-2.45h-2.41V9.73c0-.71.2-1.2 1.2-1.2h1.28V6.4c-.63-.07-1.27-.11-1.9-.1-1.88 0-3.17 1.15-3.17 3.26v1.72H8.64v2.45h2.13V20h2.59Z"
        fill="currentColor"
        stroke="none"
      />
    ),
    instagram: (
      <>
        <rect x="4.75" y="4.75" width="14.5" height="14.5" rx="4.25" />
        <circle cx="12" cy="12" r="3.25" />
        <circle cx="16.7" cy="7.3" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
    youtube: (
      <>
        <path d="M19.94 8.61a2.6 2.6 0 0 0-1.84-1.84C16.48 6.3 12 6.3 12 6.3s-4.48 0-6.1.47A2.6 2.6 0 0 0 4.06 8.6a27.2 27.2 0 0 0 0 6.78 2.6 2.6 0 0 0 1.84 1.84c1.62.47 6.1.47 6.1.47s4.48 0 6.1-.47a2.6 2.6 0 0 0 1.84-1.84 27.2 27.2 0 0 0 0-6.77Z" />
        <path d="m10.25 14.85 4.8-2.85-4.8-2.85v5.7Z" fill="currentColor" stroke="none" />
      </>
    ),
  }

  const svgClassName = ['icon', `icon--${name}`, className].filter(Boolean).join(' ')

  return (
    <svg className={svgClassName} viewBox="0 0 24 24" aria-hidden="true">
      {icons[name] || null}
    </svg>
  )
}

export default Icon
