import { useMemo } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useConfig } from '../store/configStore';
import { computeTabStats } from '../services/analytics';

function formatScoreLabel(score: string) {
  const value = Number(score);
  switch (value) {
    case 1:
      return 'Ruim';
    case 2:
      return 'Regular';
    case 3:
      return 'Ótimo'
    default:
      return score;
  }
}

export function ManagerDashboardPage() {
  const { tabs, responses } = useConfig();

  const stats = useMemo(() => computeTabStats(tabs, responses), [tabs, responses]);

  return (
    <AppShell variant="manager" title="Dashboard de avaliações">
      <div className="dashboard-grid">
        {stats.map((tab) => (
          <section key={tab.tabId} className="dashboard-card">
            <h2 className="dashboard-card__title">{tab.title}</h2>
            <p className="dashboard-card__metric">
              <span className="dashboard-card__metric-label">Total de respostas:</span>{' '}
              <strong>{tab.total}</strong>
            </p>
            <p className="dashboard-card__metric">
              <span className="dashboard-card__metric-label">Média:</span>{' '}
              <strong>{tab.average ? tab.average.toFixed(2) : '-'}</strong>
            </p>
            {tab.total > 0 && (
              <div className="dashboard-card__distribution">
                {Object.entries(tab.distribution)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([score, count]) => (
                    <div key={score} className="distribution-row">
                      <span className="distribution-label">{formatScoreLabel(score)}</span>
                      <div className="distribution-bar-wrapper">
                        <div
                          className="distribution-bar"
                          style={{ width: `${(count / tab.total) * 100}%` }}
                        />
                      </div>
                      <span className="distribution-count">{count}</span>
                    </div>
                  ))}
              </div>
            )}
          </section>
        ))}
        {stats.length === 0 && <p>Nenhuma aba configurada para exibir métricas.</p>}
      </div>
    </AppShell>
  );
}

