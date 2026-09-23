export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export const demoPromptSuggestions = [
  'Modell bauen',
  'Mit Dokumenten trainieren',
  'Für Chat optimieren',
  'Welche Datensätze sind geeignet?',
];

export const modelSettings = [
  { key: 'learningRate', label: 'Lernrate', value: 0.002, min: 0.0001, max: 0.01, step: 0.0001 },
  { key: 'epochs', label: 'Epochen', value: 8, min: 1, max: 20, step: 1 },
  { key: 'batchSize', label: 'Batchgröße', value: 32, min: 8, max: 128, step: 8 },
  { key: 'contextWindow', label: 'Kontextfenster', value: 4096, min: 512, max: 16384, step: 512 },
] as const;

export const datasets = [
  { name: 'OpenWebText', tag: 'Open Data', description: 'Großer Textkorpus für Sprachmodellierung, Feinabstimmung und allgemeine Textgenerierung.' },
  { name: 'SQuAD', tag: 'QA', description: 'Strukturierte Lernfragen für Leseverständnis, Frage-Antwort-Systeme und Kontextmodelle.' },
  { name: 'Kundensupport', tag: 'Support', description: 'Support-Logs und Gesprächsverläufe für dienstleistungsorientierte AI-Assistenten.' },
  { name: 'CodeAlpaca', tag: 'Code', description: 'Instruktionsbasierte Codebeispiele für Coding-Assistenten und Entwickler-Workflows.' },
];

export const tutorials = [
  {
    id: 'llm-foundations',
    title: 'Einführung in LLM-Grundlagen',
    description: 'Verstehe Tokens, Embeddings, Feinabstimmung und Modellarchitektur in einer verständlichen Einführung.',
  },
  {
    id: 'first-chatbot',
    title: 'Erstelle deinen ersten Chatbot',
    description: 'Baue einen Assistenten mit Prompt-Design, Gedächtnis und Evaluationsschleife.',
  },
  {
    id: 'domain-tuning',
    title: 'Feinabstimmung für Domänenaufgaben',
    description: 'Passe ein Basismodell auf spezifische Arbeitsabläufe und Fachsprachen an.',
  },
  {
    id: 'deploy-monitor',
    title: 'Bereitstellung und Überwachung',
    description: 'Lerne, wie du KI-Systeme mit Schutzmechanismen und Evaluierung zuverlässiger machst.',
  },
];

export const communityPosts = [
  { author: 'Ava Moore', initials: 'AM', title: 'AI Research Copilot', score: '+312' },
  { author: 'Jon Kim', initials: 'JK', title: 'Feinabstimmungs-Recipe für Mehrsprachigkeit', score: '+104' },
  { author: 'Rina M.', initials: 'RM', title: 'Prompt-Bibliothek für Design-Teams', score: '+89' },
];
