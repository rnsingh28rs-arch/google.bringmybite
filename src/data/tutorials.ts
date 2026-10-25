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
  },
  {
    "id": "google-cloud-data-science-roadmap",
    "slug": "google-cloud-data-science-roadmap",
    "title": "Google Cloud Data Science Roadmap: From SQL to Machine Learning",
    "subtitle": "A practical learning route using BigQuery, Python notebooks, analytics, and machine learning on Google Cloud.",
    "category": "Data Science & Analytics",
    "readingTimeMinutes": 12,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "relatedProductSlug": "bigquery",
    "summary": "Follow a staged data-science path: learn SQL, explore public datasets in BigQuery, analyze with notebooks, visualize results, and then study machine learning. This is a curated roadmap, not a claim that every linked course is free.",
    "keyTakeaways": [
      "Start with SQL and data analysis before jumping into model training.",
      "Use BigQuery public datasets for hands-on analytics practice; query costs and quotas still apply.",
      "Use Colab or Colab Enterprise for Python notebook practice.",
      "Study model concepts before moving into Vertex AI or BigQuery ML."
    ],
    "officialDocUrl": "https://www.skills.google/"
  },
  {
    "id": "bigquery-sql-for-data-analysis",
    "slug": "bigquery-sql-for-data-analysis",
    "title": "BigQuery SQL: Query Public Datasets and Analyze Data",
    "subtitle": "Learn tables, SELECT, filtering, joins, aggregation, window functions, and exploratory analysis.",
    "category": "Data Science & Analytics",
    "readingTimeMinutes": 10,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "relatedProductSlug": "bigquery",
    "summary": "A hands-on starter guide for learning analytics SQL in BigQuery. Start in the Google Cloud console, choose a public dataset, write read-only queries, and inspect the results before building dashboards.",
    "keyTakeaways": [
      "Practice SELECT, WHERE, GROUP BY, JOIN, and window functions.",
      "Estimate bytes processed and use query limits to avoid unexpected charges.",
      "Keep projects, datasets, and permissions organized.",
      "Official BigQuery learning labs and course availability may change."
    ],
    "officialDocUrl": "https://cloud.google.com/bigquery/docs/introduction-sql"
  },
  {
    "id": "google-cloud-data-analytics-learning-path",
    "slug": "google-cloud-data-analytics-learning-path",
    "title": "Google Cloud Data Analytics Learning Path",
    "subtitle": "Find official courses and hands-on labs for data engineering, analytics, and BigQuery.",
    "category": "Data Science & Analytics",
    "readingTimeMinutes": 8,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "relatedProductSlug": "google-cloud-platform",
    "summary": "Use Google Skills to browse the current data analytics learning paths, courses, and hands-on labs. Check each item for its enrollment conditions, skill badge requirements, and any credit or subscription requirements.",
    "keyTakeaways": [
      "Search the official catalog for BigQuery, data analytics, data engineering, and SQL.",
      "Read course prerequisites and lab requirements before starting.",
      "Track completions and badges in the Google Skills account.",
      "Do not assume every lab or credential is free."
    ],
    "officialDocUrl": "https://www.skills.google/"
  },
  {
    "id": "google-cloud-data-engineering",
    "slug": "google-cloud-data-engineering",
    "title": "Data Engineering Foundations with Google Cloud",
    "subtitle": "Understand data ingestion, transformation, orchestration, and analytical storage.",
    "category": "Data Science & Analytics",
    "readingTimeMinutes": 11,
    "difficulty": "Intermediate",
    "lastUpdated": "October 2026",
    "relatedProductSlug": "bigquery",
    "summary": "A guided overview of data engineering concepts using BigQuery, Pub/Sub, Dataflow, Dataform, and workflow orchestration. Use official learning paths for practical labs.",
    "keyTakeaways": [
      "Separate ingestion, transformation, storage, and serving layers.",
      "Learn batch versus streaming data processing.",
      "Understand SQL transformation testing and workflow orchestration.",
      "Use the official catalog to find current labs for each service."
    ],
    "officialDocUrl": "https://www.skills.google/"
  },
  {
    "id": "bigquery-ml-intro",
    "slug": "bigquery-ml-intro",
    "title": "Introduction to BigQuery ML",
    "subtitle": "Learn how SQL can create, evaluate, and use machine-learning models inside BigQuery.",
    "category": "Data Science & Analytics",
    "readingTimeMinutes": 9,
    "difficulty": "Intermediate",
    "lastUpdated": "October 2026",
    "relatedProductSlug": "bigquery",
    "summary": "Explore the BigQuery ML workflow: prepare data, create a model with SQL, evaluate metrics, make predictions, and understand supported model types and constraints.",
    "keyTakeaways": [
      "Prepare clean, representative training data.",
      "Split training and evaluation data appropriately.",
      "Evaluate model metrics before using predictions.",
      "Check model type, regional availability, quotas, and pricing."
    ],
    "officialDocUrl": "https://cloud.google.com/bigquery/docs/bqml-introduction"
  },
  {
    "id": "colab-python-data-science",
    "slug": "colab-python-data-science",
    "title": "Python for Data Science with Google Colab",
    "subtitle": "Practice Python notebooks, pandas, charts, and reproducible analysis in the browser.",
    "category": "Data Science & Analytics",
    "readingTimeMinutes": 10,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "relatedProductSlug": "google-colab",
    "summary": "Use Colab notebooks to learn Python fundamentals, load CSV files, clean data with pandas, visualize distributions, and share reproducible work. Avoid uploading confidential datasets to public notebooks.",
    "keyTakeaways": [
      "Learn variables, functions, lists, and dictionaries.",
      "Use pandas for data cleaning and aggregation.",
      "Visualize results with Matplotlib.",
      "Save notebook versions and document assumptions."
    ],
    "officialDocUrl": "https://colab.research.google.com/"
  },
  {
    "id": "looker-studio-data-visualization",
    "slug": "looker-studio-data-visualization",
    "title": "Build Data Dashboards with Looker Studio",
    "subtitle": "Turn reports and datasets into shareable charts, filters, and dashboards.",
    "category": "Data Science & Analytics",
    "readingTimeMinutes": 8,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "relatedProductSlug": "looker-studio",
    "summary": "Learn to connect a supported data source, select meaningful metrics, build charts and controls, and share a dashboard with appropriate access permissions.",
    "keyTakeaways": [
      "Define the audience and business question first.",
      "Choose chart types that fit the data and comparison.",
      "Validate filters, date ranges, and calculated fields.",
      "Review sharing permissions before publishing."
    ],
    "officialDocUrl": "https://lookerstudio.google.com/"
  },
  {
    "id": "vertex-ai-ml-foundations",
    "slug": "vertex-ai-ml-foundations",
    "title": "Machine Learning Foundations with Vertex AI",
    "subtitle": "Understand training, evaluation, deployment, and monitoring of ML models.",
    "category": "AI & Generative AI",
    "readingTimeMinutes": 10,
    "difficulty": "Intermediate",
    "lastUpdated": "October 2026",
    "relatedProductSlug": "vertex-ai",
    "summary": "A conceptual route through Vertex AI for learners who already understand data preparation and basic model evaluation. Use official labs to practice with supported services and datasets.",
    "keyTakeaways": [
      "Define the prediction target and baseline first.",
      "Separate training, validation, and test data.",
      "Track experiments and evaluate model quality.",
      "Check service availability and cost before deploying endpoints."
    ],
    "officialDocUrl": "https://cloud.google.com/vertex-ai/docs"
  },
  {
    "id": "google-cloud-free-learning-resources",
    "slug": "google-cloud-free-learning-resources",
    "title": "Find Free Google Cloud Courses, Labs, and Skill Badges",
    "subtitle": "How to filter official learning resources and verify whether enrollment or lab access costs money.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 7,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "summary": "Browse Google Skills for courses, labs, and credentials. Some resources may be free while others require credits, a subscription, event access, or other eligibility. Check the individual course page before starting.",
    "keyTakeaways": [
      "Start at the official Google Skills catalog.",
      "Filter by topic such as cloud, data analytics, AI, and security.",
      "Check whether hands-on labs require credits or a subscription.",
      "Skill badges and professional certifications are different credentials."
    ],
    "officialDocUrl": "https://www.skills.google/"
  },
  {
    "id": "google-cloud-certification-guide",
    "slug": "google-cloud-certification-guide",
    "title": "Google Cloud Certifications: Choose the Right Track",
    "subtitle": "Compare foundational, associate, and professional paths before committing to exam preparation.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 8,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "summary": "Use Google's official certification pages to understand exam objectives, recommended experience, registration, and current prices. A course completion or skill badge is not the same as passing a certification exam.",
    "keyTakeaways": [
      "Choose a role-aligned certification path.",
      "Read the current exam guide and prerequisites.",
      "Build hands-on experience alongside study.",
      "Verify exam fees, languages, delivery options, and validity."
    ],
    "officialDocUrl": "https://cloud.google.com/learn/certification"
  },
  {
    "id": "google-data-analytics-certificate-guide",
    "slug": "google-data-analytics-certificate-guide",
    "title": "Google Data Analytics Professional Certificate: How to Start",
    "subtitle": "Understand the beginner-friendly analytics curriculum and where to enroll.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 7,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "summary": "Google's Data Analytics Professional Certificate is offered through Coursera. Review the current enrollment, trial, financial aid, and subscription terms on Coursera before assuming it is free.",
    "keyTakeaways": [
      "The curriculum focuses on analytics foundations, spreadsheets, SQL, visualization, and a case study.",
      "Course access and certificate completion can depend on Coursera's current payment terms.",
      "Financial aid availability and eligibility should be checked directly.",
      "Build a portfolio project to demonstrate skills beyond the certificate."
    ],
    "officialDocUrl": "https://www.coursera.org/professional-certificates/google-data-analytics"
  },
  {
    "id": "google-advanced-data-analytics-certificate-guide",
    "slug": "google-advanced-data-analytics-certificate-guide",
    "title": "Google Advanced Data Analytics Certificate: Study Guide",
    "subtitle": "A next step for learners ready for statistics, regression, Python, and machine learning concepts.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 7,
    "difficulty": "Intermediate",
    "lastUpdated": "October 2026",
    "summary": "Review the Google Advanced Data Analytics Professional Certificate on Coursera for its current syllabus and access terms. It is intended as a follow-on for learners with foundational analytics knowledge.",
    "keyTakeaways": [
      "Strengthen Python and statistical reasoning before starting.",
      "Practice regression, hypothesis testing, and model evaluation.",
      "Use projects to explain assumptions and limitations.",
      "Check current Coursera subscription and financial-aid terms."
    ],
    "officialDocUrl": "https://www.coursera.org/professional-certificates/google-advanced-data-analytics"
  },
  {
    "id": "google-business-intelligence-certificate-guide",
    "slug": "google-business-intelligence-certificate-guide",
    "title": "Google Business Intelligence Certificate: Learning Route",
    "subtitle": "Explore data modeling, pipelines, dashboards, and BI workflows.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 7,
    "difficulty": "Intermediate",
    "lastUpdated": "October 2026",
    "summary": "Google's Business Intelligence Professional Certificate is listed on Coursera. Review its current syllabus and access terms; use Looker Studio and SQL projects to reinforce the concepts.",
    "keyTakeaways": [
      "Learn data modeling and the difference between reporting and analysis.",
      "Practice dashboard design with clear metrics.",
      "Understand pipelines and data quality.",
      "Verify current enrollment and certificate costs."
    ],
    "officialDocUrl": "https://www.coursera.org/professional-certificates/google-business-intelligence"
  },
  {
    "id": "google-cybersecurity-certificate-guide",
    "slug": "google-cybersecurity-certificate-guide",
    "title": "Google Cybersecurity Certificate: Getting Started",
    "subtitle": "Explore entry-level cybersecurity foundations and practical study expectations.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 6,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "summary": "Review the Google Cybersecurity Professional Certificate on Coursera and its current enrollment terms. Use the official syllabus to plan security fundamentals, Linux, SQL, Python, and incident-response study.",
    "keyTakeaways": [
      "Check the current curriculum and prerequisites.",
      "Practice in authorized lab environments only.",
      "Keep notes on security concepts and investigation workflows.",
      "Check Coursera's current price and financial-aid options."
    ],
    "officialDocUrl": "https://www.coursera.org/professional-certificates/google-cybersecurity"
  },
  {
    "id": "google-it-support-certificate-guide",
    "slug": "google-it-support-certificate-guide",
    "title": "Google IT Support Certificate: Beginner Roadmap",
    "subtitle": "Plan a foundational path through troubleshooting, networking, operating systems, and security.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 6,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "summary": "The Google IT Support Professional Certificate is offered through Coursera. Review current enrollment and certificate terms on the official page before planning your study schedule.",
    "keyTakeaways": [
      "Study hardware, operating systems, networking, and system administration.",
      "Practice troubleshooting with a documented process.",
      "Learn basic security and customer support workflows.",
      "Verify enrollment, payment, and financial-aid conditions."
    ],
    "officialDocUrl": "https://www.coursera.org/professional-certificates/google-it-support"
  },
  {
    "id": "google-project-management-certificate-guide",
    "slug": "google-project-management-certificate-guide",
    "title": "Google Project Management Certificate: Study Overview",
    "subtitle": "Explore project planning, stakeholder communication, agile methods, and delivery practices.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 6,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "summary": "Review the Google Project Management Professional Certificate on Coursera for current modules, duration estimates, and access terms.",
    "keyTakeaways": [
      "Practice scope, milestones, risks, and stakeholder plans.",
      "Compare predictive and agile approaches.",
      "Use a small project to apply the course concepts.",
      "Check current enrollment and certificate payment terms."
    ],
    "officialDocUrl": "https://www.coursera.org/professional-certificates/google-project-management"
  },
  {
    "id": "google-ux-design-certificate-guide",
    "slug": "google-ux-design-certificate-guide",
    "title": "Google UX Design Certificate: Portfolio Roadmap",
    "subtitle": "Plan a learning path through user research, wireframes, prototypes, and usability testing.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 6,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "summary": "Review the Google UX Design Professional Certificate on Coursera for current modules and enrollment terms. Pair the course with a documented portfolio case study.",
    "keyTakeaways": [
      "Learn research and problem framing before designing screens.",
      "Build wireframes and interactive prototypes.",
      "Run usability tests and explain iterations.",
      "Check current Coursera fees and financial-aid eligibility."
    ],
    "officialDocUrl": "https://www.coursera.org/professional-certificates/google-ux-design"
  },
  {
    "id": "google-ai-essentials-guide",
    "slug": "google-ai-essentials-guide",
    "title": "Google AI Essentials: Practical AI Skills",
    "subtitle": "Learn prompting and responsible AI use through Google's introductory AI course.",
    "category": "Learning & Certifications",
    "readingTimeMinutes": 6,
    "difficulty": "Beginner",
    "lastUpdated": "October 2026",
    "summary": "Review Google's AI Essentials course listing and current enrollment conditions. Course access, promotions, and certificate eligibility can change by region and provider.",
    "keyTakeaways": [
      "Practice clear prompts with context and constraints.",
      "Verify AI-generated claims before relying on them.",
      "Protect sensitive information when using AI tools.",
      "Check the course provider's current access and payment terms."
    ],
    "officialDocUrl": "https://www.coursera.org/learn/google-ai-essentials"
  }

];
