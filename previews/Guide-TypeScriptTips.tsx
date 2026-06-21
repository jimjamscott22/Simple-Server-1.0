import React, { useState } from 'react';

// Interfaces define the shape of your data
interface GuideProps {
  title: string;
  author?: string; // Optional property
}

/**
 * A simple guide on using TypeScript with React.
 * This file serves as a .tsx example for Simple-Server-1.0.
 */
export const TypeScriptTipsGuide: React.FC<GuideProps> = ({ title, author = 'Anonymous' }) => {
  // TypeScript automatically infers the type of state based on initial value
  const [likes, setLikes] = useState<number>(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <h1>{title}</h1>
        <p>Written by: <strong>{author}</strong></p>
      </header>

      <section style={{ marginTop: '20px' }}>
        <h2>Why use TypeScript?</h2>
        <ul>
          <li><strong>Type Safety:</strong> Catch errors at compile-time rather than runtime.</li>
          <li><strong>Autocompletion:</strong> Better editor support with IDEs like VS Code.</li>
          <li><strong>Self-Documenting:</strong> Interfaces and types act as documentation for your code.</li>
        </ul>

        <h2>Defining Props</h2>
        <p>
          Always define the props your component expects using an <code>interface</code> or a <code>type</code> alias.
          This ensures you don't accidentally pass the wrong data types.
        </p>

        <button 
          onClick={() => setLikes(likes + 1)}
          style={{ padding: '8px 16px', background: '#007acc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Like this Guide ({likes})
        </button>
      </section>
    </div>
  );
};

export default TypeScriptTipsGuide;
