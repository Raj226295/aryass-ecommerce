import Icon from './Icon'
import { socialLinks } from '../data/catalog'

function SocialLinks({ className = '', onLinkClick }) {
  return (
    <div className={className}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          className="social-link"
          href={link.href}
          aria-label={link.label}
          onClick={onLinkClick ? (event) => onLinkClick(event, link) : undefined}
        >
          <Icon name={link.name} />
        </a>
      ))}
    </div>
  )
}

export default SocialLinks
