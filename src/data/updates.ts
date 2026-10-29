import { UpdateItem } from '../types';

export const LATEST_UPDATES: UpdateItem[] = [
  {
    id: 'google-gemini-small-business-oct-2026',
    date: '21 October 2026',
    title: 'Gemini introduces a dedicated hub for small businesses',
    category: 'AI Launch',
    productName: 'Google Gemini',
    summary: 'Google announced a business landing page in Gemini, with tools for brand creation, marketing content, financial insights and customer understanding. Connected services include Google Business Profile, Google Ads, Google Workspace and selected third-party apps. Availability is rolling out, so access may vary by account.',
    impact: 'Small businesses can explore brand-consistent content and analyze business records from a central Gemini workspace. Check your account for rollout availability before relying on a feature.',
    officialSourceUrl: 'https://blog.google/innovation-and-ai/products/gemini-app/new-tools-small-business-owners/'
  },
  {
    id: 'google-search-ai-links-oct-2026',
    date: '15 October 2026',
    title: 'Google updates links and source context in AI Mode and AI Overviews',
    category: 'New Feature',
    productName: 'Google Search',
    summary: 'Google announced clearer inline links, more prominent source links, contextual explanations for useful pages and wider rollout of timely article carousels in AI Search experiences.',
    impact: 'Publishers and researchers should check how their pages appear as cited sources in AI Search. The announcement describes testing and rollout, not a guarantee of traffic or placement.',
    officialSourceUrl: 'https://blog.google/products-and-platforms/products/search/updates-ai-mode-overviews-explore-web/'
  },
  {
    id: 'google-cloud-gemini-agent-oct-2026',
    date: '8 October 2026',
    title: 'Google Cloud introduces Gemini agent for workplace tasks',
    category: 'AI Launch',
    productName: 'Google Cloud',
    summary: 'At Gemini at Work 2026, Google Cloud announced Gemini agent capabilities for planning work, using skills and tools, connecting business systems and completing work across supported environments. Availability and capabilities depend on product, plan and administrator settings.',
    impact: 'Teams evaluating AI agents should review access, governance, data controls and pricing before using the capability in production.',
    officialSourceUrl: 'https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/gemini-at-work/'
  },
  {
    id: 'google-gemini-4-argon-oct-2026',
    date: '13 October 2026',
    title: 'Gemini 4 Argon arrives in the Gemini app for eligible subscribers',
    category: 'AI Launch',
    productName: 'Google Gemini',
    summary: 'Google announced Gemini 4 Argon for Google AI Pro and Ultra subscribers, with improved reasoning and coding, task-oriented workflows and expanded connected-app support. This announcement does not describe the model as a free-tier entitlement.',
    impact: 'Users should check their plan and regional availability before assuming they can access the model or agent features.',
    officialSourceUrl: 'https://blog.google/innovation-and-ai/products/gemini-app/gemini-4-argon-availability/'
  },
  {
    id: 'google-skills-gear-free-credits-2026',
    date: 'Checked 25 October 2026',
    title: 'Google Skills GEAR offers 35 monthly learning credits at no cost',
    category: 'Free Learning',
    productName: 'Google Skills / GEAR',
    summary: 'Google Skills describes GEAR as a no-cost subscription with 35 monthly credits for hands-on learning. Credits are for learning activities and do not mean that every professional certification exam is free.',
    impact: 'A useful starting point for learners exploring AI agents and Google Cloud skills. Check the official program page for current eligibility, credit terms and availability.',
    officialSourceUrl: 'https://www.skills.google/paths?locale=en'
  },
  {
    id: 'google-cloud-student-skills-credits-2026',
    date: 'Checked 25 October 2026',
    title: 'Eligible students can request 200 Google Skills credits',
    category: 'Free Learning',
    productName: 'Google Cloud for Students',
    summary: 'Google Cloud’s student page lists 200 Google Skills credits, no-cost hands-on labs and opportunities to earn skill badges. Eligibility applies, and a skill badge is not the same as a paid, proctored Google Cloud certification exam.',
    impact: 'Students should verify their eligibility and request credits through Google’s official student program before planning a learning path.',
    officialSourceUrl: 'https://cloud.google.com/edu/students'
  },
  {
    id: 'google-skills-badges-2026',
    date: 'Checked 25 October 2026',
    title: 'Explore Google Cloud and Google DeepMind skill badges',
    category: 'Free Learning',
    productName: 'Google Skills',
    summary: 'Google Skills provides learning paths and skill badges across areas including AI, machine learning, data, developer tools and security. Individual course and assessment terms can differ, so verify the current listing before describing a credential as free.',
    impact: 'Helps learners distinguish hands-on skill badges and learning certificates from professional certifications that require a proctored exam.',
    officialSourceUrl: 'https://www.skills.google/credentials/skill_badge'
  },
  {
    id: 'google-workspace-india-pricing',
    date: 'Check official pricing',
    title: 'Verify current Google Workspace India pricing before publishing offers',
    category: 'Pricing Update',
    productName: 'Google Workspace',
    summary: 'Workspace pricing and introductory promotions can change by plan, billing commitment and eligibility. This directory links to the official pricing page rather than promising a fixed promotional price without a current offer.',
    impact: 'Visitors can confirm the current price and terms for their account and region before subscribing.',
    officialSourceUrl: 'https://workspace.google.com/pricing'
  },
  {
    id: "litert-play-services-gpu-oct-2026",
    date: "28 October 2026",
    title: "LiteRT in Google Play services adds a faster GPU inference path",
    category: "New Feature",
    productName: "LiteRT",
    summary: "Google's Android and AI Edge teams announced a CompiledModel API path using ML Drift for GPU inference in LiteRT in Google Play services. Google reports around 1.4× faster GPU inference than the legacy GPU delegate in its testing and about 8 MB smaller apps when the runtime is supplied through Play services rather than bundled.",
    impact: "Android developers shipping on-device ML should compare the CompiledModel API and Play services option against their current runtime, while validating device compatibility and their own benchmarks.",
    officialSourceUrl: "https://developers.googleblog.com/en/smaller-apps-and-faster-gpu-inference-with-litert-in-google-play-services/"
  },
  {
    id: "litertjs-web-jul-2026",
    date: "9 July 2026",
    title: "LiteRT.js brings high-performance on-device AI inference to web apps",
    category: "New Feature",
    productName: "LiteRT.js",
    summary: "Google announced LiteRT.js, a JavaScript binding that brings LiteRT model inference into web browsers using WebAssembly, aimed at local execution, low latency and reduced dependence on server inference. Compatibility and model support should be checked in the official documentation.",
    impact: "Web developers can evaluate local inference for privacy-sensitive or latency-sensitive experiences and compare it with existing TensorFlow.js workflows.",
    officialSourceUrl: "https://developers.googleblog.com/litertjs-googles-high-performance-web-ai-inference/"
  },
  {
    id: "tensorflow-221-mar-2026",
    date: "6 March 2026",
    title: "TensorFlow 2.21 updates the framework and on-device AI ecosystem",
    category: "New Feature",
    productName: "TensorFlow",
    summary: "The TensorFlow 2.21 announcement highlights ecosystem updates including LiteRT's role as the successor to TensorFlow Lite, broader hardware acceleration support and improved maintenance of dependencies and security updates.",
    impact: "Teams maintaining TensorFlow or TensorFlow Lite projects should review the release notes and migration guidance before changing production runtimes.",
    officialSourceUrl: "https://developers.googleblog.com/en/search/?query=TensorFlow%202.21"
  },
  {
    id: "developer-knowledge-api-mcp-feb-2026",
    date: "4 February 2026",
    title: "Developer Knowledge API and MCP Server offer machine-readable Google documentation",
    category: "New Feature",
    productName: "Google Developer Knowledge API",
    summary: "Google introduced a public-preview API and MCP server to help AI assistants and agent platforms search and retrieve documentation across Firebase, Google Cloud, Android and other Google developer areas.",
    impact: "Developers building coding assistants can evaluate it as a documentation retrieval source, while checking preview limits and current API access requirements.",
    officialSourceUrl: "https://developers.googleblog.com/en/introducing-the-developer-knowledge-api-and-mcp-server/"
  },
  {
    id: "gemini-cli-subagents-apr-2026",
    date: "15 April 2026",
    title: "Gemini CLI adds subagents for parallel, specialized development work",
    category: "New Feature",
    productName: "Gemini CLI",
    summary: "Google's Gemini CLI update introduces configurable specialized agents that can work in isolated context windows and be delegated tasks through the CLI's agent workflow.",
    impact: "Developers can split complex work into bounded sub-tasks, but should still review generated changes, tool permissions and test results.",
    officialSourceUrl: "https://developers.googleblog.com/en/search/?query=subagents%20Gemini%20CLI"
  },
  {
    id: "gemma4-apr-2026",
    date: "2 April 2026",
    title: "Gemma 4 expands open models for agentic and on-device AI",
    category: "AI Launch",
    productName: "Gemma",
    summary: "Google DeepMind announced Gemma 4, an open model family focused on stronger reasoning and agentic workflows, with deployment options including Google AI Edge Gallery and LiteRT-LM. Hardware, model-size and license details vary by model.",
    impact: "Developers can explore local or self-managed model deployment, but should review the specific model card and license before commercial use.",
    officialSourceUrl: "https://developers.googleblog.com/en/search/?query=Gemma%204"
  },
  {
    id: "embeddinggemma2-oct-2026",
    date: "6 October 2026",
    title: "EmbeddingGemma 2 targets multimodal retrieval on edge devices",
    category: "AI Launch",
    productName: "EmbeddingGemma 2",
    summary: "Google announced an open-weight 740M-parameter multimodal embedding model intended to map text, images, video and audio into a shared vector space for retrieval workflows. Deployment options include MediaPipe Tasks and LiteRT.",
    impact: "Teams building local semantic search can evaluate it for media retrieval and intent routing, subject to model-card, device and license requirements.",
    officialSourceUrl: "https://developers.googleblog.com/en/search/?query=EmbeddingGemma%202"
  },
  {
    id: "functiongemma-edge-feb-2026",
    date: "26 February 2026",
    title: "FunctionGemma brings lightweight function calling to on-device AI",
    category: "AI Launch",
    productName: "FunctionGemma",
    summary: "Google introduced FunctionGemma, a 270M-parameter model tuned for action-oriented function calling on devices, with examples in Google AI Edge Gallery and LiteRT-LM.",
    impact: "Useful for developers exploring small, local assistants that trigger defined app actions; tool execution must still be permissioned and validated by the host application.",
    officialSourceUrl: "https://developers.googleblog.com/en/search/?query=FunctionGemma"
  },
  {
    id: "litert-tensor-api-oct-2026",
    date: "19 October 2026",
    title: "LiteRT Tensor API adds native C++ model-graph authoring for edge AI",
    category: "New Feature",
    productName: "LiteRT Tensor API",
    summary: "Google AI Edge introduced the LiteRT Tensor API to give developers native C++ control over model graphs and help unify machine-learning computations across heterogeneous edge hardware.",
    impact: "Edge developers can review the API for custom compute pipelines and verify hardware, operator and runtime support before adopting it.",
    officialSourceUrl: "https://developers.googleblog.com/en/search/?query=LiteRT%20Tensor%20API"
  },
  {
    id: "antigravity-local-models-sep-2026",
    date: "23 September 2026",
    title: "Antigravity SDK adds support for local AI models",
    category: "New Feature",
    productName: "Google Antigravity SDK",
    summary: "Google described support for running local models, including Gemma 4 variants through LiteRT, to enable hybrid workflows where cloud agents coordinate with local inference.",
    impact: "Developers can evaluate privacy-sensitive or offline model execution, while benchmarking device resources and reviewing the SDK's current setup requirements.",
    officialSourceUrl: "https://developers.googleblog.com/en/search/?query=Antigravity%20SDK"
  },
  {
    id: "antigravity-cli-io-2026",
    date: "19 May 2026",
    title: "Google introduces Antigravity CLI for agent-first terminal workflows",
    category: "AI Launch",
    productName: "Antigravity CLI",
    summary: "At Google I/O, Google presented Antigravity CLI as a terminal-oriented surface for creating and orchestrating agents as part of its agent-first developer platform. Product availability and migration guidance should be checked in current official documentation.",
    impact: "Teams using older Gemini CLI workflows should review Google's current transition guidance before starting a new setup.",
    officialSourceUrl: "https://developers.googleblog.com/en/search/?query=Antigravity%20CLI"
  }
];
