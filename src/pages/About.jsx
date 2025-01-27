import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Über mich</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Mein Weg zum Fachinformatiker</h2>
        <p className="text-gray-600 mb-4">
          Ich befinde mich derzeit in der Ausbildung zum Fachinformatiker für Anwendungsentwicklung.
          Diese Website dient als persönliches Lerntagebuch und als Plattform, um mein Wissen mit anderen zu teilen.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Was ich lerne:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Webentwicklung (HTML, CSS, JavaScript)</li>
          <li>Frontend-Frameworks (React, Vue.js)</li>
          <li>Backend-Entwicklung</li>
          <li>Datenbanken</li>
          <li>Software Engineering Prinzipien</li>
        </ul>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Über diese Website</h2>
        <p className="text-gray-600 mb-4">
          Diese Plattform ist mehr als nur ein Blog - sie ist meine persönliche Lernreise. 
          Hier dokumentiere ich meine Fortschritte, teile meine Erkenntnisse und stelle 
          Projekte vor, an denen ich arbeite.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Was du hier findest:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Tutorials zu verschiedenen Programmier-Themen</li>
          <li>Dokumentation meiner Lernfortschritte</li>
          <li>Praktische Projekte aus der Ausbildung</li>
          <li>Tipps und Best Practices</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
