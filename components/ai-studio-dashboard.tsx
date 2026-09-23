'use client';

import { useMemo, useState } from 'react';
import { communityPosts, datasets, demoPromptSuggestions, modelSettings, tutorials } from '@/lib/data';

const initialMessages = [
  { id: 'welcome', role: 'assistant', content: 'Willkommen zurück! Ich kann dir helfen, ein neues Modell zu entwerfen, eine Trainingspipeline vorzubereiten oder passende Datensätze für dein Projekt zu empfehlen.' },
  { id: 'u1', role: 'user', content: 'Ich möchte einen KI-Assistenten für Produktideen und Kundenservice bauen.' },
  { id: 'a1', role: 'assistant', content: 'Perfekt. Starte mit einem konversationellen Modell mit Retrieval-Augmented Generation, trainiere mit Support-Tickets, Produktspezifikationen und FAQs und verfeinere dann die Sprache und das Werkzeugverhalten.' },
] as const;

type Tab = 'chat' | 'models' | 'datasets' | 'tutorials' | 'community' | 'connectors';

export function AIStudioDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trainingState, setTrainingState] = useState<'ready' | 'training'>('ready');
  const [settings, setSettings] = useState<Record<string, number>>({
    learningRate: 0.002,
    epochs: 8,
    batchSize: 32,
    contextWindow: 4096,
  });
  const [connectorActive, setConnectorActive] = useState(true);

  const stats = useMemo(
    () => [
      { label: 'aktive Builder', value: '18K' },
      { label: 'trainierte Modelle', value: '420' },
      { label: 'Einrichtungsquote', value: '96%' },
    ],
    [],
  );

  const sendPrompt = async (value?: string) => {
    const text = (value ?? draft).trim();
    if (!text) return;

    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, content: text };
    setMessages((current) => [...current, userMessage]);
    setDraft('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: data.reply ?? 'Ich habe die Anfrage erhalten und bin dabei, einen passenden Vorschlag zu formulieren.',
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Die Demo-Antwort ist aktiv. Stelle eine API-Umgebung mit OPENAI_API_KEY bereit, damit der echte Chat-Mode funktioniert.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSlider = (key: keyof typeof settings, value: number) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const startTraining = () => {
    setTrainingState('training');
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content: `Training gestartet mit Lernrate ${settings.learningRate}, ${settings.epochs} Epochen, Batchgröße ${settings.batchSize}, Kontext ${settings.contextWindow}.`,
      },
    ]);

    setTimeout(() => {
      setTrainingState('ready');
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Die Trainingspipeline wurde initialisiert. Das Modell validiert anhand von Benchmark-Daten und wird mit der gewählten Konfiguration verfeinert.',
        },
      ]);
    }, 900);
  };

  const tabButtons: Array<{ key: Tab; label: string }> = [
    { key: 'chat', label: 'Chat' },
    { key: 'models', label: 'Modelle' },
    { key: 'datasets', label: 'Datensätze' },
    { key: 'tutorials', label: 'Tutorials' },
    { key: 'community', label: 'Community' },
    { key: 'connectors', label: 'Connector' },
  ];

  const renderChat = () => (
    <div className="rounded-3xl border border-slate-700/80 bg-slate-950/70 p-4 shadow-glow">
      <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-500 font-bold text-slate-950">AI</div>
          <div>
            <div className="font-semibold">Assistent</div>
            <div className="text-xs text-slate-400">Prompt Studio</div>
          </div>
        </div>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-cyan-300">online</span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: 370 }}>
        {messages.map((message) => (
          <div key={message.id} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'ml-auto bg-gradient-to-br from-cyan-500 to-violet-600 text-white' : 'border border-slate-800 bg-slate-900/80 text-slate-100'}`}>
            {message.content}
          </div>
        ))}
        {isLoading && <div className="max-w-[88%] rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">Denke nach…</div>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {demoPromptSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setDraft(suggestion)}
            className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-slate-800 pt-4">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') sendPrompt();
          }}
          placeholder="Frage stellen oder Aufgabe vorschlagen..."
          className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-cyan-400/60"
        />
        <button type="button" onClick={() => sendPrompt()} className="rounded-2xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-95">
          Senden
        </button>
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5 shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Modell-Builder</h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">Anpassbar</span>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-medium">Adaptives Chat-Modell</div>
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${trainingState === 'ready' ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-400/30 bg-amber-500/10 text-amber-300'}`}>
              {trainingState === 'ready' ? 'Bereit' : 'Training'}
            </span>
          </div>

          <div className="space-y-4">
            {modelSettings.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{setting.label}</span>
                  <strong className="text-slate-200">{settings[setting.key as keyof typeof settings]}</strong>
                </div>
                <input
                  type="range"
                  min={setting.min}
                  max={setting.max}
                  step={setting.step}
                  value={settings[setting.key as keyof typeof settings]}
                  onChange={(event) => updateSlider(setting.key as keyof typeof settings, Number(event.target.value))}
                  className="h-2 w-full cursor-pointer accent-cyan-400"
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">Optimiert für Q&A und Workflow-Automatisierung</div>
            <button type="button" onClick={startTraining} className="rounded-xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-2.5 text-sm font-semibold text-slate-950">Jetzt trainieren</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatasets = () => (
    <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5 shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Beliebte Datensätze</h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300">Kuratiert</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {datasets.map((dataset) => (
          <div key={dataset.name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 inline-flex rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-200">{dataset.tag}</div>
            <h4 className="mb-2 text-lg font-semibold">{dataset.name}</h4>
            <p className="text-sm leading-6 text-slate-400">{dataset.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-transparent p-4">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-lg font-bold text-cyan-300">D</div>
            <div>
              <div className="font-semibold">dahl.global</div>
              <div className="text-xs text-slate-400">Connector</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            {connectorActive ? 'Verbunden' : 'Getrennt'}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button type="button" onClick={() => setConnectorActive((current) => !current)} className="rounded-xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-2.5 text-sm font-semibold text-slate-950">
            {connectorActive ? 'Connector synchronisieren' : 'Verbinden'}
          </button>
          <button type="button" onClick={() => setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', content: 'Der dahl.global-Connector stellt Datensatz-Schemata, API-Endpunkte und Modell-Sync-Metadaten für eine nahtlose KI-Integration bereit.' }])} className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200">
            Schema ansehen
          </button>
        </div>
      </div>
    </div>
  );

  const renderTutorials = () => (
    <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5 shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Lern-Tutorials</h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300">Einsteiger bis Experte</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tutorials.map((tutorial, index) => (
          <div key={tutorial.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-300">{String(index + 1).padStart(2, '0')}</div>
            <h4 className="mb-2 text-lg font-semibold">{tutorial.title}</h4>
            <p className="text-sm leading-6 text-slate-400">{tutorial.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5 shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Community</h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">Zusammenarbeiten</span>
      </div>

      <div className="space-y-3">
        {communityPosts.map((post) => (
          <div key={post.author} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-xs font-bold text-slate-100">{post.initials}</div>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-xs text-slate-400">Geteilt: “{post.title}”</div>
              </div>
            </div>
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-cyan-300">{post.score}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConnector = () => (
    <div className="rounded-3xl border border-slate-700/80 bg-slate-950/60 p-5 shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight">Connector</h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-300">dahl.global</span>
      </div>

      <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-xl font-bold text-cyan-300">D</div>
            <div>
              <div className="font-semibold">dahl.global</div>
              <div className="text-xs text-slate-400">Schnittstelle zu externen KI-Daten und Modellen</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            {connectorActive ? 'Verbunden' : 'Getrennt'}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-slate-400">Status</div>
            <div className="mt-2 text-lg font-semibold">{connectorActive ? 'Aktiv und synchronisiert' : 'Bereit zum Verbinden'}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-xs uppercase tracking-[0.12em] text-slate-400">API</div>
            <div className="mt-2 text-lg font-semibold">REST / Webhook bereit</div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={() => setConnectorActive((current) => !current)} className="rounded-xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-2.5 text-sm font-semibold text-slate-950">{connectorActive ? 'Connector synchronisieren' : 'Verbinden'}</button>
          <button type="button" className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200">Konfiguration öffnen</button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] rounded-[28px] border border-slate-800/80 bg-slate-950/60 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <header className="flex flex-col gap-4 border-b border-slate-800/90 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 font-black text-slate-900">AI</div>
            <div className="text-lg font-semibold tracking-tight">AI Studio</div>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            {tabButtons.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`transition ${activeTab === tab.key ? 'text-white' : 'hover:text-slate-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">Arbeitsbereich</button>
            <button type="button" className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">Teilen</button>
            <button type="button" className="rounded-xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950">Starten</button>
          </div>
        </header>

        <div className="grid gap-8 p-5 md:grid-cols-[280px_minmax(0,1fr)] md:p-6 xl:p-8">
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-sm font-bold text-cyan-300">S</div>
              <div>
                <div className="font-semibold">Studio Hub</div>
                <div className="text-xs text-slate-400">Kreatives AI-Labor</div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Arbeitsbereich</div>
                <div className="space-y-2">
                  {['Übersicht', 'Modell-Builder', 'Experimente', 'Datenbibliothek'].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-[10px] text-cyan-300">◫</span>
                        {item}
                      </div>
                      {item === 'Modell-Builder' && <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-emerald-300">Live</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Schnellstart</div>
                <div className="space-y-2">
                  {['Modell verfeinern', 'Datensatz importieren', 'Assistent bereitstellen'].map((item) => (
                    <div key={item} className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-sm text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-[10px] text-cyan-300">✦</span>
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[28px] border border-slate-800 bg-slate-900/45 p-6 sm:p-7">
                <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-300">Neue KI-Erfahrung</div>
                <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl xl:text-[4rem]">Baue, trainiere und entdecke dein nächstes KI-System.</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Gestalte individuelle Assistenten, verfeinere Modelle und arbeite mit einer Community aus kreativen Entwicklern zusammen. Stelle Fragen, schlage Aufgaben vor und überbrücke die Lücke von der Idee bis zur Bereitstellung in einem intuitiven Workspace.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', content: 'Erstelle ein neues Projekt für einen Support-Assistenten mit Prompt-Templates, Evaluierung und Deployment.' }, { id: crypto.randomUUID(), role: 'assistant', content: 'Ich habe eine Starter-Struktur für einen Support-Assistenten vorbereitet: Datenerfassung, Prompt-Design, Feinabstimmung, Evaluierung und Deployment-Checkliste.' }])} className="rounded-xl bg-gradient-to-r from-cyan-300 to-violet-500 px-4 py-2.5 text-sm font-semibold text-slate-950">Projekt erstellen</button>
                  <button type="button" onClick={() => setDraft('Wie sollte ich ein einsteigerfreundliches KI-Projekt strukturieren?')} className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200">KI fragen</button>
                  <button type="button" className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200">Vorlagen ansehen</button>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                      <div className="text-2xl font-bold tracking-[-0.05em] text-white">{stat.value}</div>
                      <div className="mt-1 text-xs text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="xl:pl-0">{renderChat()}</div>
            </section>

            {activeTab === 'chat' && renderChat()}
            {activeTab === 'models' && renderModels()}
            {activeTab === 'datasets' && renderDatasets()}
            {activeTab === 'tutorials' && renderTutorials()}
            {activeTab === 'community' && renderCommunity()}
            {activeTab === 'connectors' && renderConnector()}
          </div>
        </div>
      </div>
    </main>
  );
}
