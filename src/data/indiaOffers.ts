import { IndiaOffer } from '../types';

export const INDIA_OFFERS: IndiaOffer[] = [
  {
    id: 'jio-fiber-google-one-100gb',
    title: 'Reliance JioFiber & AirFiber Google One 100GB Cloud Storage Perk',
    productSlug: 'google-drive',
    productName: 'Google One & JioFiber',
    category: 'telecom_bundle',
    benefit: '100 GB shared Google One storage (Drive, Photos, Gmail) bundled with qualifying postpaid plans',
    summary: 'Reliance Jio partners with Google to offer 100 GB of Google One cloud backup included with qualifying JioFiber and Jio AirFiber postpaid broadband tiers (e.g. ₹599, ₹899, ₹1,199, ₹1,499+ entertainment plans).',
    eligibilityRequirements: [
      'Active qualifying JioFiber or Jio AirFiber postpaid plan with entertainment OTT/Cloud perks enabled',
      'Redemption must be completed exclusively within the official MyJio mobile app (Menu > JioFiber > OTT & Cloud Apps > Activate Google One)',
      'Account holder must sign in with a standard personal @gmail.com account',
      'Cannot be stacked on top of an existing active higher Google One plan (e.g., 2TB AI Premium)'
    ],
    paymentDetailsRequired: false,
    paymentDetailsNote: 'No separate credit or debit card required for initial activation. The cloud storage entitlement is billed and bundled as part of your monthly Jio broadband invoice.',
    expiryDateText: 'Valid as long as qualifying Jio broadband connection remains active',
    redemptionUrl: 'https://www.jio.com/fiber/en-in/plans',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'CRITICAL ANTI-SCAM NOTICE: Beware of SMS or WhatsApp messages offering "Free 500GB Jio Google Drive". Authentic redemption occurs ONLY from inside the MyJio application. If you downgrade to a base broadband plan without OTT perks, your Google One storage will revert to 15GB after a 30-day grace period.',
    termsHighlights: [
      'Storage is shareable with up to 5 family members via Google Family Sharing',
      'Includes premium Google Photos editing tools (Magic Eraser, Portrait Blur, Sky replacer)',
      'Direct customer support from Google cloud specialists'
    ]
  },
  {
    id: 'airtel-postpaid-google-one-100gb',
    title: 'Bharti Airtel Postpaid & Xstream Fiber Google One 100GB Cloud Storage Perk',
    productSlug: 'google-drive',
    productName: 'Google One & Airtel Thanks',
    category: 'telecom_bundle',
    benefit: '100 GB Google One cloud storage membership for up to 6 months to 1 year on eligible plans',
    summary: 'Bharti Airtel partners with Google to offer 100 GB of Google One cloud backup for photos, Drive files, and Gmail to eligible Airtel Postpaid (₹499, ₹599, ₹999 family plans) and Airtel Xstream Fiber broadband users, claimable via Airtel Thanks.',
    eligibilityRequirements: [
      'Active qualifying Airtel Postpaid mobile plan or Airtel Xstream Fiber broadband connection',
      'Must claim reward inside official Airtel Thanks app (Rewards / Thanks Benefits > Google One 100GB)',
      'Requires standard personal Google (@gmail.com) account without an active overlapping Google One subscription',
      'Must link and verify with your registered Airtel mobile number'
    ],
    paymentDetailsRequired: false,
    paymentDetailsNote: 'Zero credit/debit card required for initial activation. The entitlement is granted as an Airtel Thanks member reward or billed seamlessly through your monthly Airtel postpaid statement.',
    expiryDateText: 'Subject to telecom plan cycle validity - Check Airtel Thanks app',
    redemptionUrl: 'https://www.airtel.in/thanks',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'CRITICAL ANTI-SCAM NOTICE: Beware of SMS/WhatsApp phishing messages promising "Free 1TB Airtel Google Drive". Genuine Airtel Google One benefits can ONLY be claimed through the official Airtel Thanks app. After the promotional period (typically 6 months), continuing the plan costs standard ₹130/month or reverts to 15GB free storage.',
    termsHighlights: [
      'Storage is shareable with up to 5 family members via Google Family Sharing',
      'Unlocks Google Photos computational photography tools (Magic Eraser, HDR Video, Portrait Light)',
      'Back up photos, videos, contacts, and WhatsApp backups safely to Google Cloud'
    ]
  },
  {
    id: 'gcp-300-trial-india',
    title: 'Google Cloud $300 (₹24,000+) Free Trial Credits for India',
    productSlug: 'google-cloud',
    productName: 'Google Cloud Platform (GCP)',
    category: 'startup_developer',
    benefit: '$300 USD credit (credited in equivalent INR ~₹24,800) valid for 90 days',
    summary: 'Google provides eligible new cloud customers in India with $300 in promotional credits to evaluate compute, storage, BigQuery, and AI APIs without upfront infrastructure commitments.',
    eligibilityRequirements: [
      'New Google Cloud Platform accounts only (has not previously claimed GCP free trial)',
      'Indian billing address with valid PAN or GSTIN for tax invoice reporting',
      'Valid Indian credit card or debit card enabled for online international/recurring transactions (Mastercard, Visa, American Express, or supported RuPay international cards)'
    ],
    paymentDetailsRequired: true,
    paymentDetailsNote: 'A temporary authorization hold (typically ₹1 or ₹2) is charged and immediately refunded to verify card validity. You will NOT be automatically billed when the $300 credit expires unless you explicitly upgrade to a paid account.',
    expiryDateText: 'Ongoing official program (Credits expire 90 days after activation)',
    redemptionUrl: 'https://cloud.google.com/free',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'RBI e-mandate rules require two-factor authentication (OTP) for Indian card registration. Prepaid cards or standard domestic-only RuPay cards are frequently declined by the payment gateway.',
    termsHighlights: [
      'Cannot be used to mine cryptocurrency or violate GCP Acceptable Use Policy',
      'Unused trial credits expire strictly at 90 days and do not roll over',
      '20+ Always Free products (e.g. 1 e2-micro VM, Cloud Run 2M requests) remain accessible even after trial ends'
    ]
  },
  {
    id: 'airtel-carrier-billing-google-play',
    title: 'Google Play & Google One Direct Carrier Billing via Bharti Airtel',
    productSlug: 'google-drive',
    productName: 'Google Play Carrier Billing (Airtel)',
    category: 'telecom_bundle',
    benefit: 'Pay for Google One storage, Play Pass, and apps directly via monthly Airtel postpaid bill or prepaid SIM balance',
    summary: 'Bypass Indian credit and debit card transaction declines! Bharti Airtel supports Direct Carrier Billing (DCB) with Google Play, enabling subscribers to charge Google One storage expansions and Play Store digital items directly to their monthly Airtel bill without bank card details.',
    eligibilityRequirements: [
      'Active Bharti Airtel SIM card inserted in slot 1 of your Android device',
      'Prepaid users must maintain sufficient talktime/main balance; Postpaid users must have active billing credit limit',
      'Google Play Store account region must be set to India (INR currency)'
    ],
    paymentDetailsRequired: false,
    paymentDetailsNote: 'Charged directly to your existing Airtel telecom balance or monthly postpaid invoice. No credit or debit card required.',
    expiryDateText: 'Standard ongoing payment gateway feature',
    redemptionUrl: 'https://play.google.com/about/play-pass/',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Postpaid subscribers should enable biometric authentication or password requirements in Google Play to prevent unauthorized accidental in-app purchases by children on shared devices.',
    termsHighlights: [
      'Eliminates RBI recurring e-mandate card decline issues',
      'Instant SMS confirmation from Bharti Airtel for each authorized Google Play purchase',
      'Supports auto-renewal for monthly Google One 100GB/200GB storage plans'
    ]
  },
  {
    id: 'jio-ai-cloud-welcome-offer',
    title: 'Jio AI Cloud 100GB Free Storage Welcome Offer (Google Ecosystem Sync)',
    productSlug: 'google-drive',
    productName: 'Jio AI Cloud & Google Sync',
    category: 'telecom_bundle',
    benefit: 'Up to 100 GB free cloud storage for Jio 5G users with Google Drive & Photos sync capability',
    summary: 'Announced at the Reliance AGM by Mukesh Ambani, Jio customers are eligible for up to 100 GB of free cloud data storage to safely back up high-res photos, videos, and documents with seamless synchronization to Android and Google frameworks.',
    eligibilityRequirements: [
      'Active Reliance Jio True 5G mobile subscriber or JioFiber/AirFiber subscriber',
      'Requires installation and authentication through the official JioCloud app on Android or iOS',
      'Must verify mobile OTP on your primary Jio phone number'
    ],
    paymentDetailsRequired: false,
    paymentDetailsNote: '100% free welcome promotion for Jio customers. Zero credit card or payment authorization required.',
    expiryDateText: 'Active ongoing welcome rollout for eligible Jio subscribers',
    redemptionUrl: 'https://www.jio.com',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Ensure you download the legitimate "JioCloud" application verified by Reliance Corporate IT Park Limited on the Google Play Store or Apple App Store. Do not download APK files from Telegram groups.',
    termsHighlights: [
      'Automated background camera roll backup with zero compression option',
      'Integrated AI facial and document categorization',
      'Interoperable with Android media stores and Google Photos folders'
    ]
  },
  {
    id: 'jio-carrier-billing-google-play',
    title: 'Google Play & Google One Direct Carrier Billing via Reliance Jio',
    productSlug: 'google-drive',
    productName: 'Google Play Carrier Billing (Jio)',
    category: 'telecom_bundle',
    benefit: 'Pay for Google One storage, apps, and YouTube Premium directly via Jio mobile balance or postpaid bill',
    summary: 'Solve the common Indian bank card decline issue! Google and Reliance Jio support Direct Carrier Billing (DCB), enabling subscribers to charge Google One storage expansions, Google Play apps, and book rentals directly to their monthly Jio postpaid bill or prepaid SIM balance without needing an international credit card.',
    eligibilityRequirements: [
      'Active Reliance Jio SIM card inserted in slot 1 of your Android smartphone',
      'Prepaid users must maintain sufficient main balance; Postpaid users must have active billing credit limit',
      'Google Play Store account region must be set to India (INR currency)'
    ],
    paymentDetailsRequired: false,
    paymentDetailsNote: 'Charged directly to your existing Jio telecom balance. No debit or credit card required!',
    expiryDateText: 'Standard ongoing payment gateway feature',
    redemptionUrl: 'https://play.google.com/about/play-pass/',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Postpaid subscribers should monitor Google Play purchase authentication settings to avoid accidental in-app charges by family members on shared devices.',
    termsHighlights: [
      'Zero international transaction fees or bank markup charges',
      'Instant SMS confirmation from Reliance Jio for every authorized Google Play transaction',
      'Supports auto-renewal for monthly Google One 100GB/200GB storage plans'
    ]
  },
  {
    id: 'jio-business-google-workspace',
    title: 'Jio Business Google Workspace for Indian MSMEs & Startups',
    productSlug: 'google-workspace',
    productName: 'Google Workspace via Jio Business',
    category: 'business_workspace',
    benefit: 'Custom business email (@yourbrand.in) with UPI/RuPay billing and 18% GST tax invoice',
    summary: 'Reliance Jio is an official premier Google Cloud & Workspace partner in India, empowering micro, small, and medium businesses to deploy branded emails, Meet video conferencing, and team Drive storage with localized INR payment gateways and dedicated Indian support.',
    eligibilityRequirements: [
      'Registered business or sole proprietor in India owning an active domain name (e.g. yourcompany.in)',
      'Can be provisioned via Jio Enterprise portal or official Jio Business representatives',
      'Requires providing 15-digit GSTIN to claim Input Tax Credit on the 18% Goods & Services Tax'
    ],
    paymentDetailsRequired: true,
    paymentDetailsNote: 'Accepts Indian domestic NetBanking, RuPay corporate cards, UPI, and recurring bank standing instructions. Consolidated with your monthly Jio corporate telecom invoice.',
    expiryDateText: 'Annual and multi-year contract options available',
    redemptionUrl: 'https://www.jio.com/business/enterprise-solutions',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Ensure your business domain MX and SPF records are updated in your DNS registrar to ensure email deliverability.',
    termsHighlights: [
      'Full administrative control via Google Admin Console with 2FA enforcement',
      'Local Indian Rupee billing prevents international transaction markups by banks',
      'Dedicated Jio Business 24x7 phone support for Indian enterprises'
    ]
  },
  {
    id: 'airtel-business-google-workspace',
    title: 'Airtel Business Google Workspace Cloud Solution for Indian SMEs',
    productSlug: 'google-workspace',
    productName: 'Google Workspace via Airtel Business',
    category: 'business_workspace',
    benefit: 'Professional Workspace accounts bundled with Airtel broadband connectivity, RuPay billing & GST invoice',
    summary: 'Airtel Business is a premier Google Cloud Partner in India delivering integrated Google Workspace productivity suites for Indian businesses with unified billing, RuPay cards, NetBanking, and dedicated Indian technical onboarding.',
    eligibilityRequirements: [
      'Registered commercial entity or registered professional in India with a custom domain',
      'Accessible via Airtel Business Enterprise sales and customer portal',
      'Valid GSTIN required for tax deduction and input tax credit claims'
    ],
    paymentDetailsRequired: true,
    paymentDetailsNote: 'Billed in Indian Rupees (INR) with standard domestic banking instruments. Consolidated on your corporate Airtel telecom account.',
    expiryDateText: 'Annual and multi-year corporate agreements available',
    redemptionUrl: 'https://www.airtel.in/business/workplace-solutions/',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Review employee licensing counts upon yearly renewal to optimize costs.',
    termsHighlights: [
      'Official Indian GST tax invoice with full Input Tax Credit eligibility',
      'Enterprise SLA with local Indian support representatives',
      'Seamless integration with Airtel fiber leased lines'
    ]
  },
  {
    id: 'google-one-ai-premium-trial',
    title: 'Google One AI Premium 1-Month Free Trial (Gemini Advanced + 2TB)',
    productSlug: 'gemini',
    productName: 'Gemini Advanced & Google One',
    category: 'free_trial',
    benefit: '1 month of Gemini Advanced reasoning models + 2 TB shared cloud storage at ₹0',
    summary: 'Promotional 1-month trial for new Google One AI Premium subscribers in India to test Gemini 2.0 Pro features, Canvas, deep research tools, and integrated AI inside Google Docs and Gmail.',
    eligibilityRequirements: [
      'Personal Google Accounts only (Workspace and managed education accounts are not eligible)',
      'Users who have not previously claimed a Google One AI Premium promotional trial',
      'Account holder must be at least 18 years of age in India'
    ],
    paymentDetailsRequired: true,
    paymentDetailsNote: 'Requires setting up an e-mandate payment method (UPI Autopay, Net Banking, or Credit/Debit Card) via Google Play Billing. Renews at ₹1,950/month automatically unless cancelled before the trial ends.',
    expiryDateText: 'Check Google One account portal for current availability',
    redemptionUrl: 'https://one.google.com/about/plans',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Cancellation can be done immediately after signing up through Google Play Subscriptions; trial benefits will remain active until the 30-day period concludes without incurring renewal charges.',
    termsHighlights: [
      'Storage (2 TB) is shareable with up to 5 family members, but Gemini Advanced model access is exclusive to the primary subscriber',
      'Requires active Google Play Billing in INR'
    ]
  },
  {
    id: 'google-workspace-14day-trial',
    title: 'Google Workspace 14-Day Free Business Trial',
    productSlug: 'google-workspace',
    productName: 'Google Workspace',
    category: 'business_workspace',
    benefit: '14-day full access to Business Starter, Standard, or Plus for up to 10 team members',
    summary: 'Official 14-day zero-cost trial for new business domains to configure professional email (@yourcompany.com), set up admin controls, and evaluate video conferencing and Drive storage.',
    eligibilityRequirements: [
      'Requires a custom domain name (e.g. yourcompany.in or yourcompany.com); you can bring your own or buy during setup',
      'New Google Workspace organization accounts',
      'Business contact in India'
    ],
    paymentDetailsRequired: true,
    paymentDetailsNote: 'Payment details must be entered during domain registration or setup. No charge occurs during the 14-day trial window. Cancel anytime via the Google Admin console before day 14 to avoid monthly billing.',
    expiryDateText: 'Standard official policy (14 days per new domain)',
    redemptionUrl: 'https://workspace.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Indian businesses can enter their GSTIN to claim input tax credit (ITC) on the 18% GST billed on subsequent invoices.',
    termsHighlights: [
      'Covers up to 10 user licenses during trial phase',
      'Full access to Google Meet recording, admin console, and custom DNS management'
    ]
  },
  {
    id: 'google-for-startups-cloud',
    title: 'Google for Startups Cloud Program (Up to $100,000+ Credits)',
    productSlug: 'google-cloud',
    productName: 'Google Cloud for Startups',
    category: 'startup_developer',
    benefit: 'Up to $100,000 USD in Google Cloud and Firebase credits for Series A and seed startups',
    summary: 'A formal mentorship and credit program for funded or affiliated Indian tech startups to offset cloud hosting, AI model training, and database infrastructure expenses.',
    eligibilityRequirements: [
      'Must be an incorporated technology startup founded within the last 5 years',
      'Not yet raised beyond Series A funding',
      'Associated with an approved accelerator, incubator, or venture capital partner in India (e.g. Surge, Blume, Indian Angel Network, T-Hub), or applying via the self-funded track (up to $2,000 credit)'
    ],
    paymentDetailsRequired: true,
    paymentDetailsNote: 'Requires an active Google Cloud Billing account linked to the startup legal entity in India.',
    expiryDateText: 'Year-round application review by Google Startups team',
    redemptionUrl: 'https://cloud.google.com/startup',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Applications are formally audited by Google. Credits cannot be resold, transferred, or converted to cash. Unused credits expire at 12 or 24 months.',
    termsHighlights: [
      'Includes dedicated technical office hours with Google Cloud engineers',
      'Google Workspace discount credits for the first year included in eligible tiers'
    ]
  },
  {
    id: 'google-workspace-education-fundamentals',
    title: 'Google Workspace for Education Fundamentals (Free for Qualifying Schools)',
    productSlug: 'google-workspace',
    productName: 'Google Workspace for Education',
    category: 'student_education',
    benefit: '100% free cloud collaboration suite, custom school domain emails, and Google Classroom',
    summary: 'Google provides accredited non-profit K-12 and higher educational institutions in India with free core cloud tools, Classroom gradebook, and student safety controls.',
    eligibilityRequirements: [
      'Accredited educational institution recognized by government bodies in India (CBSE, ICSE, State Boards, UGC, AICTE)',
      'School must own and control an official educational domain (e.g., .edu.in, .ac.in, or school domain)',
      'Must provide formal proof of accreditation and government non-profit status during verification'
    ],
    paymentDetailsRequired: false,
    paymentDetailsNote: 'No payment details or credit cards required for Education Fundamentals.',
    expiryDateText: 'Permanent program for accredited educational institutions',
    redemptionUrl: 'https://edu.google.com/workspace-for-education/editions/overview/',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Individual students cannot apply directly; the application must be submitted by the authorized IT administration of the school or university.',
    termsHighlights: [
      '100 TB of pooled cloud storage shared across the entire school institution',
      'Compliance with student privacy and zero commercial ad-targeting policies'
    ]
  },
  {
    id: 'google-maps-monthly-credit',
    title: 'Google Maps Platform $200 Recurring Monthly Credit',
    productSlug: 'google-maps',
    productName: 'Google Maps Platform',
    category: 'startup_developer',
    benefit: '$200 USD equivalent in free API usage refreshed every month automatically',
    summary: 'Every registered Google Cloud billing account receives a recurring $200 credit applied to Google Maps Platform APIs each month, covering thousands of map loads, places lookups, or directions queries.',
    eligibilityRequirements: [
      'Active Google Cloud billing account with API keys enabled for Maps Platform',
      'Available to developers and businesses in India'
    ],
    paymentDetailsRequired: true,
    paymentDetailsNote: 'Requires credit or debit card on file for billing setup. Charges only occur if monthly API volume exceeds the $200 free allowance.',
    expiryDateText: 'Refreshed on the 1st of every calendar month',
    redemptionUrl: 'https://mapsplatform.google.com/pricing/',
    lastVerifiedDate: 'October 2026',
    status: 'verified',
    cautionNotes: 'Ensure you set API budget alerts and HTTP referrer restrictions on your API keys so unauthorized websites cannot consume your quota.',
    termsHighlights: [
      'Covers approximately 28,500 static map loads or 28,500 dynamic web map loads monthly',
      'Unused balance does not accumulate or roll over to the following month'
    ]
  }
];
