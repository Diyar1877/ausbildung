import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

const Post = () => {
  const { subject, id } = useParams();
  const location = useLocation();
  const fromHomepage = location.state?.from === 'homepage';

  const posts = {
    'Englisch': {
      1: {
        title: 'Present Perfect',
        date: '27.01.2025',
        content: `Heute habe ich das Present Perfect gelernt. Es wird verwendet, wenn eine Handlung in der Vergangenheit begonnen hat und bis zur Gegenwart andauert.

Wichtige Regeln:
- Wird mit "have/has" + Partizip Perfekt gebildet
- Signalwörter sind "since" (seit) und "for" (für/seit)
- Wird oft mit Zeiträumen verwendet

Beispiele:
1. I have lived here for 10 years.
2. She has worked at this company since 2020.
3. We have been friends since childhood.

Übungen die wir gemacht haben:
1. Fill in the gaps
2. Create your own sentences
3. Group conversation practice

Hausaufgaben:
- 10 eigene Sätze schreiben
- Online Übungen auf englisch-hilfen.de
- Vokabeln wiederholen`,
        subject: 'Englisch'
      }
    },
    'Anwendungsentwicklung': {
      2: {
        title: 'React Components',
        date: '26.01.2025',
        content: `Heute habe ich gelernt, wie man React Components erstellt und verwendet.

Wichtige Konzepte:
- Funktionale Components vs. Klassen-Components
- Props und State
- JSX Syntax
- Component Lifecycle

Code Beispiel:
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

Vorteile von Components:
- Wiederverwendbarkeit
- Übersichtlicher Code
- Einfache Wartung
- Bessere Testbarkeit

Nächste Schritte:
- Mehr über Hooks lernen
- Routing verstehen
- State Management vertiefen`,
        subject: 'Anwendungsentwicklung'
      }
    }
  };

  const post = posts[subject]?.[id];

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 mb-32">
        <p className="text-gray-600">Post nicht gefunden.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Zurück zur Startseite
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-32">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link 
            to={fromHomepage ? "/" : `/subject/${post.subject}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← {fromHomepage ? "Zurück zur Startseite" : `Zurück zu ${post.subject}`}
          </Link>
        </div>
        
        <article className="bg-white rounded-lg shadow-md p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
            <div className="text-sm text-gray-500">{post.date}</div>
          </header>
          
          <div className="prose max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default Post;
