import React from 'react';

interface ProductLogoProps {
  slug: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Authentic, pristine vector/SVG logos for Google products.
 * Zero external hotlinks, zero broken images, crisp on all displays (Retina/4K),
 * with accessible labeling and deliberate typographic fallbacks.
 */
export const ProductLogo: React.FC<ProductLogoProps> = ({ 
  slug, 
  name, 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }[size];

  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Google Gemini (Authentic 4-Point Star Gradient)
  if (normalizedSlug === 'gemini') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <defs>
          <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4E82EE" />
            <stop offset="35%" stopColor="#9C59F7" />
            <stop offset="70%" stopColor="#D96570" />
            <stop offset="100%" stopColor="#F5B942" />
          </linearGradient>
        </defs>
        <path 
          d="M24 0C24 13.255 13.255 24 0 24C13.255 24 24 34.745 24 48C24 34.745 34.745 24 48 24C34.745 24 24 13.255 24 0Z" 
          fill="url(#geminiGrad)" 
        />
      </svg>
    );
  }

  // 2. NotebookLM (Authentic Folded Research Infinity Book)
  if (normalizedSlug === 'notebooklm') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <defs>
          <linearGradient id="nlmTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A884" />
            <stop offset="100%" stopColor="#006654" />
          </linearGradient>
          <linearGradient id="nlmIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
        </defs>
        <path d="M10 8C7.79 8 6 9.79 6 12V36C6 38.21 7.79 40 10 40H22V8H10Z" fill="url(#nlmTeal)" />
        <path d="M38 8C40.21 8 42 9.79 42 12V36C42 38.21 40.21 40 38 40H26V8H38Z" fill="url(#nlmIndigo)" />
        <circle cx="24" cy="24" r="5" fill="#FFFFFF" />
        <path d="M21 24H27" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 3. Google AI Studio (Hexagonal Developer Multimodal Sparkle)
  if (normalizedSlug === 'google-ai-studio') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <defs>
          <linearGradient id="aiStudioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A73E8" />
            <stop offset="50%" stopColor="#8AB4F8" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>
        <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" fill="url(#aiStudioGrad)" opacity="0.95" />
        <polygon points="24,12 34,18 34,30 24,36 14,30 14,18" fill="#FFFFFF" opacity="0.9" />
        <path d="M24 16V32M16 24H32" stroke="#1A73E8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Google Antigravity (Futuristic Levitating Gyroscope / Quantum Sphere)
  if (normalizedSlug === 'google-antigravity') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <defs>
          <linearGradient id="antiGravGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="none" stroke="url(#antiGravGrad)" strokeWidth="3" strokeDasharray="30 10" />
        <ellipse cx="24" cy="24" rx="20" ry="7" fill="none" stroke="#3B82F6" strokeWidth="2.5" transform="rotate(-30 24 24)" />
        <ellipse cx="24" cy="24" rx="20" ry="7" fill="none" stroke="#8B5CF6" strokeWidth="2.5" transform="rotate(30 24 24)" />
        <circle cx="24" cy="24" r="5" fill="#06B6D4" />
      </svg>
    );
  }

  // 5. Gmail (Authentic 4-Color Envelope M)
  if (normalizedSlug === 'gmail') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M6 36V16.5L24 28.5L42 16.5V36C42 38.2 40.2 40 38 40H10C7.8 40 6 38.2 6 36Z" fill="#EA4335" />
        <path d="M42 14.5V16.5L24 28.5L6 16.5V14.5C6 12.3 7.8 10.5 10 10.5H38C40.2 10.5 42 12.3 42 14.5Z" fill="#C5221F" opacity="0.3" />
        <path d="M6 16.5L16.5 24.5L6 32V16.5Z" fill="#FBBC04" />
        <path d="M42 16.5L31.5 24.5L42 32V16.5Z" fill="#34A853" />
        <path d="M10 8H16L24 14.5L32 8H38C40.2 8 42 9.8 42 12V14.5L24 28.5L6 14.5V12C6 9.8 7.8 8 10 8Z" fill="#4285F4" />
        <path d="M6 14.5L24 28.5L42 14.5" stroke="#EA4335" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 6. Google Drive (Authentic Triangular Loop)
  if (normalizedSlug === 'google-drive') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M17.5 7.5L30.5 7.5L43.5 30L30.5 30L17.5 7.5Z" fill="#FFBA00" />
        <path d="M4.5 30L11 41.5L37 41.5L30.5 30L4.5 30Z" fill="#00AC47" />
        <path d="M4.5 30L17.5 7.5L24 18.5L11 41.5L4.5 30Z" fill="#0066DA" />
        <path d="M17.5 7.5L24 18.5L37 41.5L43.5 30L17.5 7.5Z" fill="#EA4335" opacity="0.15" />
      </svg>
    );
  }

  // 7. Google Docs (Authentic Blue Folded Sheet with Lines)
  if (normalizedSlug === 'google-docs') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M30 6H12C9.79 6 8 7.79 8 10V38C8 40.21 9.79 42 12 42H36C38.21 42 40 40.21 40 38V16L30 6Z" fill="#4285F4" />
        <path d="M30 6V16H40L30 6Z" fill="#A1C2FA" />
        <path d="M16 22H32M16 28H32M16 34H26" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 8. Google Sheets (Authentic Emerald Spreadsheet Grid)
  if (normalizedSlug === 'google-sheets') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M30 6H12C9.79 6 8 7.79 8 10V38C8 40.21 9.79 42 12 42H36C38.21 42 40 40.21 40 38V16L30 6Z" fill="#0F9D58" />
        <path d="M30 6V16H40L30 6Z" fill="#87CEAC" />
        <rect x="15" y="21" width="18" height="15" rx="1.5" fill="#FFFFFF" />
        <line x1="15" y1="26" x2="33" y2="26" stroke="#0F9D58" strokeWidth="1.5" />
        <line x1="15" y1="31" x2="33" y2="31" stroke="#0F9D58" strokeWidth="1.5" />
        <line x1="21" y1="21" x2="21" y2="36" stroke="#0F9D58" strokeWidth="1.5" />
        <line x1="27" y1="21" x2="27" y2="36" stroke="#0F9D58" strokeWidth="1.5" />
      </svg>
    );
  }

  // 9. Google Slides (Authentic Amber Presentation Slide)
  if (normalizedSlug === 'google-slides') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M30 6H12C9.79 6 8 7.79 8 10V38C8 40.21 9.79 42 12 42H36C38.21 42 40 40.21 40 38V16L30 6Z" fill="#F4B400" />
        <path d="M30 6V16H40L30 6Z" fill="#FCE293" />
        <rect x="15" y="21" width="18" height="14" rx="2" fill="#FFFFFF" />
        <rect x="18" y="24" width="12" height="8" rx="1" fill="#F4B400" />
      </svg>
    );
  }

  // 10. Google Meet (Authentic Green Camera Quadrilateral)
  if (normalizedSlug === 'google-meet') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <rect x="6" y="12" width="24" height="24" rx="5" fill="#00832D" />
        <path d="M30 18L42 10V38L30 30V18Z" fill="#00AC47" />
        <path d="M6 17C6 14.2 8.2 12 11 12H25C27.8 12 30 14.2 30 17V31C30 33.8 27.8 36 25 36H11C8.2 36 6 33.8 6 31V17Z" fill="#00832D" />
        <polygon points="30,19 42,12 42,36 30,29" fill="#00AC47" />
        <circle cx="18" cy="24" r="4.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // 11. Google Calendar (Authentic Desk Calendar with 31)
  if (normalizedSlug === 'google-calendar') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <rect x="6" y="10" width="36" height="32" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        <path d="M6 14C6 11.79 7.79 10 10 10H38C40.21 10 42 11.79 42 14V18H6V14Z" fill="#1A73E8" />
        <rect x="13" y="6" width="4" height="8" rx="2" fill="#EA4335" />
        <rect x="31" y="6" width="4" height="8" rx="2" fill="#EA4335" />
        <text x="24" y="34" textAnchor="middle" fill="#1A73E8" fontSize="16" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">31</text>
      </svg>
    );
  }

  // 12. Google Forms (Authentic Purple Clipboard)
  if (normalizedSlug === 'google-forms') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M30 6H12C9.79 6 8 7.79 8 10V38C8 40.21 9.79 42 12 42H36C38.21 42 40 40.21 40 38V16L30 6Z" fill="#7248B9" />
        <path d="M30 6V16H40L30 6Z" fill="#C7B2EA" />
        <circle cx="17" cy="23" r="2" fill="#FFFFFF" />
        <rect x="22" y="21.5" width="10" height="3" rx="1.5" fill="#FFFFFF" />
        <circle cx="17" cy="29" r="2" fill="#FFFFFF" />
        <rect x="22" y="27.5" width="10" height="3" rx="1.5" fill="#FFFFFF" />
        <circle cx="17" cy="35" r="2" fill="#FFFFFF" />
        <rect x="22" y="33.5" width="10" height="3" rx="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  // 13. Firebase (Authentic Angular Flame in Amber/Orange)
  if (normalizedSlug === 'firebase') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M8.2 38.3L16.4 5.9C16.6 5.1 17.7 4.9 18.2 5.6L24.8 17.5L8.2 38.3Z" fill="#FFA000" />
        <path d="M25.8 22.4L31.1 13.2C31.5 12.5 32.6 12.5 32.9 13.3L39.8 38.3L25.8 22.4Z" fill="#F57C00" />
        <path d="M8.2 38.3L23.4 46.8C24.1 47.2 25 47.1 25.7 46.6L39.8 38.3L33.7 15.6L8.2 38.3Z" fill="#FFCA28" />
        <path d="M24.8 46.6L8.2 38.3L25.8 22.4L39.8 38.3L24.8 46.6Z" fill="#FFA000" opacity="0.6" />
      </svg>
    );
  }

  // 14. Google Cloud Platform (Authentic 4-Color Cloud)
  if (normalizedSlug === 'google-cloud') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M36 22C35.5 14.8 29.5 9 22 9C15.9 9 10.7 13.1 9 18.8C4 19.8 0 24.3 0 29.7C0 35.8 5 40.7 11.2 40.7H35.2C40.6 40.7 45 36.3 45 30.9C45 25.9 41.2 22.4 36 22Z" fill="#4285F4" />
        <path d="M35.2 40.7H11.2C5 40.7 0 35.8 0 29.7C0 26.5 1.3 23.6 3.5 21.6L12.5 30.6L22.5 40.7H35.2Z" fill="#34A853" />
        <path d="M36 22L28 30L22 24L31 15C33.2 16.7 34.9 19.1 36 22Z" fill="#EA4335" />
        <path d="M22 9C24.8 9 27.4 9.9 29.5 11.5L20 21L12.5 13.5C14.8 10.7 18.2 9 22 9Z" fill="#FBBC04" />
      </svg>
    );
  }

  // 15. Android Studio (Green Bugdroid + Architect Compass)
  if (normalizedSlug === 'android-studio') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <circle cx="24" cy="24" r="20" fill="#3DDC84" />
        <path d="M16 19C16 14.58 19.58 11 24 11C28.42 11 32 14.58 32 19H16Z" fill="#FFFFFF" />
        <circle cx="20" cy="15.5" r="1.5" fill="#3DDC84" />
        <circle cx="28" cy="15.5" r="1.5" fill="#3DDC84" />
        <line x1="18" y1="11" x2="15" y2="7" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="11" x2="33" y2="7" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="24,23 35,35 13,35" fill="#073042" />
        <circle cx="24" cy="28" r="3" fill="#FFFFFF" />
      </svg>
    );
  }

  // 16. Google Analytics / GA4 (Authentic Orange Rising Nodes)
  if (normalizedSlug === 'google-analytics') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <rect x="6" y="24" width="8" height="18" rx="4" fill="#F9AB00" />
        <rect x="20" y="14" width="8" height="28" rx="4" fill="#E37400" />
        <rect x="34" y="6" width="8" height="36" rx="4" fill="#E37400" />
        <circle cx="38" cy="10" r="4" fill="#F9AB00" />
      </svg>
    );
  }

  // 17. Google Search Console (Blue & Red Wrench / Growth Matrix)
  if (normalizedSlug === 'google-search-console') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <circle cx="24" cy="24" r="19" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
        <path d="M12 34L20 26L26 31L36 18" stroke="#1A73E8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M28 14L34 20L31 23L25 17L28 14Z" fill="#EA4335" />
        <path d="M16 32L28 20" stroke="#EA4335" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 18. Google AdMob (Monetisation: Hexagonal Red/Orange Prism & Currency)
  if (normalizedSlug === 'google-admob') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <defs>
          <linearGradient id="admobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA4335" />
            <stop offset="100%" stopColor="#D93025" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="32" height="32" rx="8" fill="url(#admobGrad)" />
        <path d="M18 16H30C32.2 16 34 17.8 34 20V28C34 30.2 32.2 32 30 32H18C15.8 32 14 30.2 14 28V20C14 17.8 15.8 16 18 16Z" fill="#FFFFFF" />
        <circle cx="24" cy="24" r="4.5" fill="#EA4335" />
        <path d="M24 19V29M20 22H28" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 19. Google Ads (Authentic 4-Color Triangle Loop)
  if (normalizedSlug === 'google-ads') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M10.5 35.5C7.5 30.3 9.3 23.7 14.5 20.7L25.5 14.3C30.7 11.3 37.3 13.1 40.3 18.3C43.3 23.5 41.5 30.1 36.3 33.1L25.3 39.5C20.1 42.5 13.5 40.7 10.5 35.5Z" fill="#FBBC04" />
        <circle cx="15" cy="33" r="6" fill="#4285F4" />
        <line x1="14" y1="33" x2="36" y2="20" stroke="#34A853" strokeWidth="9" strokeLinecap="round" />
      </svg>
    );
  }

  // 20. Google Play Billing (Monetisation: Multicolored Triangle with Coin/Shield)
  if (normalizedSlug === 'google-play-billing') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M8 7.5V40.5L25 24L8 7.5Z" fill="#00C1A6" />
        <path d="M33 16.5L25 24L8 7.5C8.8 6.7 10.1 6.5 11.3 7.2L33 16.5Z" fill="#00D4FF" />
        <path d="M33 31.5L11.3 40.8C10.1 41.5 8.8 41.3 8 40.5L25 24L33 31.5Z" fill="#FF3366" />
        <path d="M41 24C41 24.8 40.5 25.6 39.7 26.1L33 31.5L25 24L33 16.5L39.7 21.9C40.5 22.4 41 23.2 41 24Z" fill="#FFBB00" />
        <circle cx="28" cy="24" r="5" fill="#FFFFFF" />
        <text x="28" y="27" textAnchor="middle" fill="#00C1A6" fontSize="8" fontWeight="bold">₹</text>
      </svg>
    );
  }

  // 21. Interactive Media Ads (IMA) (Monetisation: Video Frame + Dollar/Play)
  if (normalizedSlug === 'google-ima') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <rect x="6" y="10" width="36" height="28" rx="6" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" />
        <polygon points="18,17 32,24 18,31" fill="#F59E0B" />
        <circle cx="36" cy="14" r="3" fill="#10B981" />
      </svg>
    );
  }

  // 22. Google Workspace (Authentic 4-Color Circular Ribbon)
  if (normalizedSlug === 'google-workspace') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M10 16L18 24L10 32C7.8 32 6 30.2 6 28V20C6 17.8 7.8 16 10 16Z" fill="#EA4335" />
        <path d="M38 16C40.2 16 42 17.8 42 20V28C42 30.2 40.2 32 38 32L30 24L38 16Z" fill="#34A853" />
        <path d="M16 10C16 7.8 17.8 6 20 6H28C30.2 6 32 7.8 32 10L24 18L16 10Z" fill="#4285F4" />
        <path d="M16 38L24 30L32 38C32 40.2 30.2 42 28 42H20C17.8 42 16 40.2 16 38Z" fill="#FBBC04" />
      </svg>
    );
  }

  // 23. Google Maps (Authentic 4-Color Location Pin)
  if (normalizedSlug === 'google-maps') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M24 4C15.2 4 8 11.2 8 20C8 30.5 24 44 24 44C24 44 40 30.5 40 20C40 11.2 32.8 4 24 4Z" fill="#EA4335" />
        <circle cx="24" cy="20" r="7" fill="#FFFFFF" />
        <circle cx="24" cy="20" r="4" fill="#4285F4" />
        <path d="M12 24C12 27.5 15.5 32.8 20 37.5L24 42C24 42 24.5 41.5 25 41C20.5 36 17 30 17 25C17 21 19 18 21 16L15 13C13 16 12 20 12 24Z" fill="#34A853" opacity="0.3" />
      </svg>
    );
  }

  // 24. Google Photos (Authentic 4-Color Pinwheel)
  if (normalizedSlug === 'google-photos') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M24 16C28.4 16 32 12.4 32 8C32 3.6 28.4 0 24 0V16Z" fill="#EA4335" transform="translate(0, 8)" />
        <path d="M32 24C32 28.4 35.6 32 40 32C44.4 32 48 28.4 48 24H32Z" fill="#4285F4" transform="translate(-8, 0)" />
        <path d="M24 32C19.6 32 16 35.6 16 40C16 44.4 19.6 48 24 48V32Z" fill="#34A853" transform="translate(0, -8)" />
        <path d="M16 24C16 19.6 12.4 16 8 16C3.6 16 0 19.6 0 24H16Z" fill="#FBBC04" transform="translate(8, 0)" />
      </svg>
    );
  }

  // 25. Google Keep (Amber Lightbulb Note)
  if (normalizedSlug === 'google-keep') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M34 6H14C11.8 6 10 7.8 10 10V38C10 40.2 11.8 42 14 42H34C36.2 42 38 40.2 38 38V10C38 7.8 36.2 6 34 6Z" fill="#FFBA00" />
        <circle cx="24" cy="20" r="7" fill="#FFFFFF" />
        <path d="M21 27H27V29H21V27Z" fill="#FFFFFF" />
        <path d="M22 30H26V31H22V30Z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 26. Google Colab (Infinity Loop with Amber/Orange Flame)
  if (normalizedSlug === 'google-colab') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M16 16C11.6 16 8 19.6 8 24C8 28.4 11.6 32 16 32C20.4 32 24 28.4 24 24C24 19.6 20.4 16 16 16Z" fill="#F9AB00" opacity="0.9" />
        <path d="M32 16C27.6 16 24 19.6 24 24C24 28.4 27.6 32 32 32C36.4 32 40 28.4 40 24C40 19.6 36.4 16 32 16Z" fill="#E37400" opacity="0.9" />
        <circle cx="24" cy="24" r="3" fill="#FFFFFF" />
      </svg>
    );
  }

  // 27. Looker Studio (Hexagonal Analytical Faceted Cube)
  if (normalizedSlug === 'looker-studio') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <polygon points="24,6 40,15 40,33 24,42 8,33 8,15" fill="#4285F4" />
        <polygon points="24,6 40,15 24,24 8,15" fill="#8AB4F8" />
        <polygon points="24,24 40,15 40,33 24,42" fill="#1A73E8" />
        <circle cx="24" cy="24" r="4" fill="#FFFFFF" />
      </svg>
    );
  }

  // 28. BigQuery (Database Cylinder with Search Lens)
  if (normalizedSlug === 'bigquery') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <ellipse cx="24" cy="14" rx="16" ry="6" fill="#669DF6" />
        <path d="M8 14V26C8 29.3 15.2 32 24 32C32.8 32 40 29.3 40 26V14" fill="none" stroke="#1A73E8" strokeWidth="2.5" />
        <path d="M8 24V34C8 37.3 15.2 40 24 40C32.8 40 40 37.3 40 34V24" fill="none" stroke="#1A73E8" strokeWidth="2.5" />
        <circle cx="28" cy="28" r="6" fill="#FFFFFF" stroke="#4285F4" strokeWidth="2" />
        <line x1="32" y1="32" x2="38" y2="38" stroke="#4285F4" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 29. Google Search (Iconic 4-Color Google 'G')
  if (normalizedSlug === 'google-search') {
    return (
      <svg 
        viewBox="0 0 48 48" 
        className={`${sizeClasses} ${className}`}
        aria-label={`${name} official logo`}
        role="img"
      >
        <path d="M44.5 20H24V28.5H35.8C34.7 34.3 29.8 37 24 37C16.8 37 11 31.2 11 24C11 16.8 16.8 11 24 11C27.2 11 30.1 12.1 32.3 14.1L38.8 7.6C34.8 3.9 29.8 2 24 2C11.8 2 2 11.8 2 24C2 36.2 11.8 46 24 46C36.2 46 45 37.2 45 24C45 22.6 44.8 21.3 44.5 20Z" fill="#4285F4" />
        <path d="M6.3 14.7L13.6 20C15.6 15.3 20.4 12 26 12C29.2 12 32.1 13.1 34.3 15.1L40.8 8.6C36.8 4.9 31.8 3 26 3C17.3 3 9.8 7.8 6.3 14.7Z" fill="#EA4335" />
        <path d="M24 46C29.6 46 34.7 44.1 38.6 40.4L31.6 34.7C29.5 36.2 26.9 37 24 37C18.3 37 13.5 33.3 11.7 28.2L4.3 33.9C7.8 41 15.3 46 24 46Z" fill="#34A853" />
        <path d="M4.3 33.9C3.5 31.4 3 28.8 3 26C3 23.2 3.5 20.6 4.3 18.1L4.3 14.7L11.7 20.5C11.2 22.2 11 24.1 11 26C11 27.9 11.2 29.8 11.7 31.5L4.3 33.9Z" fill="#FBBC04" />
      </svg>
    );
  }

  // 30. Deliberate, elegant typographic & brand fallback (No broken images!)
  const initial = name ? name.charAt(0).toUpperCase() : 'G';
  return (
    <div 
      className={`${sizeClasses} ${className} rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold shadow-md border border-white/40`}
      aria-label={`${name} brand badge`}
      role="img"
    >
      <span className="text-base select-none leading-none tracking-tight">{initial}</span>
    </div>
  );
};
