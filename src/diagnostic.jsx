import { createRoot } from 'react-dom/client'

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <div style={{ padding: '2rem', background: '#0a0e1a', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '2rem' }}>FundFlow Diagnostic: App is Mounting!</h1>
    </div>
  );
} else {
  console.error('Root element not found!');
}
