import { Tutorial } from '../types';

export const TUTORIALS: Tutorial[] = [
  {
    id: 'getting-started-with-gemini',
    slug: 'getting-started-with-gemini',
    title: 'Getting Started with Gemini: From First Prompt to Advanced Reasoning',
    subtitle: 'Learn how to master Google’s AI assistant, use multimodal prompts, compare Free vs Advanced, and leverage Canvas.',
    category: 'AI & Generative AI',
    readingTimeMinutes: 7,
    difficulty: 'Beginner',
    lastUpdated: 'October 2026',
    relatedProductSlug: 'gemini',
    summary: 'A complete practical roadmap for mastering Gemini. Discover how to craft high-context prompts, attach PDFs and images, utilize Canvas for live coding and writing, and decide if Gemini Advanced is right for you.',
    keyTakeaways: [
      'Gemini free tier runs on high-speed Flash models with generous rate allowances.',
      'Multimodal capabilities let you upload PDFs, charts, receipts, and photos for immediate parsing.',
      'Canvas mode enables side-by-side iterative editing of code and long-form prose.',
      'Extensions link Gemini directly to Google Workspace, YouTube, Google Maps, and Flights.'
    ],
    officialDocUrl: 'https://support.google.com/gemini/answer/13278668',
    sections: [
      {
        heading: '1. Accessing Gemini and Choosing Your Account',
        content: 'You can access Gemini at gemini.google.com using any standard personal Google account or an authorized Google Workspace business account. When you open the workspace, you will find a clean, distraction-free prompt interface.',
        steps: [
          'Navigate to gemini.google.com in Chrome, Edge, or Safari.',
          'Sign in with your Google account credentials.',
          'Verify your interface theme and language preferences in the top-right settings menu.'
        ],
        tip: 'If using a company or school Workspace account, your IT administrator must have Gemini enabled in the Admin Console before access is granted.'
      },
      {
        heading: '2. Crafting Context-Rich Prompts with the C-R-E-A-T Framework',
        content: 'To extract high-accuracy answers without generic fluff, structure your prompts using the Context-Role-Expectation-Action-Tone framework.',
        steps: [
          'Context: State the background ("I am planning a 4-day tech workshop in Bengaluru for 30 attendees...").',
          'Role: Assign a persona ("Act as a senior event coordinator with corporate budget expertise...").',
          'Expectation: Define the format ("Provide the output in a clean markdown table with estimated INR costs...").',
          'Action: Give the direct instruction ("Outline the schedule, tea breaks, and AV equipment checklist...").',
          'Tone: Specify voice ("Professional, concise, and structured.").'
        ]
      },
      {
        heading: '3. Uploading Documents and Multimodal Analysis',
        content: 'Gemini can examine visual files and documents directly. Click the plus (+) icon beside the prompt bar to attach files.',
        steps: [
          'Attach PDF research reports, scanned receipts, or smartphone photos.',
          'Prompt Gemini to summarize key takeaways, extract tabular data, or convert handwritten notes into editable text.',
          'Ask follow-up questions targeting specific paragraphs or footnotes in the uploaded file.'
        ],
        tip: 'Gemini handles complex PDF tables and invoices with high accuracy, transforming messy rows into clean CSV or markdown tables.'
      },
      {
        heading: '4. Working with Canvas and Coding',
        content: 'For software engineering and creative writing, switch on Canvas mode. This opens a split-screen panel where you can edit generated text or code alongside Gemini, highlight specific blocks, and ask Gemini to refactor, add comments, or fix bugs.'
      },
      {
        heading: '5. Deciding on Gemini Advanced (Google One AI Premium)',
        content: 'The free tier satisfies 90% of daily user requirements. Consider Gemini Advanced (₹1,950/mo or $19.99/mo) if you require Google’s highest-capacity reasoning models, 1M+ token context windows for giant codebases, priority server access during peak hours, and native Gemini inside Gmail and Google Docs.'
      }
    ]
  },
  {
    id: 'using-notebooklm',
    slug: 'using-notebooklm',
    title: 'Using NotebookLM: The AI Research Partner Grounded in Your Sources',
    subtitle: 'Learn how to upload sources, generate hallucination-free answers with citations, and create viral Audio Overviews.',
    category: 'AI & Generative AI',
    readingTimeMinutes: 8,
    difficulty: 'Beginner',
    lastUpdated: 'October 2026',
    relatedProductSlug: 'notebooklm',
    summary: 'Master Google NotebookLM to transform messy lecture notes, corporate PDFs, and research papers into organized study guides, interactive briefing docs, and conversational podcast-style Audio Overviews.',
    keyTakeaways: [
      'NotebookLM only answers from your uploaded sources—it does not hallucinate facts from the open web.',
      'Every claim includes an inline clickable citation pointing to the exact line in your source document.',
      'Audio Overview generates a stunning 2-person podcast conversation summarizing your materials.',
      'Your uploaded personal and corporate data is never used to train Google AI models.'
    ],
    officialDocUrl: 'https://support.google.com/notebooklm',
    sections: [
      {
        heading: '1. What Makes NotebookLM Radically Different from Chatbots',
        content: 'Standard AI models guess answers based on broad internet data, which can lead to confident errors. NotebookLM flips this model: you provide the knowledge base (up to 50 sources per notebook), and NotebookLM acts strictly as an analytical engine over that exact knowledge base.'
      },
      {
        heading: '2. Setting Up Your First Notebook and Adding Sources',
        content: 'Get started by creating a dedicated project workspace.',
        steps: [
          'Go to notebooklm.google.com and sign in with your Google Account.',
          'Click "New Notebook" and name it (e.g. "Q4 Market Research" or "Biology 101 Finals").',
          'Upload up to 50 sources: Google Docs, Google Slides, PDFs (up to 500,000 words each), web URLs, or copied text snippets.',
          'Watch NotebookLM index your documents and auto-generate an instant Source Guide summary.'
        ]
      },
      {
        heading: '3. Chatting and Checking Grounded Citations',
        content: 'Ask questions in natural language. NotebookLM reads your sources and crafts structured answers.',
        steps: [
          'Type a targeted question: "What were the 3 primary risk factors identified in Chapter 4?"',
          'Notice the small numbered citation badges ([1], [2]) beside every claim.',
          'Click any citation number: the source viewer opens instantly on the right, highlighting the exact sentence from your original PDF.'
        ],
        tip: 'Clicking citations gives you 100% auditability for academic submissions, legal reviews, and executive reporting.'
      },
      {
        heading: '4. Generating Deep-Dive Audio Overviews',
        content: 'NotebookLM’s most celebrated feature is the Audio Overview.',
        steps: [
          'In the Notebook guide panel, locate the "Audio Overview" section.',
          'Click the "Generate" button. NotebookLM synthesizes your sources into a 6 to 12 minute conversational podcast.',
          'Listen to two AI hosts dialogue back and forth, humorously banter, connect key themes, and summarize core takeaways.',
          'Download the audio file to listen during your commute or gym workout.'
        ]
      },
      {
        heading: '5. Exporting Notes and Study Guides',
        content: 'Use the Studio panel to instantly generate Study Guides, FAQs, Briefing Documents, Timelines, and Table of Contents with one click. Save notes to pin important insights to your notebook board.'
      }
    ]
  },
  {
    id: 'creating-business-email-workspace',
    slug: 'creating-business-email-workspace',
    title: 'Creating a Professional Business Email with Google Workspace',
    subtitle: 'Step-by-step setup guide: domains, MX records, SPF/DKIM verification, and user management.',
    category: 'Business Tools',
    readingTimeMinutes: 10,
    difficulty: 'Intermediate',
    lastUpdated: 'October 2026',
    relatedProductSlug: 'google-workspace',
    summary: 'Move away from generic @gmail.com addresses to a trustworthy, branded @yourcompany.com email. Covers domain connection, DNS MX record routing, SPF/DKIM email deliverability, and Google Admin console controls.',
    keyTakeaways: [
      'A custom domain email dramatically boosts business credibility with clients and partners.',
      'Google Workspace includes the full Gmail experience, Calendar, Drive storage, and Meet video.',
      'Proper DNS records (MX, SPF, DKIM, DMARC) prevent your emails from landing in spam folders.',
      'New domains can take advantage of the official 14-day zero-cost trial.'
    ],
    officialDocUrl: 'https://support.google.com/a/answer/182444',
    sections: [
      {
        heading: '1. Prerequisites: Domain Name and Choosing Your Plan',
        content: 'Before setting up Google Workspace, ensure you have registered a domain name (from registrars like GoDaddy, Namecheap, Cloudflare, or Google Domains partner squarespace).',
        steps: [
          'Visit workspace.google.com and click "Get Started".',
          'Enter your business name, number of employees, and contact country (India).',
          'Select "I have a domain" and enter your domain (e.g. AcmeIndustries.in).',
          'Create your primary administrator account (e.g. rahul@AcmeIndustries.in).'
        ]
      },
      {
        heading: '2. Verifying Domain Ownership via TXT Record',
        content: 'Google must confirm you own the domain before activating email routing.',
        steps: [
          'Log in to your domain registrar’s DNS management portal.',
          'Copy the unique TXT verification code provided by the Google Workspace setup wizard.',
          'Add a new TXT record at Host "@" with the verification string.',
          'Click "Verify My Domain" in the Google setup wizard (usually verifies within 2 to 10 minutes).'
        ]
      },
      {
        heading: '3. Configuring Google MX Records for Email Routing',
        content: 'MX (Mail Exchange) records instruct the internet to deliver incoming mail to Google’s secure servers.',
        steps: [
          'In your DNS editor, delete any legacy webhost MX records.',
          'Add Google’s unified MX record: Host "@", Priority "1", Destination "SMTP.GOOGLE.COM" (or the five legacy ASPMX.L.GOOGLE.COM records if using older DNS).',
          'Save your DNS settings. DNS propagation typically takes between 15 minutes and 2 hours.'
        ]
      },
      {
        heading: '4. Essential Deliverability: Adding SPF and DKIM Records',
        content: 'To prevent modern email providers (Outlook, Yahoo, Gmail) from marking your emails as spam, you must configure authentication records.',
        steps: [
          'Add SPF TXT Record: Name "@", Value: "v=spf1 include:_spf.google.com ~all".',
          'Generate DKIM in Google Admin Console (Apps > Google Workspace > Gmail > Authenticate email).',
          'Copy the generated 2048-bit TXT record into your DNS under "google._domainkey".',
          'Click "Start Authentication" in the Admin Console once DNS propagates.'
        ],
        warning: 'Skipping SPF and DKIM configuration in 2026 will cause a high percentage of your outbound emails to be rejected or quarantined in spam.'
      },
      {
        heading: '5. Admin Console Best Practices for Indian Businesses',
        content: 'Enforce 2-Step Verification for all employee accounts under Security > 2-Step Verification. Enter your organization’s 15-digit GSTIN under Billing > Payment settings to ensure your monthly invoices include input tax credit (ITC) for 18% GST.'
      }
    ]
  },
  {
    id: 'using-drive-to-share-files',
    slug: 'using-drive-to-share-files',
    title: 'Using Google Drive: Organize, Share Securely, and Avoid Data Leaks',
    subtitle: 'A practical masterclass in link sharing permissions, folder hierarchies, expiry dates, and file recovery.',
    category: 'Cloud Storage & Files',
    readingTimeMinutes: 6,
    difficulty: 'Beginner',
    lastUpdated: 'October 2026',
    relatedProductSlug: 'google-drive',
    summary: 'Learn how to utilize Google Drive to collaborate safely with coworkers and clients. Discover the critical differences between Viewer, Commenter, and Editor roles, how to set expiring share links, and how to recover lost files.',
    keyTakeaways: [
      'Never use "Anyone with the link can edit" for sensitive company or personal files.',
      'Google Drive lets you set expiration dates on shared access for freelancers and clients.',
      'Version history allows reverting accidental edits up to 30 days back.',
      'Shared Drives (Workspace) protect company assets even when employees leave.'
    ],
    officialDocUrl: 'https://support.google.com/drive/answer/2494822',
    sections: [
      {
        heading: '1. Mastering the Three Sharing Permission Roles',
        content: 'When sharing files or folders in Google Drive, you can grant three distinct permission levels.',
        steps: [
          'Viewer: Can view the document and download/print (unless you disable export permissions in gear settings).',
          'Commenter: Can read the document and leave contextual margin suggestions and comments without altering the original text.',
          'Editor: Can modify content, delete paragraphs, and share permissions with other users by default.'
        ],
        tip: 'Always click the Gear icon in the share modal and uncheck "Editors can change permissions and share" if you want strict control over document access.'
      },
      {
        heading: '2. Setting Expiration Dates for Temporary Access',
        content: 'When collaborating with outside contractors, consultants, or interns, set an automated expiration date.',
        steps: [
          'Open the Share modal on the file or folder.',
          'Invite the person using their email address.',
          'Click the dropdown next to their name and select "Add expiration".',
          'Set the target date (e.g. 14 days or end of quarter). Access will automatically revoke at midnight without manual intervention.'
        ]
      },
      {
        heading: '3. Using Google Drive for Desktop',
        content: 'Install the Google Drive for Desktop application for Windows or macOS. Choose "Stream files" rather than "Mirror files" to browse all your cloud documents directly inside File Explorer or Finder without consuming your computer’s hard drive space.'
      },
      {
        heading: '4. File Recovery and Version History',
        content: 'If someone overwrites a key spreadsheet or deletes a paragraph, open the file, click File > Version history > See version history. You can view timestamped historical snapshots and restore any previous version with a single click.'
      }
    ]
  },
  {
    id: 'getting-started-with-google-ai-studio',
    slug: 'getting-started-with-google-ai-studio',
    title: 'Getting Started with Google AI Studio: Fast-Track Gemini API Prototyping',
    subtitle: 'Create API keys, test multimodal prompts, configure system instructions, and export production code.',
    category: 'Developer Tools',
    readingTimeMinutes: 9,
    difficulty: 'Intermediate',
    lastUpdated: 'October 2026',
    relatedProductSlug: 'google-ai-studio',
    summary: 'A developer guide to Google AI Studio. Explore how to harness Gemini 2.0 Flash and Pro, tune temperature and safety settings, enforce structured JSON outputs, and export clean TypeScript/Python code.',
    keyTakeaways: [
      'Google AI Studio offers a free developer tier with generous rate limits.',
      'Structured Outputs (JSON schema) ensure the model returns 100% parseable JSON objects.',
      'System instructions guide the model persona and operational boundaries before user prompts.',
      'One-click code export supports the modern @google/genai SDK.'
    ],
    officialDocUrl: 'https://ai.google.dev/gemini-api/docs/quickstart',
    sections: [
      {
        heading: '1. Generating Your First Gemini API Key',
        content: 'AI Studio is the quickest route to an API key without complex GCP IAM configuration.',
        steps: [
          'Go to aistudio.google.com and sign in with your Google account.',
          'Click the blue "Get API key" button in the left sidebar.',
          'Select "Create API key in new project" or link an existing Google Cloud project.',
          'Copy your secret key and store it securely in your local .env file as GEMINI_API_KEY.'
        ],
        warning: 'Never commit your raw Gemini API key to public GitHub repositories or client-side frontend code.'
      },
      {
        heading: '2. Understanding Parameters: Temperature, Top-P, and Thinking',
        content: 'Calibrate model behavior in the right-hand settings panel:',
        steps: [
          'Temperature: Set to 0.0 or 0.2 for deterministic coding, data extraction, and classification. Set to 0.8+ for creative writing and brainstorming.',
          'System Instructions: Provide persistent guardrails (e.g. "You are an automated invoice parser. Output only valid JSON matching the provided schema. Do not add conversational remarks.").',
          'Thinking Budget: On reasoning models, allocate thinking tokens for complex multi-step math or logic problems.'
        ]
      },
      {
        heading: '3. Testing Multimodal Inputs with Huge Context Windows',
        content: 'Upload a 100-page PDF manual, a 20-minute audio MP3, or an MP4 video clip into the prompt box. Ask Gemini to extract specific timestamps, summarize arguments, or find exact mentions across the media.'
      },
      {
        heading: '4. Exporting Production Code',
        content: 'Once your prompt performs reliably in the web playground, click the "Get Code" button in the upper right. Choose TypeScript/JavaScript or Python to copy production-ready code utilizing the official @google/genai SDK.'
      }
    ]
  },
  {
    id: 'free-vs-paid-plans',
    slug: 'free-vs-paid-plans',
    title: 'Choosing Between Free and Paid Google Plans: Personal vs One vs Workspace',
    subtitle: 'Demystifying 15GB free storage, Google One consumer upgrades, and Google Workspace business editions.',
    category: 'Pricing & Plans',
    readingTimeMinutes: 7,
    difficulty: 'Beginner',
    lastUpdated: 'October 2026',
    relatedProductSlug: 'google-workspace',
    summary: 'A clear, honest breakdown of when you can stay on Google’s free tier versus when upgrading to Google One or Google Workspace is genuinely necessary.',
    keyTakeaways: [
      'Free 15 GB storage is shared across Gmail, Drive, and Google Photos.',
      'Google One is for individuals and families wanting extra storage and consumer AI perks.',
      'Google Workspace is for businesses requiring custom email domains and admin security.',
      'Buying Google One does NOT give you a custom @yourcompany.com business email.'
    ],
    officialDocUrl: 'https://one.google.com/about/plans',
    sections: [
      {
        heading: '1. The Free Tier: What is Included at Zero Cost',
        content: 'Every standard Google Account comes with 15 GB of cloud storage free of charge. This storage is shared collectively among Gmail inbox messages, Google Drive files, and Google Photos backups. Google Docs, Sheets, Slides, and Forms files do not consume storage space.'
      },
      {
        heading: '2. When to Upgrade to Google One (Consumer Storage)',
        content: 'If your 15 GB storage is nearing 85% full and you use a personal @gmail.com address, Google One is the appropriate consumer upgrade.',
        steps: [
          'Basic (100 GB - ₹130/mo or ₹1,300/yr): Perfect for smartphone photo backups and personal Drive files.',
          'Standard (200 GB - ₹210/mo or ₹2,100/yr): Great for families sharing storage among up to 5 members.',
          'Premium (2 TB - ₹650/mo or ₹6,500/yr): Ideal for video creators, heavy photographers, and long-term cloud backups.',
          'AI Premium (2 TB - ₹1,950/mo): Includes everything in Premium plus Gemini Advanced model access.'
        ]
      },
      {
        heading: '3. When You Need Google Workspace Instead',
        content: 'If you need an email address matching your business domain (e.g. contact@yourbrand.in), you CANNOT use Google One. You must subscribe to Google Workspace.',
        steps: [
          'Business Starter (₹136 - ₹160/user/mo): 30 GB pooled storage per user, 100-person video meetings.',
          'Business Standard (₹672 - ₹780/user/mo): 2 TB pooled storage per user, 150-person meetings with recording, shared drives.',
          'Business Plus (₹1,360/user/mo): 5 TB pooled storage per user, 500-person meetings with attendance tracking, Google Vault data retention.'
        ]
      },
      {
        heading: '4. Summary Decision Framework',
        content: 'Ask yourself two simple questions: 1) Do I need a custom domain email? If yes, choose Workspace. 2) Do I just need more storage space for my personal Gmail and phone photos? If yes, choose Google One Basic.'
      }
    ]
  },
  {
    id: 'discovering-eligible-offers-india',
    slug: 'discovering-eligible-offers-india',
    title: 'Discovering Legitimate Google Offers in India: Avoid Scams and Navigate Billing',
    subtitle: 'How to claim authentic free trials, understand RBI recurring e-mandates, and spot common online fraud.',
    category: 'India Offers',
    readingTimeMinutes: 8,
    difficulty: 'Beginner',
    lastUpdated: 'October 2026',
    relatedProductSlug: 'google-cloud',
    summary: 'A safety and tactical guide for users in India. Learn where authentic Google trials live, how Reserve Bank of India (RBI) recurring mandate regulations impact trial card authorizations, and how to protect yourself from fake promo links.',
    keyTakeaways: [
      'Official Google trials never ask for money transfers via UPI QR codes or WhatsApp.',
      'RBI requires 2-factor OTP verification for e-mandates on credit and debit cards.',
      'Small authorization charges (₹1 or ₹2) are standard verification holds and get refunded.',
      'Always verify URLs start with *.google.com before entering passwords or payment methods.'
    ],
    officialDocUrl: 'https://support.google.com/paymentscenter/answer/9034675',
    sections: [
      {
        heading: '1. Authentic Offers vs Malicious Scams in India',
        content: 'Scammers frequently send SMS messages, WhatsApp forwards, and telegram alerts promising "Free 500GB Google Drive for Jio users" or "Claim ₹10,000 Google Play Gift Voucher". Google NEVER distributes promotions through random WhatsApp links or third-party APK downloads.',
        warning: 'Always check that the domain in your browser bar is strictly google.com, cloud.google.com, or workspace.google.com.'
      },
      {
        heading: '2. Understanding RBI Card Authorizations and e-Mandates',
        content: 'When claiming an official free trial (like Google Cloud $300 trial or Google One 1-month trial), Google must verify your payment method in accordance with Reserve Bank of India (RBI) rules.',
        steps: [
          'Authorization Charge: Your bank may send an SMS for a ₹1, ₹2, or ₹50 authorization charge. This is a temporary verification hold and will be automatically reversed to your account.',
          'e-Mandate Notification: You will receive an SMS and email from your bank specifying an e-mandate registration for future monthly renewals.',
          'Pre-Debit Notification: Under RBI rules, your bank is legally required to send an SMS notification at least 24 to 48 hours before any recurring monthly charge is processed, giving you ample time to cancel if desired.'
        ]
      },
      {
        heading: '3. Supported Payment Methods in India',
        content: 'Google services in India accept Indian Credit Cards (Visa, Mastercard, American Express), international-enabled Debit Cards from major banks (HDFC, ICICI, SBI, Axis, Kotak), and UPI AutoPay (for Google Play subscriptions). RuPay cards without international e-commerce enabled may encounter errors.'
      },
      {
        heading: '4. How to Safely Cancel Before Trial Auto-Renews',
        content: 'To prevent unexpected renewals, you can manage active subscriptions immediately:',
        steps: [
          'For Google One / Play apps: Open Google Play Store > tap your profile icon > Payments & subscriptions > Subscriptions > Select the service > Cancel subscription.',
          'For Google Workspace: Go to admin.google.com > Billing > Subscriptions > Cancel subscription.',
          'For Google Cloud: You are never billed automatically after the $300 trial ends unless you manually click "Upgrade to Paid Account" in the Cloud Console.'
        ]
      }
    ]
  }
];
