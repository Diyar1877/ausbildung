import React from 'react';
import { useParams } from 'react-router-dom';

const posts = {
  1: {
    title: 'Erste Schritte mit React',
    date: '27. Januar 2025',
    category: 'React',
    content: `
      Heute habe ich gelernt, wie man eine React-App erstellt. Hier sind die wichtigsten Schritte:

      1. Create React App Setup
      - npm create vite@latest für ein neues Projekt
      - Auswahl von React als Framework

      2. Komponenten erstellen
      - Komponenten sind wiederverwendbare UI-Teile
      - Jede Komponente ist eine JavaScript-Funktion
      - JSX wird für das Template verwendet

      3. Props und State
      - Props sind Daten von Eltern-Komponenten
      - State ist für lokale Komponenten-Daten
      
      Beispiel-Code:
      function Welcome(props) {
        return <h1>Hallo, {props.name}</h1>;
      }
    `
  },
  2: {
    title: 'HTML & CSS Grundlagen',
    date: '26. Januar 2025',
    category: 'Web',
    content: `
      Die wichtigsten HTML-Tags für den Anfang:

      1. Struktur-Tags
      - <header> für Kopfbereich
      - <nav> für Navigation
      - <main> für Hauptinhalt
      - <footer> für Fußbereich

      2. CSS-Grundlagen
      - Selektoren für Elementauswahl
      - Farben und Schriften
      - Flexbox für Layout
      
      Beispiel:
      .container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `
  },
  3: {
    title: 'JavaScript Arrays',
    date: '25. Januar 2025',
    category: 'JavaScript',
    content: `
      Array-Methoden in JavaScript:

      1. map()
      - Erstellt neues Array
      - Wendet Funktion auf jedes Element an
      
      2. filter()
      - Filtert Elemente nach Bedingung
      
      3. reduce()
      - Reduziert Array auf einen Wert
      
      Beispiel:
      const zahlen = [1, 2, 3, 4];
      const verdoppelt = zahlen.map(x => x * 2);
    `
  }
};

const PostDetail = () => {
  const { id } = useParams();
  const post = posts[id];

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Post nicht gefunden</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-white rounded-lg shadow-lg p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div className="text-gray-600">
            {post.date} • {post.category}
          </div>
        </header>
        
        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
