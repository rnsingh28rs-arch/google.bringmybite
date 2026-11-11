import { Product } from '../types';

// Curated third-party AI platforms. Free allowances are described only where
// current official vendor documentation publishes a usable limit; dynamic
// consumer quotas are labelled as variable rather than invented.
export const THIRD_PARTY_AI_PRODUCTS: Product[] = [
  {
    id:'chatgpt',slug:'chatgpt',name:'ChatGPT',category:'AI & Generative AI',
    tagline:'General-purpose AI assistant for research, writing, coding and multimodal work.',
    summary:'OpenAI assistant with web search, file analysis, image creation, voice and coding tools across supported plans.',
    description:['ChatGPT supports everyday assistance, research, file analysis, coding and multimodal workflows. Feature availability and usage limits depend on the selected plan and model.','The consumer ChatGPT plan is separate from the OpenAI API, which has separate billing and model pricing.'],
    keyFeatures:['Text and multimodal assistant','Web search and file analysis','Image generation and voice features','Codex and agent workflows on eligible plans'],
    typicalUseCases:['Research and writing','Software development','Data and document analysis'],
    intendedAudience:['General Public','Students','Professionals','Developers','Small Businesses'],
    platforms:['Web','Android','iOS','Windows','macOS'],
    pricingStatus:'free_tier',pricingOverview:'Free plan available with unlimited text chats subject to abuse guardrails; uploads, image creation, voice, deep research and advanced tools have limited access.',
    pricingNotes:'Free consumer usage is model- and feature-limited. OpenAI API usage is billed separately; there is no assumption of free API tokens.',
    officialUrl:'https://chatgpt.com/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',officialPricingUrl:'https://chatgpt.com/pricing/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',
    lastVerifiedDate:'11 November 2026',isFeaturedAI:true,iconName:'Bot',relatedProductSlugs:[],relatedTutorialSlugs:[]
  },
  {
    id:'claude',slug:'claude',name:'Claude',category:'AI & Generative AI',
    tagline:'Anthropic assistant for analysis, writing, coding and long-context work.',
    summary:'Claude offers conversational AI, document analysis, coding and research capabilities across web and mobile apps.',
    description:['Claude is Anthropic’s assistant for writing, analysis, coding and document workflows. Free access is available with usage limits that vary by demand and feature.','Claude API access is a separate developer product with token-based pricing and rate limits.'],
    keyFeatures:['Conversation and document analysis','Coding and artifact workflows','Projects and research features on eligible plans','Separate developer API'],
    typicalUseCases:['Writing and analysis','Code review and software engineering','Long-document synthesis'],
    intendedAudience:['General Public','Students','Professionals','Developers'],
    platforms:['Web','Android','iOS','Windows','macOS','API'],
    pricingStatus:'free_tier',pricingOverview:'Free consumer plan with limited usage; the provider does not publish one fixed token allowance for all free accounts.',
    pricingNotes:'Usage varies with model, message length, demand and feature. Claude API is billed separately.',
    officialUrl:'https://claude.ai/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',officialPricingUrl:'https://www.anthropic.com/pricing?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',
    lastVerifiedDate:'11 November 2026',isFeaturedAI:true,iconName:'Brain',relatedProductSlugs:[],relatedTutorialSlugs:[]
  },
  {
    id:'perplexity',slug:'perplexity',name:'Perplexity',category:'AI & Generative AI',
    tagline:'Answer engine combining web search, AI synthesis and source citations.',
    summary:'Perplexity searches the web and produces cited answers, with advanced research and model selection available on paid plans.',
    description:['Perplexity is designed for web-grounded answers with citations and follow-up research. The Standard free plan supports basic searches and limited advanced features.'],
    keyFeatures:['Web search with citations','Basic file uploads','Limited Pro Searches','Research queries and advanced models on paid tiers'],
    typicalUseCases:['Web research','Source discovery','Competitive and market research'],
    intendedAudience:['General Public','Students','Professionals','Small Businesses'],
    platforms:['Web','Android','iOS'],
    pricingStatus:'free_tier',pricingOverview:'Standard Free plan: practically unlimited basic searches, 3 Pro Searches/day and 1 Research query/month.',
    pricingNotes:'Limits and available models may change; confirm the live plan page before relying on quotas.',
    officialUrl:'https://www.perplexity.ai/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',officialPricingUrl:'https://www.perplexity.ai/enterprise/pricing?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',
    lastVerifiedDate:'11 November 2026',isFeaturedAI:true,iconName:'Search',relatedProductSlugs:[],relatedTutorialSlugs:[]
  },
  {
    id:'hugging-face',slug:'hugging-face',name:'Hugging Face',category:'AI & Generative AI',
    tagline:'Open model, dataset and AI application ecosystem for developers.',
    summary:'Hugging Face Hub provides model and dataset discovery, Spaces, and routed inference through multiple providers.',
    description:['Hugging Face is a central platform for open machine-learning models, datasets and demos. Its Inference Providers offer a unified API for hundreds of models.','Free accounts receive $0.10 monthly Inference Provider credits, subject to change; usage beyond credits requires purchased credits or a custom provider key.'],
    keyFeatures:['Model and dataset Hub','Inference Providers for 200+ models','Spaces for hosted demos','Python and JavaScript SDKs'],
    typicalUseCases:['Model evaluation','Open-source AI prototyping','Inference API integration'],
    intendedAudience:['Developers','Students','Professionals','Enterprises'],
    platforms:['Web','API'],
    pricingStatus:'free_tier',pricingOverview:'Free users receive $0.10/month in Inference Provider credits, subject to change.',
    pricingNotes:'Credits are dollar-denominated, not a fixed token quota. Model/provider prices and rate limits differ.',
    officialUrl:'https://huggingface.co/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',officialPricingUrl:'https://huggingface.co/docs/inference-providers/pricing?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',
    lastVerifiedDate:'11 November 2026',isFeaturedAI:true,iconName:'Cpu',relatedProductSlugs:[],relatedTutorialSlugs:[]
  },
  {
    id:'mistral-le-chat',slug:'mistral-le-chat',name:'Mistral Le Chat',category:'AI & Generative AI',
    tagline:'Mistral AI assistant for chat, search, creation and coding.',
    summary:'Le Chat provides access to Mistral models and assistant features, while Mistral Studio offers developer model access.',
    description:['Mistral’s Free plan offers limited access to Le Chat, its latest models, chat, search, creation and Vibe coding. API access is separately priced by model and token usage.'],
    keyFeatures:['Chat and web search','Creation tools','Vibe agentic coding','Mistral Studio developer access'],
    typicalUseCases:['Writing and research','Coding assistance','Model prototyping'],
    intendedAudience:['General Public','Students','Professionals','Developers'],
    platforms:['Web','Android','iOS','API'],
    pricingStatus:'free_tier',pricingOverview:'Free plan with limited access to Le Chat and Mistral Studio; no single public fixed token allowance.',
    pricingNotes:'Consumer free usage and API token pricing are separate. API prices vary by model and modality.',
    officialUrl:'https://chat.mistral.ai/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',officialPricingUrl:'https://mistral.ai/pricing/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',
    lastVerifiedDate:'11 November 2026',isFeaturedAI:true,iconName:'MessageSquare',relatedProductSlugs:[],relatedTutorialSlugs:[]
  },
  {
    id:'openrouter',slug:'openrouter',name:'OpenRouter',category:'AI & Generative AI',
    tagline:'Unified API gateway for models from many AI providers.',
    summary:'OpenRouter provides one API interface for hundreds of models, with provider routing and model selection.',
    description:['OpenRouter routes requests to models across providers through an OpenAI-compatible API. Its free tier includes access to free model variants with request limits.'],
    keyFeatures:['Unified OpenAI-compatible API','25+ free models and 4 free providers on Free plan','Model routing and provider selection','Usage and spend visibility'],
    typicalUseCases:['Comparing model providers','Building model-agnostic apps','Fallback and routing strategies'],
    intendedAudience:['Developers','Professionals','Small Businesses','Enterprises'],
    platforms:['Web','API'],
    pricingStatus:'free_tier',pricingOverview:'Free plan: free model variants are limited to 20 requests/minute and 50 requests/day; daily cap rises to 1,000 after buying at least $10 of credits.',
    pricingNotes:'Only models marked free are included. Paid model usage is provider-priced; per-model limits may also apply.',
    officialUrl:'https://openrouter.ai/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',officialPricingUrl:'https://openrouter.ai/pricing?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',
    lastVerifiedDate:'11 November 2026',isFeaturedAI:true,iconName:'Network',relatedProductSlugs:[],relatedTutorialSlugs:[]
  },

  {
    id:'openai-api',slug:'openai-api',name:'OpenAI API',category:'AI & Generative AI',
    tagline:'Developer API for OpenAI models, tools and agent workflows.',
    summary:'Build applications with OpenAI models using text, vision, audio, image generation, structured outputs and tool calling.',
    description:['The OpenAI API is a separate developer platform from ChatGPT consumer subscriptions. API usage is billed by model and token or modality, with account-specific rate limits.','There is no general free token allowance assumed for new API projects; confirm any promotional credits in the billing dashboard.'],
    keyFeatures:['Text and multimodal model APIs','Structured outputs and tool calling','Image, audio and realtime APIs','Usage tiers and spend controls'],
    typicalUseCases:['AI application development','Agent and workflow automation','Voice, image and multimodal apps'],
    intendedAudience:['Developers','Professionals','Small Businesses','Enterprises'],
    platforms:['API','Web'],
    pricingStatus:'paid',pricingOverview:'Pay-as-you-go; token and modality pricing varies by model. No general free API token tier.',
    pricingNotes:'ChatGPT Free/Plus/Pro subscriptions do not include API credits. RPM, TPM and daily limits vary by model and account usage tier.',
    officialUrl:'https://platform.openai.com/',officialPricingUrl:'https://openai.com/api/pricing/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',
    lastVerifiedDate:'11 November 2026',isFeaturedAI:true,iconName:'Code',relatedProductSlugs:['chatgpt'],relatedTutorialSlugs:[]
  },
  {
    id:'anthropic-api',slug:'anthropic-api',name:'Anthropic API',category:'AI & Generative AI',
    tagline:'Developer API for Claude models and tool-using applications.',
    summary:'Integrate Claude models into applications for reasoning, coding, document analysis and agentic tool use.',
    description:['The Anthropic API is separate from the Claude consumer app and its subscription plans. Developer usage is billed per model and token, with rate limits based on usage tier.','No general free token allowance is assumed; any trial credits or account promotions must be verified in the Anthropic Console.'],
    keyFeatures:['Claude model API access','Tool use and structured workflows','Prompt caching and batch processing','Model-specific rate limits'],
    typicalUseCases:['LLM application development','Coding and document analysis','Agentic workflows'],
    intendedAudience:['Developers','Professionals','Small Businesses','Enterprises'],
    platforms:['API','Web'],
    pricingStatus:'paid',pricingOverview:'Pay-as-you-go token pricing by Claude model. No general free API token tier.',
    pricingNotes:'Claude consumer Free/Pro plans do not include API credits. Rate limits vary by model and usage tier.',
    officialUrl:'https://console.anthropic.com/',officialPricingUrl:'https://www.anthropic.com/pricing?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',
    lastVerifiedDate:'11 November 2026',isFeaturedAI:true,iconName:'BrainCircuit',relatedProductSlugs:['claude'],relatedTutorialSlugs:[]
  },
  {
    id:'groqcloud',slug:'groqcloud',name:'GroqCloud',category:'AI & Generative AI',
    tagline:'Fast inference API for open and hosted language models.',
    summary:'GroqCloud offers low-latency inference with model-specific rate limits measured in requests and tokens.',
    description:['GroqCloud provides developer APIs for hosted model inference. Limits are organization-level and model-specific, measured across RPM, RPD, TPM and TPD, with separate audio limits where relevant.'],
    keyFeatures:['Low-latency model inference','OpenAI-compatible API patterns','Model-specific rate-limit dashboard','Text and audio model support'],
    typicalUseCases:['Fast chat APIs','Realtime assistants','Speech and transcription pipelines'],
    intendedAudience:['Developers','Professionals','Small Businesses'],
    platforms:['Web','API'],
    pricingStatus:'free_tier',pricingOverview:'Free developer access is available for eligible models; exact request and token caps vary by model and organization.',
    pricingNotes:'Check the live account Limits page; do not assume one fixed token quota applies to all models.',
    officialUrl:'https://console.groq.com/?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',officialPricingUrl:'https://console.groq.com/docs/rate-limits?utm_source=googletoolfinder&utm_medium=directory&utm_campaign=ai_tools',
    lastVerifiedDate:'11 November 2026',isFeaturedAI:true,iconName:'Zap',relatedProductSlugs:[],relatedTutorialSlugs:[]
  }
];
