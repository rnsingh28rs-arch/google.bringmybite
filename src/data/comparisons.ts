import { Comparison } from '../types';

export const COMPARISONS: Comparison[] = [
  {
    id: 'gemini-vs-notebooklm',
    slug: 'gemini-vs-notebooklm',
    title: 'Gemini vs NotebookLM: Which Google AI Tool Should You Use?',
    subtitle: 'Understand the critical difference between an open-web generative AI assistant and a strictly grounded research partner.',
    lastVerifiedDate: 'October 2026',
    items: [
      {
        id: 'gemini',
        name: 'Gemini',
        tagline: 'General-purpose multimodal AI assistant',
        pricingSummary: 'Free tier available; Advanced tier at ₹1,950/mo ($19.99/mo)',
        bestFor: 'Brainstorming, general writing, coding, creative iteration, and web searching',
        strengths: [
          'Direct access to live web information and Google Search',
          'Canvas environment for real-time code and writing editing',
          'Rich multimodal support (images, voice, video, files)',
          'Integrates across Gmail, Docs, Maps, and YouTube via extensions'
        ],
        limitations: [
          'Can occasionally hallucinate or extrapolate beyond provided files',
          'Does not automatically provide line-by-line page citations for every claim'
        ]
      },
      {
        id: 'notebooklm',
        name: 'NotebookLM',
        tagline: 'Source-grounded personal AI research notebook',
        pricingSummary: 'Free for personal Google accounts & Workspace users',
        bestFor: 'Academic studying, synthesizing legal/business PDFs, and zero-hallucination source analysis',
        strengths: [
          'Zero hallucinations: answers only from your uploaded materials',
          'Inline clickable footnote citations linking directly to exact source lines',
          'Audio Overview: generates conversational 2-host podcast discussions',
          'Upload up to 50 sources (500k words each) per notebook'
        ],
        limitations: [
          'Cannot browse the general open web outside your provided links and sources',
          'No image generation or native code execution sandbox'
        ]
      }
    ],
    criteria: [
      {
        name: 'Source Grounding & Accuracy',
        description: 'Ability to answer strictly from trusted files without inventing facts',
        winnerName: 'NotebookLM'
      },
      {
        name: 'General Knowledge & Web Search',
        description: 'Up-to-date awareness of current world events and web results',
        winnerName: 'Gemini'
      },
      {
        name: 'Audio Summaries & Podcasts',
        description: 'Generating engaging multi-speaker conversational overviews',
        winnerName: 'NotebookLM'
      },
      {
        name: 'Coding & Iterative Editing',
        description: 'Writing, debugging, and refining software code in an interactive canvas',
        winnerName: 'Gemini'
      }
    ],
    featureTable: [
      {
        feature: 'Primary Knowledge Source',
        description: 'Where the AI derives its factual answers',
        values: {
          gemini: 'Google foundation model training + real-time Google Search',
          notebooklm: 'Strictly your uploaded documents, PDFs, and links'
        }
      },
      {
        feature: 'Citations & Footnotes',
        description: 'Auditability of generated statements',
        values: {
          gemini: 'Search chips and occasional links; no page-level citations',
          notebooklm: 'Clickable numbered citations linking directly to original source text'
        }
      },
      {
        feature: 'Audio Overview (Podcasts)',
        description: 'Generates two AI hosts discussing your material',
        values: {
          gemini: 'Audio voice mode (1-on-1 speech)',
          notebooklm: 'Dual-speaker conversational podcast audio generation'
        }
      },
      {
        feature: 'Document Upload Capacity',
        description: 'Volume of documents you can analyze simultaneously',
        values: {
          gemini: 'Uploads handled in chat context (up to 1M+ tokens in Advanced)',
          notebooklm: 'Up to 50 distinct sources per notebook (500,000 words each)'
        }
      },
      {
        feature: 'Cost / Pricing',
        description: 'Monthly subscription requirement',
        values: {
          gemini: 'Free tier available / ₹1,950 ($19.99) for Gemini Advanced',
          notebooklm: '100% Free for personal Google accounts'
        }
      }
    ],
    verdict: 'Choose NotebookLM whenever you need to study, review corporate PDFs, or write reports based on verified research without hallucinations. Choose Gemini when you need an everyday creative assistant for writing, coding, web searches, and quick brainstorming.',
    recommendations: [
      {
        audience: 'College Students & Researchers',
        recommendedProduct: 'NotebookLM',
        rationale: 'Upload all your textbook chapters and syllabus PDFs to get study guides, mock exam questions, and verifiable citation footnotes.'
      },
      {
        audience: 'Software Engineers & Content Writers',
        recommendedProduct: 'Gemini',
        rationale: 'Gemini’s Canvas mode and live coding capabilities provide immediate, iterative code generation and syntax debugging.'
      },
      {
        audience: 'Executives & Managers',
        recommendedProduct: 'Both (Used Together)',
        rationale: 'Use NotebookLM to digest 100-page vendor proposals into Audio Overviews, then use Gemini to draft the outbound response email.'
      }
    ]
  },
  {
    id: 'google-docs-vs-sheets-vs-slides',
    slug: 'google-docs-vs-sheets-vs-slides',
    title: 'Google Docs vs Sheets vs Slides: Core Roles & Best Workflows',
    subtitle: 'How to pick the right Google cloud office tool for writing, structured data, and executive storytelling.',
    lastVerifiedDate: 'October 2026',
    items: [
      {
        id: 'docs',
        name: 'Google Docs',
        tagline: 'Collaborative word processing & documentation',
        pricingSummary: '100% Free with Google Account',
        bestFor: 'Prose, meeting notes, project briefs, academic papers, and manuals',
        strengths: ['Smart canvas @-mentions', 'Pageless view', 'Clean comment threads'],
        limitations: ['Not suited for complex mathematical calculations or visual slide pitching']
      },
      {
        id: 'sheets',
        name: 'Google Sheets',
        tagline: 'Cloud spreadsheet, formulas & financial modeling',
        pricingSummary: '100% Free with Google Account',
        bestFor: 'Budgets, CRM trackers, data analysis, inventory, and automated tables',
        strengths: ['400+ formulas', 'BigQuery connected sheets', 'Apps Script automation'],
        limitations: ['Poor format for long narrative prose or print typography']
      },
      {
        id: 'slides',
        name: 'Google Slides',
        tagline: 'Visual presentation deck builder & pitching',
        pricingSummary: '100% Free with Google Account',
        bestFor: 'Pitch decks, conference presentations, quarterly reviews, and visual portfolios',
        strengths: ['Live audience Q&A', 'Presenter view in Meet', 'Drag-and-drop visuals'],
        limitations: ['Unsuitable for tabular computation or extensive dense body text']
      }
    ],
    criteria: [
      { name: 'Collaboration Speed', description: 'Simultaneous multiplayer editing reliability', winnerName: 'All Three (Tied)' },
      { name: 'Data Calculation Power', description: 'Handling numerical calculations and formulas', winnerName: 'Google Sheets' },
      { name: 'Visual Storytelling', description: 'Communicating concepts to audiences in executive meetings', winnerName: 'Google Slides' },
      { name: 'Document Structuring', description: 'Formatting headings, tables of contents, and long-form prose', winnerName: 'Google Docs' }
    ],
    featureTable: [
      {
        feature: 'Primary Format',
        description: 'Document structure',
        values: {
          docs: 'Linear paginated or pageless text document',
          sheets: 'Grid of rows, columns, and data cells',
          slides: 'Canvas of visual slides (16:9 or 4:3 ratio)'
        }
      },
      {
        feature: 'Formulas & Math',
        description: 'Built-in computational power',
        values: {
          docs: 'Basic tables only, no formula engine',
          sheets: 'Full computational formula engine (SUM, QUERY, VLOOKUP, etc.)',
          slides: 'No mathematical formula support'
        }
      },
      {
        feature: 'Meeting Presentation Mode',
        description: 'Interactive presentation capabilities',
        values: {
          docs: 'Standard document review',
          sheets: 'Interactive data dashboards',
          slides: 'Full-screen presentation with presenter view and live audience Q&A'
        }
      }
    ],
    verdict: 'Do not force one tool to do everything. Modern teams draft specifications in Docs, model budgets and inventory in Sheets, and present executive summaries to leadership in Slides.',
    recommendations: [
      {
        audience: 'Product Managers',
        recommendedProduct: 'Docs + Slides',
        rationale: 'Write the Product Requirements Document (PRD) in Docs, then summarize the roadmap in Slides for stakeholder alignment.'
      },
      {
        audience: 'Financial Analysts & Operations',
        recommendedProduct: 'Google Sheets',
        rationale: 'Sheets offers complete control over financial calculations, charts, and automated recurring imports.'
      }
    ]
  },
  {
    id: 'google-drive-free-vs-one-vs-ai-premium',
    slug: 'google-drive-free-vs-one-vs-ai-premium',
    title: 'Google Drive Free (15GB) vs Google One Basic (100GB) vs AI Premium (2TB)',
    subtitle: 'Which cloud storage tier offers the best value for your photos, files, and AI workflows?',
    lastVerifiedDate: 'October 2026',
    items: [
      {
        id: 'free',
        name: 'Free Google Account',
        tagline: '15 GB shared storage forever',
        pricingSummary: '₹0 / $0 forever',
        bestFor: 'Casual email users and light smartphone photo backup',
        strengths: ['Zero cost', 'No credit card needed', 'Covers Docs/Sheets/Slides at no storage penalty'],
        limitations: ['Fills up quickly once 4K smartphone videos and high-res photos accumulate']
      },
      {
        id: 'basic',
        name: 'Google One Basic (100 GB)',
        tagline: 'Essential consumer storage upgrade',
        pricingSummary: '₹130/month (₹1,300/year) or $1.99/mo',
        bestFor: 'Everyday smartphone users whose 15GB free storage has run out',
        strengths: ['Shareable with up to 5 family members', 'Extra Google Photos editing tools', 'Google support access'],
        limitations: ['Does not include Gemini Advanced AI access']
      },
      {
        id: 'ai-premium',
        name: 'Google One AI Premium (2 TB)',
        tagline: 'Massive cloud vault + Gemini Advanced AI',
        pricingSummary: '₹1,950/month or $19.99/mo',
        bestFor: 'Power users, creators, and professionals needing Google’s best AI models and huge storage',
        strengths: ['Gemini Advanced reasoning model access', 'Gemini inside Docs and Gmail', '2 TB shared storage'],
        limitations: ['Higher monthly recurring commitment']
      }
    ],
    criteria: [
      { name: 'Best Value for Storage', description: 'Lowest cost per gigabyte for backup', winnerName: 'Google One Basic (100GB)' },
      { name: 'Cutting-Edge AI Capabilities', description: 'Access to next-gen reasoning models and Workspace AI', winnerName: 'Google One AI Premium (2TB)' },
      { name: 'Zero Cost', description: 'Requires zero payment setup or renewals', winnerName: 'Free Google Account (15GB)' }
    ],
    featureTable: [
      {
        feature: 'Cloud Storage Capacity',
        description: 'Total shared capacity for Gmail, Drive, Photos',
        values: {
          free: '15 GB shared',
          basic: '100 GB shared',
          'ai-premium': '2,048 GB (2 TB) shared'
        }
      },
      {
        feature: 'Family Storage Sharing',
        description: 'Share pool with household',
        values: {
          free: 'No sharing (individual account only)',
          basic: 'Share with up to 5 family members',
          'ai-premium': 'Share storage with 5 family members'
        }
      },
      {
        feature: 'Gemini Advanced AI Access',
        description: 'Top-tier reasoning model access',
        values: {
          free: 'Standard Flash model',
          basic: 'Standard Flash model',
          'ai-premium': 'Gemini Advanced included'
        }
      },
      {
        feature: 'Monthly Cost (India / US)',
        description: 'Standard subscription cost',
        values: {
          free: '₹0 / $0',
          basic: '₹130/mo (₹1,300/yr) / $1.99/mo',
          'ai-premium': '₹1,950/mo / $19.99/mo'
        }
      }
    ],
    verdict: 'If you just need to stop seeing the "Storage almost full" warning on your phone, get Google One Basic (₹130/mo or ₹1,300/yr). Only choose the AI Premium tier if you actively plan to use Gemini Advanced for coding, writing, and research.',
    recommendations: [
      {
        audience: 'Casual Phone Owners',
        recommendedProduct: 'Google One Basic (100 GB)',
        rationale: '₹1,300/year solves all smartphone backup issues for you and your family for years.'
      },
      {
        audience: 'AI Power Users & Coders',
        recommendedProduct: 'Google One AI Premium (2 TB)',
        rationale: 'Provides top-tier AI reasoning models combined with 2TB of spacious storage.'
      }
    ]
  },
  {
    id: 'personal-google-vs-google-workspace',
    slug: 'personal-google-vs-google-workspace',
    title: 'Personal Google Account vs Google Workspace Business Editions',
    subtitle: 'Why using personal @gmail.com accounts for business risks your data and brand credibility.',
    lastVerifiedDate: 'October 2026',
    items: [
      {
        id: 'personal',
        name: 'Personal Google Account (@gmail.com)',
        tagline: 'Individual consumer account',
        pricingSummary: 'Free / Consumer upgrades via Google One',
        bestFor: 'Personal life, personal shopping, student notes, and individual projects',
        strengths: ['Completely free', 'Simple signup', 'Instant access to all consumer apps'],
        limitations: ['No custom company domain', 'If employee leaves, company loses data', 'No centralized admin oversight']
      },
      {
        id: 'workspace',
        name: 'Google Workspace (Business Editions)',
        tagline: 'Enterprise organization management & branded email',
        pricingSummary: 'Starts at ₹136 - ₹160/user/month in India ($6/user/mo)',
        bestFor: 'Sole proprietors, registered startups, SMBs, and growing corporations',
        strengths: [
          'Professional @yourcompany.com email addresses',
          'Admin Console: manage passwords, devices, and employee offboarding',
          'Pooled cloud storage and Shared Drives',
          'Legal hold, audit logs, and compliance reporting'
        ],
        limitations: ['Requires monthly or annual per-seat licensing cost and domain ownership']
      }
    ],
    criteria: [
      { name: 'Brand Credibility', description: 'Trust factor when emailing customers and partners', winnerName: 'Google Workspace' },
      { name: 'Company Data Ownership', description: 'Retaining control of client files when staff depart', winnerName: 'Google Workspace' },
      { name: 'Zero Monthly Overhead', description: 'Running without recurring business expenses', winnerName: 'Personal Google Account' }
    ],
    featureTable: [
      {
        feature: 'Email Domain',
        description: 'Identity shown to customers',
        values: {
          personal: 'name@gmail.com',
          workspace: 'name@yourbusiness.com (custom domain)'
        }
      },
      {
        feature: 'Data Ownership',
        description: 'Who legally owns the files and inbox',
        values: {
          personal: 'The individual user owns the account',
          workspace: 'The business organization owns all accounts and files'
        }
      },
      {
        feature: 'Centralized Administration',
        description: 'Ability to reset passwords and mandate 2FA',
        values: {
          personal: 'None (each user controls their own security)',
          workspace: 'Full Google Admin console with security policies'
        }
      },
      {
        feature: 'Shared Drives',
        description: 'Files owned by the team rather than one person',
        values: {
          personal: 'Not supported (folders owned by personal users)',
          workspace: 'Shared Drives supported (files belong to organization)'
        }
      }
    ],
    verdict: 'If you earn revenue, hire employees, or bill clients, using a personal @gmail.com is a liability. Google Workspace protects your company’s intellectual property and builds professional trust.',
    recommendations: [
      {
        audience: 'Freelancers & Solo Consultants',
        recommendedProduct: 'Workspace Business Starter',
        rationale: 'For ₹136/month, you gain instant professional credibility with your own domain email.'
      },
      {
        audience: 'Startups & Growing Teams',
        recommendedProduct: 'Workspace Business Standard',
        rationale: 'Provides 2 TB pooled storage per user, Shared Team Drives, and recorded client video meetings.'
      }
    ]
  }
];
