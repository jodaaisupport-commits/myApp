import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: 'Bitte gib eine gültige Frage oder Aufgabe ein.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const lower = message.toLowerCase();
      let reply = 'Ein sinnvoller Weg ist: Ziel definieren, Basismodell wählen, Datensatz auswählen, mit Prompts prototypen und anschließend eine Validierung vor der Bereitstellung durchführen.';

      if (lower.includes('modell') || lower.includes('bauen')) {
        reply = 'Ich kann dir dabei helfen, einen Modellplan zu strukturieren: Wähle eine Aufgabe, definiere Datenquellen, setze Metriken und erstelle eine Evaluationsschleife.';
      } else if (lower.includes('train') || lower.includes('datensatz')) {
        reply = 'Für das Training brauchst du hochwertige Daten, eine Validierung auf separaten Beispielen und eine Feinabstimmung von Hyperparametern wie Lernrate und Batchgröße.';
      } else if (lower.includes('fein') || lower.includes('optimier')) {
        reply = 'Um deinen Assistenten auf Tonfall und Aufgabenleistung zu optimieren, nutze domänenspezifische Prompts, einen klaren Anweisungsumfang und menschliches Feedback.';
      }

      return NextResponse.json({ reply });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Du bist ein hilfsbereiter AI Studio-Assistent für Produktentwicklung und KI-Trainingsprozesse.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: 'Der Chat-Request konnte nicht verarbeitet werden. Bitte prüfe KEY und Konfiguration.' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? 'Kein Inhalt zurückgegeben.';

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: 'Ein interner Fehler ist aufgetreten. Bitte prüfe die Server-Konfiguration.' }, { status: 500 });
  }
}
