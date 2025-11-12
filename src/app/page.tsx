export default function Home() {
  return (
    <main className="container">
      <div className="hero">
        <h1>🤯 Serenvale</h1>
        <p className="subtitle">AI-Powered Radiology Reporting System</p>

        <div className="features">
          <div className="feature-card">
            <h3>📋 Worklist</h3>
            <p>PACS integration & DICOM worklist management</p>
          </div>

          <div className="feature-card">
            <h3>🤖 AI Reports</h3>
            <p>GPT-4 powered radiology report generation</p>
          </div>

          <div className="feature-card">
            <h3>🔍 RAG Search</h3>
            <p>RadLex medical terminology with semantic search</p>
          </div>

          <div className="feature-card">
            <h3>📄 PDF Export</h3>
            <p>Professional report output</p>
          </div>
        </div>

        <div className="cta">
          <a href="/worklist" className="btn-primary">
            Accéder à la Liste de Travail
          </a>
          <a href="/settings" className="btn-secondary">
            Paramètres
          </a>
        </div>
      </div>
    </main>
  );
}
