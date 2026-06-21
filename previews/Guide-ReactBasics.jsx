import React from 'react';

/**
 * A simple guide on creating React projects.
 * This file serves as an example for Simple-Server-1.0 to host.
 */
export default function ReactBasicsGuide() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6' }}>
      <h1>Getting Started with React</h1>
      <p>React is a popular JavaScript library for building user interfaces.</p>
      
      <h2>1. Creating a New Project</h2>
      <p>
        The easiest way to start a new React project is by using a tool like Vite.
        Run the following command in your terminal:
      </p>
      <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '4px' }}>
        <code>npm create vite@latest my-react-app -- --template react</code>
      </pre>

      <h2>2. Understanding Components</h2>
      <p>
        In React, UIs are built out of small, reusable pieces called components.
        A component is simply a JavaScript function that returns JSX.
      </p>

      <h2>3. State and Props</h2>
      <ul>
        <li><strong>Props:</strong> Used to pass data from a parent component to a child component.</li>
        <li><strong>State:</strong> Used to manage data within a component that changes over time.</li>
      </ul>
      
      <p>
        <i>Happy Coding!</i>
      </p>
    </div>
  );
}
