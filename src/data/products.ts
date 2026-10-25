import { GOOGLE_CLOUD_PRODUCTS } from './googleCloudProducts';
import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'gemini',
    slug: 'gemini',
    name: 'Gemini',
    category: 'AI & Generative AI',
    tagline: 'Google’s next-generation conversational AI assistant with multimodal reasoning',
    summary: 'Gemini is Google’s primary AI assistant designed for multimodal reasoning across text, code, audio, image, and video understanding. It is available in a free tier (powered by Gemini Flash models) and a paid Gemini Advanced tier (via Google One AI Premium).',
    description: [
      'Gemini helps users brainstorm, draft complex emails, write and debug software code, analyze uploaded documents, and generate creative imagery.',
      'Through Google One AI Premium, Gemini Advanced unlocks Google’s largest reasoning models with a larger context window, priority access to new multimodal features, and deep integration into Gmail, Google Docs, Slides, and Sheets.'
    ],
    keyFeatures: [
      'Multimodal input: process text, images, voice notes, PDFs, and spreadsheets',
      'Integration with Google apps: pull flight, maps, YouTube, and Drive context via extensions',
      'Canvas workspace for real-time code and writing iteration',
      'Custom Gems: create specialized custom AI personas with distinct instructions',
      'Audio & Live voice conversational mode on mobile'
    ],
    typicalUseCases: [
      'Drafting long-form essays, executive summaries, and pitch decks',
      'Translating and summarizing dense documents and PDF reports',
      'Writing Python, JavaScript, and SQL scripts with step-by-step code explanations',
      'Daily personal organization, meal planning, and travel itinerary drafting'
    ],
    intendedAudience: ['General Public', 'Students', 'Professionals', 'Creators', 'Developers'],
    platforms: ['Web', 'Android', 'iOS'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Free standard version; Gemini Advanced available via Google One AI Premium plan.',
    verifiedPricingInINR: 'Free tier available; Gemini Advanced is included with Google One AI Premium at ₹1,950/month (with frequent 1-month free trial promotions for new users in India).',
    verifiedPricingInUSD: 'Free tier available; Gemini Advanced at $19.99/month via Google One AI Premium.',
    pricingNotes: 'Subject to regional taxes and Google One promotional trials. Free tier has generous daily rate limits.',
    officialUrl: 'https://gemini.google.com',
    officialPricingUrl: 'https://one.google.com/about/plans',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: true,
    iconName: 'Sparkles',
    relatedProductSlugs: ['notebooklm', 'google-ai-studio', 'google-workspace', 'google-docs'],
    relatedTutorialSlugs: ['getting-started-with-gemini', 'free-vs-paid-plans']
  },
  {
    id: 'notebooklm',
    slug: 'notebooklm',
    name: 'NotebookLM',
    category: 'AI & Generative AI',
    tagline: 'Personalized AI research assistant grounded strictly in your curated sources',
    summary: 'NotebookLM is a specialized research and note-taking tool that grounds Gemini’s reasoning entirely in your uploaded sources—documents, PDFs, Google Slides, web links, and YouTube transcripts—eliminating hallucinations and providing clickable citations.',
    description: [
      'Unlike general-purpose chatbots that pull from the entire open web, NotebookLM functions as your thinking partner that only answers from the specific notes, papers, books, or transcripts you provide.',
      'One of its standout breakthrough features is Audio Overview, which synthesizes your uploaded materials into a remarkably natural, conversational podcast-style discussion between two AI co-hosts.'
    ],
    keyFeatures: [
      'Strict source-grounded answers with inline clickable footnote citations',
      'Support for PDFs, Google Docs, Google Slides, web URLs, markdown, and copied text',
      'Audio Overview: generates two-host conversational podcast summaries of your materials',
      'Auto-generated study guides, briefing documents, FAQs, timelines, and glossaries',
      'Zero training on personal data: your private sources are not used to train Google models'
    ],
    typicalUseCases: [
      'University students synthesizing lecture slides, syllabus, and textbook chapters',
      'Legal and compliance teams reviewing contracts, policies, and regulatory filings',
      'Product managers consolidating customer interview transcripts and feature specs',
      'Authors and podcasters organizing deep background research and character notes'
    ],
    intendedAudience: ['Students', 'Educators', 'Professionals', 'Creators'],
    platforms: ['Web'],
    pricingStatus: 'free',
    pricingOverview: 'Currently free to use for personal Google accounts and Workspace users with administrator enablement.',
    verifiedPricingInINR: 'Free (no credit card or paid subscription required). NotebookLM Business preview options available through Workspace.',
    verifiedPricingInUSD: 'Free of charge for standard individual Google accounts.',
    pricingNotes: 'Subject to per-notebook source upload limits (up to 50 sources per notebook, 500,000 words per source).',
    officialUrl: 'https://notebooklm.google.com',
    officialPricingUrl: 'https://notebooklm.google.com',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: true,
    iconName: 'BookOpen',
    relatedProductSlugs: ['gemini', 'google-ai-studio', 'google-docs', 'google-drive'],
    relatedTutorialSlugs: ['using-notebooklm', 'getting-started-with-gemini']
  },
  {
    id: 'google-ai-studio',
    slug: 'google-ai-studio',
    name: 'Google AI Studio',
    category: 'Developer Tools',
    tagline: 'The fastest, web-based prototyping environment for developer access to Gemini API',
    summary: 'Google AI Studio is a developer workbench to prototype prompts, experiment with multimodal capabilities, configure system instructions, and generate production code snippets in Python, TypeScript/JavaScript, cURL, and Swift.',
    description: [
      'AI Studio provides direct access to Google’s latest Gemini Flash and Gemini Pro models with up to a 2-million-token context window.',
      'Developers can test temperature, Top-P, Safety settings, structured JSON outputs, function calling, and system instructions before getting an API key and exporting to production code.'
    ],
    keyFeatures: [
      'Free tier for developers with generous rate limits per minute',
      'Massive multimodal context: upload hours of audio, video, PDFs, or whole codebases',
      'Structured JSON schema enforcement and Function Calling testing UI',
      'Instant code export into @google/genai SDK for Python, Node.js, and REST',
      'System instructions editor and prompt library management'
    ],
    typicalUseCases: [
      'Testing prompt engineering and reasoning behavior across model iterations',
      'Evaluating large document extraction with 1M+ token context windows',
      'Generating API keys to integrate Gemini into web, mobile, and backend apps',
      'Fine-tuning and few-shot prompt prototyping with sample input/output pairs'
    ],
    intendedAudience: ['Developers', 'Small Businesses', 'Enterprises'],
    platforms: ['Web', 'API'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Free tier available with rate limits; Pay-As-You-Go billing via Google Cloud project.',
    verifiedPricingInINR: 'Free tier with rate limits (RPM/TPM). Pay-as-you-go billing billed in INR via Google Cloud Platform billing accounts.',
    verifiedPricingInUSD: 'Free tier available (prompts used to improve Google products on free tier); Paid tier billed per 1M tokens (Flash ~$0.075 / 1M input tokens).',
    pricingNotes: 'Developers can use the free tier without adding credit card in countries where free quota is enabled.',
    officialUrl: 'https://aistudio.google.com',
    officialPricingUrl: 'https://ai.google.dev/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: true,
    iconName: 'Code',
    relatedProductSlugs: ['gemini', 'google-antigravity', 'google-cloud', 'google-colab'],
    relatedTutorialSlugs: ['getting-started-with-google-ai-studio', 'getting-started-with-gemini']
  },
  {
    id: 'google-antigravity',
    slug: 'google-antigravity',
    name: 'Google Antigravity',
    category: 'Developer Tools',
    tagline: 'Advanced agentic AI development environment and autonomous coding workflows',
    summary: 'Google Antigravity is Google’s agentic framework and developer workspace designed for autonomous multi-step reasoning, tool execution, and end-to-end full-stack software development workflows.',
    description: [
      'Antigravity represents Google’s forward-looking agentic developer platform, combining multimodal Gemini intelligence with persistent execution sandboxes, tool integration, and verified code delivery.',
      'It empowers developers to delegate multi-file architectural refactoring, automated testing, and cloud infrastructure deployment.'
    ],
    keyFeatures: [
      'Autonomous agent execution with chain-of-thought verification',
      'Deep integration with developer tools and cloud deployment environments',
      'Native tool orchestration (compiler, linter, bash runtime, git)',
      'Secure sandboxed workspace execution for safe code evaluation'
    ],
    typicalUseCases: [
      'Automated bug triage, regression debugging, and unit test generation',
      'Scaffolding full-stack TypeScript and Python applications from specifications',
      'Executing multi-step cloud migrations and architectural modernizations'
    ],
    intendedAudience: ['Developers', 'Enterprises'],
    platforms: ['Web', 'API'],
    pricingStatus: 'varies',
    pricingOverview: 'Developer preview / enterprise tier managed through Google Cloud and AI Studio developer access.',
    verifiedPricingInINR: 'Check official website for developer preview availability and Google Cloud project quotas.',
    verifiedPricingInUSD: 'Preview access tied to Gemini API interactions and Cloud billing quotas.',
    pricingNotes: 'Access rules and rollout availability vary by developer region.',
    officialUrl: 'https://deepmind.google/technologies/gemini',
    officialPricingUrl: 'https://ai.google.dev',
    lastVerifiedDate: 'October 2026',
    isPopular: false,
    isFeaturedAI: true,
    iconName: 'Cpu',
    relatedProductSlugs: ['google-ai-studio', 'gemini', 'google-cloud'],
    relatedTutorialSlugs: ['getting-started-with-google-ai-studio']
  },
  {
    id: 'google-workspace',
    slug: 'google-workspace',
    name: 'Google Workspace',
    category: 'Business Tools',
    tagline: 'All-in-one cloud productivity suite with professional custom email and collaboration tools',
    summary: 'Google Workspace (formerly G Suite) provides businesses, schools, and organizations with custom business email (@yourcompany.com), cloud storage in Google Drive, Meet video conferencing, and the full Docs editors suite with enterprise security and admin management.',
    description: [
      'Workspace is the primary business offering from Google, used by millions of startups, SMBs, and Fortune 500 enterprises around the world.',
      'Plans scale from Business Starter (30GB pooled storage, 100-participant Meet) up to Business Plus (5TB storage, 500-participant Meet with recording and attendance tracking, advanced endpoint management).'
    ],
    keyFeatures: [
      'Custom professional domain email (you@yourdomain.com) with Spam and Phishing protection',
      'Centralized Admin Console for user provisioning, 2FA enforcement, and device security',
      'Pooled Google Drive storage across the organization',
      'Google Meet with breakout rooms, noise cancellation, and automated recording',
      'Shared Team Drives with granular role-based file access permissions'
    ],
    typicalUseCases: [
      'Deploying secure company email and calendar for teams from 1 to 300+ employees',
      'Real-time collaborative document authoring and spreadsheet modeling',
      'Holding client video conferences and company-wide all-hands presentations'
    ],
    intendedAudience: ['Small Businesses', 'Enterprises', 'Educators', 'Professionals'],
    platforms: ['Web', 'Android', 'iOS', 'Windows', 'macOS', 'ChromeOS'],
    pricingStatus: 'trial',
    pricingOverview: '14-day official free trial available; paid tiers charged per user per month.',
    verifiedPricingInINR: 'Official standard India rates start at approximately ₹136 - ₹160/user/month for Business Starter (frequently discounted for the first 12 months for new domains), ₹672 - ₹780/user/month for Business Standard, and ₹1,360/user/month for Business Plus (excluding GST).',
    verifiedPricingInUSD: 'Business Starter at $6/user/mo, Business Standard at $12/user/mo, Business Plus at $18/user/mo with 1-year commitment.',
    pricingNotes: 'Requires owning a domain name. 18% GST applies to Indian business billing accounts unless valid GSTIN is provided.',
    officialUrl: 'https://workspace.google.com',
    officialPricingUrl: 'https://workspace.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Briefcase',
    relatedProductSlugs: ['gmail', 'google-drive', 'google-docs', 'google-meet'],
    relatedTutorialSlugs: ['creating-business-email-workspace', 'free-vs-paid-plans']
  },
  {
    id: 'gmail',
    slug: 'gmail',
    name: 'Gmail',
    category: 'Email & Communication',
    tagline: 'The world’s most widely used secure, fast, and feature-rich email service',
    summary: 'Gmail delivers AI-powered inbox filtering, anti-spam protection, integrated Google Meet video calling, and 15GB of free shared storage across Google services.',
    description: [
      'Launched in 2004, Gmail redefined email with searchable web mail, threaded conversations, and high-capacity storage.',
      'Today, Gmail blocks over 99.9% of spam, phishing, and malware attacks, while offering Smart Compose, confidential mode, and scheduling features.'
    ],
    keyFeatures: [
      '15 GB shared free cloud storage (across Gmail, Drive, and Photos)',
      'Industry-leading spam, phishing, and malware machine-learning filtering',
      'Smart Compose and Smart Reply suggestions for rapid drafting',
      'Built-in Meet video calls, Google Chat, and Spaces integration',
      'Confidential mode with passcode verification and expiration dates'
    ],
    typicalUseCases: [
      'Personal email communication and newsletter management',
      'Two-factor authentication hub for digital services and web accounts',
      'Organizing correspondence with labels, filters, and priority inboxes'
    ],
    intendedAudience: ['General Public', 'Students', 'Professionals', 'Small Businesses'],
    platforms: ['Web', 'Android', 'iOS'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Free 15 GB for personal accounts; custom domain accounts available via Google Workspace.',
    verifiedPricingInINR: 'Free for personal @gmail.com accounts. Extra storage available via Google One starting at ₹130/month (100 GB).',
    verifiedPricingInUSD: 'Free for personal accounts. Google One storage upgrades start at $1.99/month for 100GB.',
    pricingNotes: 'Storage is shared across Gmail, Google Drive, and Google Photos.',
    officialUrl: 'https://mail.google.com',
    officialPricingUrl: 'https://one.google.com/about/plans',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Mail',
    relatedProductSlugs: ['google-workspace', 'google-drive', 'google-calendar', 'google-meet'],
    relatedTutorialSlugs: ['creating-business-email-workspace', 'free-vs-paid-plans']
  },
  {
    id: 'google-drive',
    slug: 'google-drive',
    name: 'Google Drive',
    category: 'Cloud Storage & Files',
    tagline: 'Secure cloud storage and seamless file sharing with built-in search and collaboration',
    summary: 'Google Drive is cloud storage that lets you store, access, and share files from any device with granular permissions, version history, and integrated Docs editing.',
    description: [
      'Google Drive provides 15 GB of free cloud storage shared across your Google Account. It seamlessly previews over 100 file types including PDFs, CAD, video, and Microsoft Office documents without requiring third-party software.',
      'Paid consumer upgrades are managed through Google One (100GB, 200GB, 2TB, and 2TB AI Premium), while businesses use Google Workspace for shared drives.'
    ],
    keyFeatures: [
      '15 GB free cloud storage included with every Google Account',
      'Granular link sharing: Viewer, Commenter, or Editor permissions with expiry dates',
      'Optical Character Recognition (OCR) to search text inside scanned PDFs and images',
      'Google Drive for Desktop client to sync local folders and stream files on demand',
      'Comprehensive version history with 30-day file recovery'
    ],
    typicalUseCases: [
      'Backing up photos, tax records, academic thesis papers, and video projects',
      'Sharing large zip archives and design assets with clients without email attachment limits',
      'Collaborative file repositories for distributed remote teams'
    ],
    intendedAudience: ['General Public', 'Students', 'Professionals', 'Small Businesses', 'Enterprises'],
    platforms: ['Web', 'Android', 'iOS', 'Windows', 'macOS', 'ChromeOS'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Free 15 GB storage; Google One consumer plans scale from 100 GB to 30 TB.',
    verifiedPricingInINR: 'Free: 15 GB. Google One: Basic 100 GB at ₹130/mo (₹1,300/yr), Standard 200 GB at ₹210/mo, Premium 2 TB at ₹650/mo. Frequent discount offers for annual upfront payments.',
    verifiedPricingInUSD: 'Free: 15 GB. 100 GB at $1.99/mo, 200 GB at $2.99/mo, 2 TB at $9.99/mo.',
    pricingNotes: 'Google One subscriptions can be shared with up to 5 family members at no extra cost.',
    officialUrl: 'https://drive.google.com',
    officialPricingUrl: 'https://one.google.com/about/plans',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'HardDrive',
    relatedProductSlugs: ['google-docs', 'google-photos', 'google-workspace', 'gmail'],
    relatedTutorialSlugs: ['using-drive-to-share-files', 'free-vs-paid-plans']
  },
  {
    id: 'google-docs',
    slug: 'google-docs',
    name: 'Google Docs',
    category: 'Productivity & Office',
    tagline: 'Real-time collaborative cloud word processor with smart chips and revision history',
    summary: 'Google Docs is an online word processor that allows multiple users to edit, comment, and suggest changes simultaneously with complete revision tracking and formatting tools.',
    description: [
      'Google Docs revolutionized collaborative writing by bringing documents entirely to the cloud with zero saving required.',
      'It supports smart chips (linking people, calendar events, files, dropdowns), pageless layouts, voice typing, and export to PDF, DOCX, EPUB, and HTML.'
    ],
    keyFeatures: [
      'Simultaneous multi-user collaboration with live cursor presence and comments',
      'Smart Canvas: @-mention people, files, checklists, and dates seamlessly',
      'Pageless formatting mode for uninterrupted digital reading and web writing',
      'Native Microsoft Word (.docx) editing and two-way lossless export',
      'Offline editing support via Chrome extension'
    ],
    typicalUseCases: [
      'Writing collaborative meeting agendas, project briefs, and strategy documents',
      'Reviewing and commenting on academic papers and student essays',
      'Drafting blog posts, press releases, and articles with editorial teams'
    ],
    intendedAudience: ['General Public', 'Students', 'Professionals', 'Educators', 'Creators'],
    platforms: ['Web', 'Android', 'iOS', 'ChromeOS'],
    pricingStatus: 'free',
    pricingOverview: 'Completely free for individual Google account holders; included in Google Workspace.',
    verifiedPricingInINR: 'Free for personal use. Business management via Google Workspace starting at ₹136/user/month.',
    verifiedPricingInUSD: 'Free for individuals. Workspace business plans from $6/user/month.',
    pricingNotes: 'Does not count against your Google Drive storage limit for the doc file itself.',
    officialUrl: 'https://docs.google.com',
    officialPricingUrl: 'https://workspace.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'FileText',
    relatedProductSlugs: ['google-sheets', 'google-slides', 'google-drive', 'gemini'],
    relatedTutorialSlugs: ['using-drive-to-share-files', 'getting-started-with-gemini']
  },
  {
    id: 'google-sheets',
    slug: 'google-sheets',
    name: 'Google Sheets',
    category: 'Productivity & Office',
    tagline: 'Cloud-first spreadsheets with live collaboration, pivot tables, and connected data',
    summary: 'Google Sheets is an online spreadsheet tool built for live data analysis, financial modeling, charts, pivot tables, and automated workflows using Google Apps Script.',
    description: [
      'Google Sheets provides hundreds of formulas, interactive dashboards, and cloud integrations. It allows teams to work on the same numbers together without version mismatch.',
      'Through Connected Sheets, users can analyze billions of rows of live BigQuery data directly from a spreadsheet interface.'
    ],
    keyFeatures: [
      '400+ built-in spreadsheet functions including QUERY, FILTER, and GOOGLEFINANCE',
      'Connected Sheets: query billions of rows from Google BigQuery in real time',
      'Interactive Pivot tables, slicers, sparklines, and dynamic chart visualizations',
      'Automation with Google Apps Script (JavaScript) and macros',
      'Conditional formatting, data validation dropdowns, and protected cell ranges'
    ],
    typicalUseCases: [
      'Financial budgeting, expense tracking, and sales pipeline projections',
      'Managing inventory lists, customer CRM leads, and project milestones',
      'Live stock market tracking using the GOOGLEFINANCE formula'
    ],
    intendedAudience: ['Professionals', 'Small Businesses', 'Students', 'Developers'],
    platforms: ['Web', 'Android', 'iOS', 'ChromeOS'],
    pricingStatus: 'free',
    pricingOverview: 'Free for personal accounts; enterprise compliance and larger sheets via Workspace.',
    verifiedPricingInINR: 'Free for all personal users. Business plans via Google Workspace.',
    verifiedPricingInUSD: 'Free for individuals. Business plans via Google Workspace.',
    pricingNotes: 'Up to 10 million cells per spreadsheet.',
    officialUrl: 'https://sheets.google.com',
    officialPricingUrl: 'https://workspace.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Table',
    relatedProductSlugs: ['google-docs', 'google-slides', 'google-forms', 'bigquery'],
    relatedTutorialSlugs: ['free-vs-paid-plans']
  },
  {
    id: 'google-slides',
    slug: 'google-slides',
    name: 'Google Slides',
    category: 'Productivity & Office',
    tagline: 'Dynamic presentation maker with collaborative slide drafting and presenter tools',
    summary: 'Google Slides is a web-based presentation platform for designing decks, pitch decks, and lecture slides with real-time feedback, transitions, and Google Meet streaming.',
    description: [
      'Google Slides simplifies pitching and lecturing with customizable templates, embedded YouTube videos, animations, and speaker notes.',
      'Presenters can launch Live Q&A sessions to collect questions from the audience directly on screen.'
    ],
    keyFeatures: [
      'Real-time collaborative editing with live audience Q&A interaction tool',
      'Full compatibility with Microsoft PowerPoint (.pptx) import and export',
      'Direct presentation streaming to Google Meet with presenter notes preview',
      'Extensive library of professionally designed templates and diagram graphics'
    ],
    typicalUseCases: [
      'Creating startup investor pitch decks and product roadmap presentations',
      'Classroom lectures and student group project presentations',
      'Sales decks and client proposals'
    ],
    intendedAudience: ['Students', 'Professionals', 'Educators', 'Creators'],
    platforms: ['Web', 'Android', 'iOS', 'ChromeOS'],
    pricingStatus: 'free',
    pricingOverview: 'Free for personal Google accounts; included in Google Workspace.',
    verifiedPricingInINR: 'Free for individuals.',
    verifiedPricingInUSD: 'Free for individuals.',
    pricingNotes: 'Free cloud storage allocation handles hundreds of presentations.',
    officialUrl: 'https://slides.google.com',
    officialPricingUrl: 'https://workspace.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Presentation',
    relatedProductSlugs: ['google-docs', 'google-sheets', 'google-meet'],
    relatedTutorialSlugs: ['using-drive-to-share-files']
  },
  {
    id: 'google-meet',
    slug: 'google-meet',
    name: 'Google Meet',
    category: 'Email & Communication',
    tagline: 'Secure, high-definition video conferencing for teams, classrooms, and family calls',
    summary: 'Google Meet provides browser-based, encrypted video meetings with live captions, screen sharing, background blur, and noise cancellation.',
    description: [
      'With no client software download required for desktop browsers, Google Meet enables joining meetings with a single web link.',
      'Free personal accounts can host meetings with up to 100 participants for up to 60 minutes. Workspace plans extend this to 24-hour meetings with up to 500 participants and automated recording.'
    ],
    keyFeatures: [
      'No download required: join directly from modern browsers with one click',
      'Real-time live multilingual captions powered by Google speech recognition',
      'AI background noise cancellation and virtual studio lighting',
      'Breakout rooms, polling, Q&A, and cloud recording to Google Drive (Workspace)'
    ],
    typicalUseCases: [
      'Remote team daily standups and cross-company partner calls',
      'Online school classes, tutoring sessions, and webinar presentations',
      'Quick catch-ups with friends and family members on mobile or desktop'
    ],
    intendedAudience: ['General Public', 'Professionals', 'Students', 'Small Businesses'],
    platforms: ['Web', 'Android', 'iOS'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Free tier: up to 100 participants, 60 minutes group calls. Unlimited 1-on-1 calls.',
    verifiedPricingInINR: 'Free tier available. Extended durations and recording available via Google One Premium (₹650/mo) or Google Workspace.',
    verifiedPricingInUSD: 'Free tier for standard meetings. Premium features in Google One ($9.99/mo) and Workspace ($6+/mo).',
    pricingNotes: '1-on-1 calls are free up to 24 hours. Group calls of 3+ people are capped at 60 mins on free tier.',
    officialUrl: 'https://meet.google.com',
    officialPricingUrl: 'https://workspace.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Video',
    relatedProductSlugs: ['google-calendar', 'gmail', 'google-workspace'],
    relatedTutorialSlugs: ['creating-business-email-workspace']
  },
  {
    id: 'google-calendar',
    slug: 'google-calendar',
    name: 'Google Calendar',
    category: 'Productivity & Office',
    tagline: 'Smart time management, meeting scheduling, and team availability coordination',
    summary: 'Google Calendar helps individuals and teams schedule meetings, share calendars, manage booking pages, and sync across all mobile and desktop devices.',
    description: [
      'Integrated with Gmail, Calendar automatically extracts flight reservations, hotel bookings, and restaurant tables into your schedule.',
      'For professionals, it provides built-in Appointment Scheduling pages that let clients book time directly without requiring third-party tools like Calendly.'
    ],
    keyFeatures: [
      'Smart event detection from incoming Gmail confirmations and tickets',
      'Shareable Appointment Scheduling booking pages with buffer times and payment options',
      'Working hours and location settings (Home vs Office) for remote teams',
      'Color-coded multiple calendars for personal, work, and shared family events'
    ],
    typicalUseCases: [
      'Organizing daily schedule, blocking focus time, and setting recurring habits',
      'Sharing client booking links for freelance consultations or interview scheduling',
      'Tracking team holidays and departmental leave calendars'
    ],
    intendedAudience: ['General Public', 'Professionals', 'Students', 'Small Businesses'],
    platforms: ['Web', 'Android', 'iOS'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Free for personal use. Premium appointment schedules and team resources in Workspace.',
    verifiedPricingInINR: 'Free for personal accounts. Business calendaring included in Google Workspace.',
    verifiedPricingInUSD: 'Free for individuals. Workspace upgrades from $6/mo.',
    pricingNotes: 'Available on all Android phones by default.',
    officialUrl: 'https://calendar.google.com',
    officialPricingUrl: 'https://workspace.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Calendar',
    relatedProductSlugs: ['google-meet', 'gmail', 'google-workspace'],
    relatedTutorialSlugs: ['creating-business-email-workspace']
  },
  {
    id: 'google-forms',
    slug: 'google-forms',
    name: 'Google Forms',
    category: 'Productivity & Office',
    tagline: 'Simple, free online surveys, feedback forms, and graded quizzes',
    summary: 'Google Forms lets anyone create custom questionnaires, event registrations, and automatic quizzes with instant live response charts and direct Google Sheets sync.',
    description: [
      'Whether gathering customer feedback, planning weddings, or running classroom quizzes, Google Forms offers intuitive drag-and-drop form creation with conditional question branching.',
      'Responses are collected in real-time with automatic graphical breakdowns and live synchronization to Google Sheets.'
    ],
    keyFeatures: [
      'Multiple question types: short answer, paragraphs, multiple choice, scales, and file uploads',
      'Conditional logic branching: send respondents to specific sections based on answers',
      'Quiz mode with automatic answer grading and instant student feedback',
      'Real-time automated sync with a linked Google Sheets spreadsheet'
    ],
    typicalUseCases: [
      'Collecting customer feedback, NPS scores, and event registrations',
      'Creating graded academic quizzes and test surveys for students',
      'Internal team order requests and HR onboarding surveys'
    ],
    intendedAudience: ['Educators', 'Students', 'Small Businesses', 'General Public'],
    platforms: ['Web'],
    pricingStatus: 'free',
    pricingOverview: '100% free with unlimited responses for personal Google accounts.',
    verifiedPricingInINR: 'Free forever for personal use.',
    verifiedPricingInUSD: 'Free of charge.',
    pricingNotes: 'File upload fields require respondents to sign in with a Google account to upload into form owner’s Drive.',
    officialUrl: 'https://forms.google.com',
    officialPricingUrl: 'https://forms.google.com',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'ClipboardCheck',
    relatedProductSlugs: ['google-sheets', 'google-docs', 'google-workspace'],
    relatedTutorialSlugs: ['free-vs-paid-plans']
  },
  {
    id: 'google-cloud',
    slug: 'google-cloud',
    name: 'Google Cloud Platform (GCP)',
    category: 'Cloud Computing',
    tagline: 'Scalable infrastructure, serverless compute, AI, BigQuery, and enterprise cloud solutions',
    summary: 'Google Cloud Platform delivers global enterprise cloud infrastructure spanning virtual machines, managed Kubernetes (GKE), serverless compute (Cloud Run), and advanced AI/BigData tools.',
    description: [
      'GCP runs on the same reliable, secure infrastructure that powers Google’s billion-user products like Search and YouTube.',
      'New customers receive $300 in free credits to explore over 150 cloud services, and over 20 core products feature a permanent Always Free tier.'
    ],
    keyFeatures: [
      'Cloud Run: deploy containerized web apps and microservices with automatic scaling to zero',
      'Google Kubernetes Engine (GKE): industry standard managed enterprise Kubernetes',
      'Vertex AI: unified enterprise ML platform for model training, tuning, and deployment',
      'Global fiber network with VPC peering, Cloud CDN, and DDoS protection'
    ],
    typicalUseCases: [
      'Hosting production web applications, SaaS backends, and mobile APIs',
      'Building automated data ingestion pipelines and machine learning pipelines',
      'Enterprise multi-region disaster recovery and hybrid-cloud infrastructure'
    ],
    intendedAudience: ['Developers', 'Enterprises', 'Small Businesses'],
    platforms: ['Web', 'API'],
    pricingStatus: 'free_tier',
    pricingOverview: '$300 free trial for 90 days; 20+ services on the Always Free tier; pay-as-you-go.',
    verifiedPricingInINR: '₹24,000+ ($300 equivalent) in free credits for 90 days for new signups. Invoices generated in INR with local Indian bank cards and GST compliance.',
    verifiedPricingInUSD: '$300 free credit trial for new customers over 90 days; pay-as-you-go thereafter.',
    pricingNotes: 'Requires valid credit card or debit card for identity verification; no automatic charges during initial $300 trial period.',
    officialUrl: 'https://cloud.google.com',
    officialPricingUrl: 'https://cloud.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Server',
    relatedProductSlugs: ['firebase', 'bigquery', 'google-ai-studio'],
    relatedTutorialSlugs: ['discovering-eligible-offers-india']
  },
  {
    id: 'firebase',
    slug: 'firebase',
    name: 'Firebase',
    category: 'Developer Tools',
    tagline: 'Complete app development platform with Firestore, Auth, Hosting, and Cloud Functions',
    summary: 'Firebase provides backend infrastructure that lets frontend developers build web and mobile apps rapidly without managing server operations.',
    description: [
      'Acquired and developed by Google, Firebase powers hundreds of thousands of popular mobile apps and web platforms.',
      'Its generous Spark plan is permanently free, offering Cloud Firestore NoSQL database, Firebase Authentication, SSL-secured web hosting, and Crashlytics.'
    ],
    keyFeatures: [
      'Cloud Firestore: flexible, scalable NoSQL database with realtime listeners and offline sync',
      'Firebase Authentication: pre-built drop-in authentication for Email, Google, Apple, and SMS',
      'Firebase Hosting: fast, production-grade SSD web hosting with free global SSL certificate',
      'Cloud Functions: serverless event-driven Node.js/Python backend functions'
    ],
    typicalUseCases: [
      'Rapid MVP development for web and mobile startups in React, Flutter, and iOS/Android',
      'Real-time collaborative applications like chat, live counters, and games',
      'User authentication and authorization management'
    ],
    intendedAudience: ['Developers', 'Small Businesses'],
    platforms: ['Web', 'Android', 'iOS', 'API'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Spark Plan (Free forever); Blaze Plan (Pay as you go with Spark tier free allowances included).',
    verifiedPricingInINR: 'Generous Spark plan is completely free without credit card. Blaze plan pay-as-you-go billed via Google Cloud in INR.',
    verifiedPricingInUSD: 'Spark plan free. Blaze pay-as-you-go: e.g. Firestore $0.06 / 100K reads after 50K daily free reads.',
    pricingNotes: 'Always verify daily free allowances (50K reads, 20K writes/day on Firestore) before upgrading to Blaze.',
    officialUrl: 'https://firebase.google.com',
    officialPricingUrl: 'https://firebase.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Flame',
    relatedProductSlugs: ['google-cloud', 'google-ai-studio'],
    relatedTutorialSlugs: ['getting-started-with-google-ai-studio']
  },
  {
    id: 'google-analytics',
    slug: 'google-analytics',
    name: 'Google Analytics (GA4)',
    category: 'Analytics & Marketing',
    tagline: 'Next-generation event-based measurement across websites and apps',
    summary: 'Google Analytics 4 gives businesses insights into how visitors discover and interact with their websites and mobile apps using privacy-centric machine learning.',
    description: [
      'GA4 is the industry standard for digital web analytics, utilizing an event-based data model rather than legacy session-based tracking.',
      'It includes predictive analytics, churn modeling, BigQuery export integration, and deep interoperability with Google Ads.'
    ],
    keyFeatures: [
      'Event-based tracking architecture unifying mobile app and web traffic',
      'Native free export of raw analytics data to Google BigQuery',
      'Machine learning predictive metrics (e.g., purchase probability and churn risk)',
      'Cross-platform conversion attribution modeling and funnel exploration'
    ],
    typicalUseCases: [
      'Measuring digital marketing campaign ROI and conversion rates',
      'Understanding visitor drop-off points in e-commerce checkout funnels',
      'Audience segmentation for remarketing on Google Ads'
    ],
    intendedAudience: ['Professionals', 'Small Businesses', 'Enterprises', 'Creators'],
    platforms: ['Web', 'Android', 'iOS', 'API'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Standard GA4 is free for most websites; Analytics 360 is an enterprise paid tier.',
    verifiedPricingInINR: 'Standard GA4 is completely free for standard websites and apps. Analytics 360 enterprise tier requires custom sales quote.',
    verifiedPricingInUSD: 'Standard GA4 is free. Analytics 360 starts at enterprise tier pricing.',
    pricingNotes: 'Free tier easily supports millions of monthly events for typical commercial sites.',
    officialUrl: 'https://analytics.google.com',
    officialPricingUrl: 'https://marketingplatform.google.com/about/analytics/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'BarChart2',
    relatedProductSlugs: ['google-search-console', 'google-ads', 'looker-studio', 'bigquery'],
    relatedTutorialSlugs: ['free-vs-paid-plans']
  },
  {
    id: 'google-search-console',
    slug: 'google-search-console',
    name: 'Google Search Console',
    category: 'Search & Research',
    tagline: 'Official search performance diagnostics and index management directly from Google',
    summary: 'Google Search Console helps webmasters and developers measure organic search traffic, identify indexing issues, inspect URLs, and optimize search visibility.',
    description: [
      'Search Console is an essential, 100% free web service provided by Google to understand how Googlebot crawls, indexes, and ranks your web properties.',
      'It alerts website owners to mobile usability issues, Core Web Vitals performance, indexing errors, and manual security penalties.'
    ],
    keyFeatures: [
      'Performance reporting: impressions, organic clicks, CTR, and average keyword positions',
      'URL Inspection tool to see how Googlebot renders specific pages',
      'Sitemap submission and index coverage error diagnostics',
      'Core Web Vitals and mobile usability report tracking'
    ],
    typicalUseCases: [
      'SEO audit: identifying high-ranking keywords and pages losing traffic',
      'Troubleshooting indexing and crawl errors for newly published content',
      'Ensuring web security and checking for malware or hacked status warnings'
    ],
    intendedAudience: ['Developers', 'Small Businesses', 'Creators', 'Professionals'],
    platforms: ['Web'],
    pricingStatus: 'free',
    pricingOverview: '100% free tool provided by Google for all verified website owners.',
    verifiedPricingInINR: 'Free forever. No credit card or paid tier exists.',
    verifiedPricingInUSD: 'Completely free service.',
    pricingNotes: 'Requires domain ownership or DNS/HTML tag verification to access data.',
    officialUrl: 'https://search.google.com/search-console',
    officialPricingUrl: 'https://search.google.com/search-console',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Search',
    relatedProductSlugs: ['google-analytics', 'looker-studio'],
    relatedTutorialSlugs: ['free-vs-paid-plans']
  },
  {
    id: 'google-maps',
    slug: 'google-maps',
    name: 'Google Maps & Maps Platform',
    category: 'Maps & Location',
    tagline: 'World-leading mapping navigation and comprehensive location APIs for developers',
    summary: 'Google Maps provides real-time turn-by-turn navigation and local business discovery, while Google Maps Platform offers developer APIs for maps, geocoding, and routes.',
    description: [
      'For consumers, Google Maps offers transit schedules, street view, and live traffic across 220+ countries.',
      'For businesses and developers, Google Maps Platform powers ride-sharing apps, delivery tracking, and store locators with a monthly $200 recurring free credit.'
    ],
    keyFeatures: [
      'Real-time transit updates, live traffic rerouting, and lane-level navigation',
      'Street View 360-degree interactive imagery and Immersive 3D View',
      'Google Maps Platform APIs: Maps JavaScript, Geocoding, Places API, Routes API',
      'Monthly $200 free credit for developer API usage every single month'
    ],
    typicalUseCases: [
      'Daily vehicle navigation, walking directions, and metro transit timetables',
      'Embedding dynamic interactive location maps on company websites',
      'Calculating distance matrices and route optimizations for logistics apps'
    ],
    intendedAudience: ['General Public', 'Developers', 'Small Businesses'],
    platforms: ['Web', 'Android', 'iOS', 'API'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Free consumer app; Developers receive $200 free monthly credit on Maps Platform.',
    verifiedPricingInINR: 'Consumer Maps is free. Developer APIs include recurring $200 monthly credit (covers ~28,500 standard dynamic map loads/mo). Billing in INR via Google Cloud.',
    verifiedPricingInUSD: 'Consumer free. Maps Platform includes $200 monthly free allowance, pay-per-request thereafter.',
    pricingNotes: 'Developer API usage requires billing account setup to prevent accidental service interruption.',
    officialUrl: 'https://maps.google.com',
    officialPricingUrl: 'https://mapsplatform.google.com/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'MapPin',
    relatedProductSlugs: ['google-cloud', 'google-photos'],
    relatedTutorialSlugs: ['discovering-eligible-offers-india']
  },
  {
    id: 'google-photos',
    slug: 'google-photos',
    name: 'Google Photos',
    category: 'Photos & Media',
    tagline: 'Intelligent cloud photo backup with facial recognition, Magic Editor, and shared albums',
    summary: 'Google Photos automatically backs up, organizes, and searches your photos and videos using on-device and cloud AI, with powerful creative editing tools.',
    description: [
      'Google Photos backs up images seamlessly across iPhone and Android. Its computer vision lets you search photos by people, places, and pets without manual tagging.',
      'Advanced computational photography tools like Magic Eraser, Photo Unblur, and Magic Editor allow effortless subject repositioning and sky replacements.'
    ],
    keyFeatures: [
      'Automated wireless backup from Android and iOS camera rolls',
      'Visual search: find photos by typing "beach sunset", "receipts", or specific friends',
      'Magic Eraser and Magic Editor: remove unwanted background objects easily',
      'Collaborative shared albums with live partner sharing'
    ],
    typicalUseCases: [
      'Safeguarding smartphone memories against device theft or physical damage',
      'Creating shared family albums for birthdays and vacation trips',
      'Freeing up local storage space on phones by backing up to cloud'
    ],
    intendedAudience: ['General Public', 'Creators', 'Students'],
    platforms: ['Web', 'Android', 'iOS'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Free 15 GB shared storage; storage extensions available via Google One.',
    verifiedPricingInINR: 'Free 15 GB shared. Upgrades start at ₹130/month (100 GB) or ₹1,300/year.',
    verifiedPricingInUSD: 'Free 15 GB. Google One starting at $1.99/mo (100 GB).',
    pricingNotes: 'High Quality/Storage saver uploads still count against the 15 GB shared quota.',
    officialUrl: 'https://photos.google.com',
    officialPricingUrl: 'https://one.google.com/about/plans',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Image',
    relatedProductSlugs: ['google-drive', 'gmail'],
    relatedTutorialSlugs: ['free-vs-paid-plans']
  },
  {
    id: 'google-ads',
    slug: 'google-ads',
    name: 'Google Ads',
    category: 'Analytics & Marketing',
    tagline: 'High-intent digital advertising across Google Search, YouTube, Maps, and Display Network',
    summary: 'Google Ads enables businesses of all sizes to reach potential customers at the exact moment they search for relevant products or services online.',
    description: [
      'Google Ads operates primarily on a Pay-Per-Click (PPC) model where advertisers only pay when interested users click on their ads or make calls.',
      'It leverages Smart Bidding machine learning to automatically optimize bids for conversions and return on ad spend (ROAS).'
    ],
    keyFeatures: [
      'Search Ads: appear at the top of Google Search result pages for high-intent queries',
      'Performance Max (PMax): automated campaigns across Search, YouTube, Gmail, and Maps',
      'Smart Bidding: algorithmic bidding targeting specific Cost Per Acquisition (CPA)',
      'Granular geographic, demographic, and keyword match-type targeting'
    ],
    typicalUseCases: [
      'E-commerce brands driving product sales through Google Shopping ads',
      'Local businesses (plumbers, clinics, lawyers) capturing high-intent inquiries',
      'B2B software companies acquiring inbound trial signups and demo requests'
    ],
    intendedAudience: ['Small Businesses', 'Enterprises', 'Professionals'],
    platforms: ['Web', 'Android', 'iOS', 'API'],
    pricingStatus: 'paid',
    pricingOverview: 'Pay-per-click; you control daily budgets. Promotional ad credit match often available for new advertisers.',
    verifiedPricingInINR: 'No minimum spend. New advertisers in India frequently receive promotional match credits (e.g., spend ₹20,000 to get ₹20,000 ad credit match) subject to Google Ads terms.',
    verifiedPricingInUSD: 'New US accounts frequently receive $500 ad credit after spending $500 within 60 days.',
    pricingNotes: 'Promotional credits apply toward future ad spend, not cash refunds.',
    officialUrl: 'https://ads.google.com',
    officialPricingUrl: 'https://ads.google.com/home/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Megaphone',
    relatedProductSlugs: ['google-analytics', 'looker-studio', 'google-workspace'],
    relatedTutorialSlugs: ['discovering-eligible-offers-india']
  },
  {
    id: 'google-colab',
    slug: 'google-colab',
    name: 'Google Colab (Colaboratory)',
    category: 'Developer Tools',
    tagline: 'Hosted Jupyter notebook service with free GPU access for machine learning and data science',
    summary: 'Google Colab allows anyone to write and execute arbitrary Python code in the browser with zero configuration and free access to computing hardware like GPUs.',
    description: [
      'Colab is a staple in the global AI research community. It runs on top of Jupyter notebooks and requires no local software installation.',
      'Students and researchers can run PyTorch, TensorFlow, and Hugging Face transformers with access to free T4 GPUs and seamless Google Drive file mounting.'
    ],
    keyFeatures: [
      'Free access to compute resources including T4 GPUs and TPUs',
      'Zero configuration: Python libraries pre-installed (NumPy, Pandas, PyTorch, Scikit-learn)',
      'Live collaboration with teammates and shareable notebook URLs',
      'Seamless mounting of personal Google Drive storage for datasets and weights'
    ],
    typicalUseCases: [
      'Learning deep learning, neural networks, and Python data science',
      'Experimenting with open-source LLMs (Gemma, Llama, Mistral)',
      'Scraping web data and running reproducible data analysis pipelines'
    ],
    intendedAudience: ['Students', 'Developers', 'Educators', 'Professionals'],
    platforms: ['Web'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Free tier with variable GPU availability; Colab Pro/Pro+ provides guaranteed compute units and high-RAM instances.',
    verifiedPricingInINR: 'Free tier available. Colab Pro available with compute units (billed in INR via Google Cloud/Pay).',
    verifiedPricingInUSD: 'Free tier. Colab Pro starts at $9.99/month for 100 compute units.',
    pricingNotes: 'Free GPU instances have timeout idle limits (typically disconnect after 90 minutes of inactivity).',
    officialUrl: 'https://colab.research.google.com',
    officialPricingUrl: 'https://colab.research.google.com/signup',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: true,
    iconName: 'Terminal',
    relatedProductSlugs: ['google-ai-studio', 'google-cloud', 'bigquery'],
    relatedTutorialSlugs: ['getting-started-with-google-ai-studio']
  },
  {
    id: 'looker-studio',
    slug: 'looker-studio',
    name: 'Looker Studio',
    category: 'Analytics & Marketing',
    tagline: 'Free interactive data visualization and business intelligence reporting dashboards',
    summary: 'Looker Studio (formerly Google Data Studio) transforms business metrics and spreadsheets into customizable, shareable dashboards and charts.',
    description: [
      'Looker Studio connects seamlessly to over 800 data sources including Google Analytics, Google Ads, BigQuery, Google Sheets, PostgreSQL, and CSV files.',
      'Users can design branded executive reports with date-range filters, custom calculated fields, and interactive chart drill-downs without coding.'
    ],
    keyFeatures: [
      '800+ data connectors to Google ecosystem and third-party databases',
      'Drag-and-drop report canvas with full styling, company logos, and themes',
      'Interactive viewer controls: date range selectors, category drop-downs, and metric sliders',
      'Automated email report delivery on a daily, weekly, or monthly schedule'
    ],
    typicalUseCases: [
      'Building monthly digital marketing performance summaries for clients',
      'Creating executive KPI dashboards combining revenue, website traffic, and ads',
      'Tracking operational performance from Google Sheets data'
    ],
    intendedAudience: ['Professionals', 'Small Businesses', 'Enterprises'],
    platforms: ['Web'],
    pricingStatus: 'free_tier',
    pricingOverview: 'Completely free for standard reporting; Looker Studio Pro available for enterprise governance.',
    verifiedPricingInINR: 'Standard Looker Studio is completely free. Pro tier is $9/user/month for enterprise administration.',
    verifiedPricingInUSD: 'Standard Looker Studio is free. Looker Studio Pro is $9/user/project/month.',
    pricingNotes: 'Free tier has no limits on number of reports or connected viewers.',
    officialUrl: 'https://lookerstudio.google.com',
    officialPricingUrl: 'https://cloud.google.com/looker-studio',
    lastVerifiedDate: 'October 2026',
    isPopular: false,
    isFeaturedAI: false,
    iconName: 'PieChart',
    relatedProductSlugs: ['google-analytics', 'bigquery', 'google-sheets'],
    relatedTutorialSlugs: ['free-vs-paid-plans']
  },
  {
    id: 'bigquery',
    slug: 'bigquery',
    name: 'BigQuery',
    category: 'Cloud Computing',
    tagline: 'Serverless, cost-effective enterprise data warehouse with built-in ML and SQL analytics',
    summary: 'Google BigQuery is a serverless, multi-cloud enterprise data warehouse designed for lightning-fast SQL queries across petabytes of data.',
    description: [
      'BigQuery separates storage from compute, allowing queries to scale dynamically without database administration or indexing overhead.',
      'Its BigQuery Sandbox provides 1 TB of free query data processing and 10 GB of free storage every month without requiring a credit card.'
    ],
    keyFeatures: [
      'Serverless architecture: query terabytes in seconds without provisioning clusters',
      'BigQuery Sandbox: 10 GB storage and 1 TB query analysis free every month',
      'BigQuery ML: train and execute machine learning models directly using standard SQL syntax',
      'Native connectors for Looker Studio, Google Sheets, and Python data science'
    ],
    typicalUseCases: [
      'Enterprise data warehousing and customer 360 analytics',
      'Analyzing large-scale logs and real-time clickstream event data',
      'Running ad-hoc analytical queries across historical company records'
    ],
    intendedAudience: ['Developers', 'Enterprises', 'Professionals'],
    platforms: ['Web', 'API'],
    pricingStatus: 'free_tier',
    pricingOverview: 'BigQuery Sandbox offers 1 TB queries free per month; pay-as-you-go storage and compute thereafter.',
    verifiedPricingInINR: 'Sandbox tier is free. Pay-as-you-go query pricing is ~$6.25 per TB scanned, billed in INR via Google Cloud.',
    verifiedPricingInUSD: '1 TB free query data/mo; $6.25 per TB on on-demand analysis.',
    pricingNotes: 'Active storage is $0.020 per GB; long-term storage drops to $0.010 per GB.',
    officialUrl: 'https://cloud.google.com/bigquery',
    officialPricingUrl: 'https://cloud.google.com/bigquery/pricing',
    lastVerifiedDate: 'October 2026',
    isPopular: false,
    isFeaturedAI: false,
    iconName: 'Database',
    relatedProductSlugs: ['google-cloud', 'looker-studio', 'google-analytics'],
    relatedTutorialSlugs: ['discovering-eligible-offers-india']
  },
  {
    id: 'google-keep',
    slug: 'google-keep',
    name: 'Google Keep',
    category: 'Productivity & Office',
    tagline: 'Fast, lightweight note-taking, voice memos, checklists, and location-based reminders',
    summary: 'Google Keep captures quick thoughts, to-do lists, voice recordings, and sketches, keeping them synchronized across all devices in a clean card layout.',
    description: [
      'Google Keep is designed for speed. You can dictate a voice note on the go and have it automatically transcribed and saved to your notes.',
      'It integrates directly into the side panel of Gmail, Docs, and Calendar, making it easy to drag notes into documents.'
    ],
    keyFeatures: [
      'Instant voice memo transcription directly into text notes',
      'Location-based reminders (e.g. alert me when I arrive at the grocery store)',
      'Color-coding, tags, and pinned notes for quick visual organization',
      'Direct one-click export into Google Docs for expanded drafting'
    ],
    typicalUseCases: [
      'Quick grocery checklists and daily to-do management',
      'Brainstorming rapid thoughts and snapping receipts on the road',
      'Saving web article links and snippets via browser extension'
    ],
    intendedAudience: ['General Public', 'Students', 'Professionals'],
    platforms: ['Web', 'Android', 'iOS', 'Extension'],
    pricingStatus: 'free',
    pricingOverview: '100% free with any standard Google account.',
    verifiedPricingInINR: 'Free forever.',
    verifiedPricingInUSD: 'Free of charge.',
    pricingNotes: 'Notes and checklists do not consume your Google Drive storage quota.',
    officialUrl: 'https://keep.google.com',
    officialPricingUrl: 'https://keep.google.com',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'CheckSquare',
    relatedProductSlugs: ['google-docs', 'google-calendar'],
    relatedTutorialSlugs: ['using-drive-to-share-files']
  },
  {
    id: 'google-search',
    slug: 'google-search',
    name: 'Google Search',
    category: 'Search & Research',
    tagline: 'The world’s most comprehensive search engine with AI Overviews and Lens visual search',
    summary: 'Google Search indexes trillions of web pages to deliver instant answers, AI Overviews, knowledge graph summaries, and multimodal camera search through Google Lens.',
    description: [
      'Since 1998, Google Search has been the gateway to the open web. Today, with AI Overviews, it synthesizes answers for complex, multi-part inquiries.',
      'Through Google Lens, users can point their camera at plants, landmarks, translation signs, or products to search what they see.'
    ],
    keyFeatures: [
      'AI Overviews: concise generative AI summaries for complex queries',
      'Google Lens: visual search, OCR translation, and barcode scanning via smartphone camera',
      'Advanced search operators: site:, filetype:, inurl:, and exact quote filters',
      'Knowledge Graph panels providing verified facts on people, places, and events'
    ],
    typicalUseCases: [
      'Everyday informational research and fact-checking',
      'Translating physical menus and identifying unknown plants or products using camera',
      'Finding local stores, open hours, and directions'
    ],
    intendedAudience: ['General Public', 'Students', 'Professionals', 'Educators'],
    platforms: ['Web', 'Android', 'iOS'],
    pricingStatus: 'free',
    pricingOverview: '100% free ad-supported consumer service.',
    verifiedPricingInINR: 'Free for everyone.',
    verifiedPricingInUSD: 'Free of charge.',
    pricingNotes: 'No subscription required.',
    officialUrl: 'https://www.google.com',
    officialPricingUrl: 'https://www.google.com',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'Search',
    relatedProductSlugs: ['google-search-console', 'gemini'],
    relatedTutorialSlugs: ['getting-started-with-gemini']
  },
  {
    id: 'google-admob',
    slug: 'google-admob',
    name: 'Google AdMob',
    category: 'Monetisation & Ads',
    tagline: 'Leading mobile app monetisation platform for rewarded video, native, and banner ads',
    summary: 'Google AdMob empowers mobile app developers to monetize iOS and Android applications with global advertiser demand, automated mediation, and rewarded video formats.',
    description: [
      'AdMob connects app developers to Google Ads advertisers worldwide, maximizing effective cost per mille (eCPM) through automated bidding and smart segmentation.',
      'Developers can integrate native ads that seamlessly match app design, rewarded video ads for mobile games, and app open ads for clean monetization.'
    ],
    keyFeatures: [
      'Rewarded video ads: offer in-game coins or extra lives in exchange for video views',
      'Real-time bidding & Open Bidding mediation across third-party ad networks',
      'Native advanced formats matching custom app UI/UX',
      'Direct integration with Firebase Analytics to track Lifetime Value (LTV)'
    ],
    typicalUseCases: [
      'Monetizing free-to-play mobile games with rewarded video and interstitial ads',
      'Utility and productivity apps generating passive ad revenue through banners',
      'A/B testing ad frequencies to avoid user churn'
    ],
    intendedAudience: ['Developers', 'Small Businesses', 'Creators'],
    platforms: ['Android', 'iOS', 'Web'],
    pricingStatus: 'free',
    pricingOverview: 'Free developer platform; revenue share payout model.',
    verifiedPricingInINR: 'Free to integrate. Revenue payouts in INR directly to Indian bank accounts via Wire Transfer / NEFT with standard GST tax compliance.',
    verifiedPricingInUSD: 'Free developer account; revenue share model.',
    pricingNotes: 'Subject to Google AdMob policy compliance and valid app verification.',
    officialUrl: 'https://admob.google.com',
    officialPricingUrl: 'https://admob.google.com',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'DollarSign',
    relatedProductSlugs: ['google-ads', 'firebase', 'android-studio'],
    relatedTutorialSlugs: ['getting-started-with-gemini']
  },
  {
    id: 'google-play-billing',
    slug: 'google-play-billing',
    name: 'Google Play Billing',
    category: 'Monetisation & Ads',
    tagline: 'Official in-app purchases and recurring subscription infrastructure for Android apps',
    summary: 'Google Play’s official billing system enables Android developers to sell digital products, subscriptions, and one-time unlockable features across 190+ markets with localized Indian pricing (UPI, NetBanking, RuPay).',
    description: [
      'Google Play Billing provides fraud protection, subscription lifecycle management (grace periods, account hold, deferred billing), and localized checkout.',
      'Under Google’s 15% service fee tier for the first $1M USD of earnings each year, qualifying developers retain 85% of revenue.'
    ],
    keyFeatures: [
      'Support for Indian UPI, RuPay, NetBanking, and Direct Carrier Billing (Jio & Airtel)',
      '15% reduced service fee for the first $1M USD annual revenue for enrolled developers',
      'Real-time developer notifications (RTDN) via Google Cloud Pub/Sub for server verification',
      'Automated subscription pause, proration, and grace period handling'
    ],
    typicalUseCases: [
      'Monthly/annual premium subscriptions for SaaS, educational, and fitness apps',
      'In-game currency, cosmetic skins, and level unlocks',
      'Paywalled digital content and audiobooks'
    ],
    intendedAudience: ['Developers', 'Small Businesses', 'Enterprises'],
    platforms: ['Android'],
    pricingStatus: 'varies',
    pricingOverview: '15% service fee on first $1M earnings; 30% on earnings thereafter.',
    verifiedPricingInINR: 'Supports INR micro-transactions starting from ₹10 with instant UPI Autopay and bank settlement.',
    verifiedPricingInUSD: '15% for first $1M USD/year enrolled developers; 30% standard.',
    pricingNotes: 'Requires a Google Play Developer Account ($25 one-time registration fee).',
    officialUrl: 'https://developer.android.com/google/play/billing',
    officialPricingUrl: 'https://play.google.com/console/about/programs/servicefees/',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: false,
    iconName: 'CreditCard',
    relatedProductSlugs: ['android-studio', 'firebase', 'google-admob'],
    relatedTutorialSlugs: ['getting-started-with-gemini']
  },
  {
    id: 'google-ima',
    slug: 'google-ima',
    name: 'Interactive Media Ads (IMA)',
    category: 'Monetisation & Ads',
    tagline: 'Google’s video ad insertion SDK for web, mobile, and Connected TV video players',
    summary: 'The Google Interactive Media Ads (IMA) SDK allows publishers and video creators to request and display linear pre-roll, mid-roll, post-roll, and non-linear video advertisements from Google Ad Manager and AdSense for video.',
    description: [
      'IMA SDK standardizes VAST (Video Ad Serving Template) and VMAP (Video Multiple Ad Playlist) compliance, delivering seamless video ad experiences on HTML5 video players, Android, iOS, and smart TVs.',
      'Supports DAI (Dynamic Ad Insertion) to eliminate buffering and provide broadcast-quality server-side ad stitching.'
    ],
    keyFeatures: [
      'VAST 2.0, 3.0, and 4.0 and VMAP industry standard compliance',
      'Dynamic Ad Insertion (DAI) for live streams and on-demand video stitching',
      'Universal compatibility with HTML5 video, Video.js, Shaka Player, and ExoPlayer',
      'Viewability measurement with Open Measurement (OMID) standard'
    ],
    typicalUseCases: [
      'Monetizing streaming video platforms and web broadcast players',
      'CTV (Connected TV) and OTT app advertising on Android TV',
      'Podcast and audio player linear sponsorship insertion'
    ],
    intendedAudience: ['Developers', 'Enterprises', 'Creators'],
    platforms: ['Web', 'Android', 'iOS'],
    pricingStatus: 'free',
    pricingOverview: 'Free client SDK; monetisation powered via Google Ad Manager.',
    verifiedPricingInINR: 'Free developer SDK. Ad revenues settled in INR via Google Ad Manager publisher agreements.',
    verifiedPricingInUSD: 'Free SDK integration.',
    pricingNotes: 'Requires an active Google Ad Manager or AdSense for Video account.',
    officialUrl: 'https://developers.google.com/interactive-media-ads',
    officialPricingUrl: 'https://admanager.google.com',
    lastVerifiedDate: 'October 2026',
    isPopular: false,
    isFeaturedAI: false,
    iconName: 'Tv',
    relatedProductSlugs: ['google-admob', 'google-ads'],
    relatedTutorialSlugs: ['getting-started-with-gemini']
  },
  {
    id: 'android-studio',
    slug: 'android-studio',
    name: 'Android Studio',
    category: 'Developer Tools',
    tagline: 'The official integrated development environment (IDE) for Android app development',
    summary: 'Android Studio is Google’s official IDE for building Android apps for phones, tablets, Wear OS, Android TV, and ChromeOS, featuring intelligent code completion, Gemini in Android Studio, layout inspectors, and fast emulators.',
    description: [
      'Based on JetBrains IntelliJ IDEA, Android Studio provides first-class Kotlin and Java development, Gradle build configuration, and visual layout editing.',
      'With integrated Gemini in Android Studio, developers can generate UI code, fix crash traces, write unit tests, and optimize performance directly from the IDE.'
    ],
    keyFeatures: [
      'Gemini in Android Studio: AI code assistant for Kotlin generation and crash resolution',
      'Fast visual Layout Editor with Jetpack Compose preview & live interactive inspection',
      'Flexible Gradle-based build system with variant and flavor management',
      'High-performance Android Emulator with simulated GPS, sensors, and network throttles'
    ],
    typicalUseCases: [
      'Building native Android apps with Kotlin and Jetpack Compose',
      'Integrating Google Play Billing, AdMob, and Firebase SDKs',
      'Profiling memory leaks, CPU spikes, and battery consumption before release'
    ],
    intendedAudience: ['Developers', 'Students', 'Professionals'],
    platforms: ['Windows', 'macOS', 'API'],
    pricingStatus: 'free',
    pricingOverview: '100% free open-source developer tool provided by Google.',
    verifiedPricingInINR: 'Free forever. Zero licensing fees or subscription costs.',
    verifiedPricingInUSD: 'Free of charge.',
    pricingNotes: 'No subscription required.',
    officialUrl: 'https://developer.android.com/studio',
    officialPricingUrl: 'https://developer.android.com/studio',
    lastVerifiedDate: 'October 2026',
    isPopular: true,
    isFeaturedAI: true,
    iconName: 'Cpu',
    relatedProductSlugs: ['firebase', 'google-play-billing', 'google-admob'],
    relatedTutorialSlugs: ['getting-started-with-gemini']
  },
  ...GOOGLE_CLOUD_PRODUCTS.filter(product => !['firebase', 'android-studio', 'google-search-console'].includes(product.slug)),
];

export const CATEGORIES: { name: string; icon: string; count: number; description: string }[] = [
  { name: 'AI & Generative AI', icon: 'Sparkles', count: 0, description: 'Gemini, AI Studio, Vertex AI, model APIs and machine learning' },
  { name: 'Productivity & Office', icon: 'FileText', count: 0, description: 'Docs, Sheets, Slides, Forms, Calendar and collaboration' },
  { name: 'Email & Communication', icon: 'Mail', count: 0, description: 'Gmail, Meet and communication services' },
  { name: 'Cloud Storage & Files', icon: 'HardDrive', count: 0, description: 'Drive, Cloud Storage and file services' },
  { name: 'Search & Research', icon: 'Search', count: 0, description: 'Google Search, Trends, NotebookLM and research tools' },
  { name: 'Developer Tools', icon: 'Code', count: 0, description: 'Firebase, Android Studio, APIs, SDKs and developer services' },
  { name: 'Cloud Computing', icon: 'Server', count: 0, description: 'Cloud Console, compute, networking, databases and operations' },
  { name: 'Analytics & Marketing', icon: 'BarChart2', count: 0, description: 'BigQuery, data pipelines, dashboards, GA4 and measurement' },
  { name: 'Monetisation & Ads', icon: 'DollarSign', count: 0, description: 'AdMob, AdSense, Ad Manager and advertising services' },
  { name: 'Maps & Location', icon: 'MapPin', count: 0, description: 'Maps Platform and geospatial tools' },
  { name: 'Photos & Media', icon: 'Image', count: 0, description: 'Photos, media and content tools' },
  { name: 'Business Tools', icon: 'Briefcase', count: 0, description: 'Workspace, AppSheet and business services' },
  { name: 'Security & Account', icon: 'ShieldCheck', count: 0, description: 'Identity, IAM, secrets and cloud security services' },
].map(category => ({
  ...category,
  count: PRODUCTS.filter(product => product.category === category.name).length
}));
