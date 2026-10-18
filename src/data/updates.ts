import { UpdateItem } from '../types';

export const LATEST_UPDATES: UpdateItem[] = [
  {
    id: 'update-1',
    date: 'October 2026',
    title: 'Gemini 2.0 Multimodal Reasoning & Canvas Enhancements',
    category: 'AI Launch',
    productName: 'Gemini',
    summary: 'Google introduced expanded multimodal reasoning in Gemini with split-screen Canvas workflows, allowing real-time code iteration and automated documentation drafting for web applications.',
    impact: 'Developers and writers can iteratively refactor blocks of text or code without regenerating the entire conversational response.',
    officialSourceUrl: 'https://blog.google/technology/ai/'
  },
  {
    id: 'update-2',
    date: 'September 2026',
    title: 'NotebookLM Expands Audio Overviews Worldwide',
    category: 'New Feature',
    productName: 'NotebookLM',
    summary: 'NotebookLM introduced expanded multi-speaker Audio Overview generation with customizable depth controls, letting users select between brief summaries and deep academic analysis.',
    impact: 'Students and researchers can turn complex 100-page papers into accessible audio discussions for listening on the go.',
    officialSourceUrl: 'https://blog.google/technology/ai/notebooklm-audio-overviews/'
  },
  {
    id: 'update-3',
    date: 'August 2026',
    title: 'Google Workspace India Annual Commitment Discounts',
    category: 'Pricing Update',
    productName: 'Google Workspace',
    summary: 'Google rolled out localized Indian Rupee introductory pricing for Workspace Business Starter for newly registered Indian business domains committed for 12 months.',
    impact: 'Small businesses in India can acquire professional custom email starting from ₹136/user/month for the initial year.',
    officialSourceUrl: 'https://workspace.google.com/pricing'
  },
  {
    id: 'update-4',
    date: 'July 2026',
    title: 'Google Cloud Free Tier BigQuery Allowance Refreshed',
    category: 'India Offer',
    productName: 'Google Cloud Platform',
    summary: 'Reaffirmation of BigQuery Sandbox terms: 1 TB of query processing and 10 GB of active storage remain completely free every single calendar month without requiring a credit card.',
    impact: 'Data analysts and students in India can practice SQL and run large-scale dataset experiments at zero cost.',
    officialSourceUrl: 'https://cloud.google.com/free'
  },
  {
    id: 'update-5',
    date: 'June 2026',
    title: 'Google AI Studio Structured Output Schema Engine',
    category: 'New Feature',
    productName: 'Google AI Studio',
    summary: 'Google AI Studio updated its UI to include an interactive JSON Schema Builder, guaranteeing strict type conformance for backend API integrations and agent tool-calling.',
    impact: 'Developers no longer need external regex or parsing libraries to ensure clean JSON output from Gemini.',
    officialSourceUrl: 'https://ai.google.dev'
  }
];
