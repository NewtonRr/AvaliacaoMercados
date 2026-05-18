import { useMemo, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useConfig } from '../store/useConfig';
import { computeTabStats } from '../services/analytics';

type Period = 'all' | '7d' | '30d' | '90d';

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: 'Tudo', value: 'all' },
  { label: 'Última semana', value: '7d' },
  { label: 'Último mês', value: '30d' },
  { label: 'Últimos 3 meses', value: '90d' },
];

function getPeriodStart(period: Period): Date | null {
  if (period === 'all') return null;
  const days = { '7d': 7, '30d': 30, '90d': 90 }[period];
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}


function formatScoreLabel(score: string) {
  const value = Number(score);
  switch (value) {
    case 1:
      return 'Ruim';
    case 2:
      return 'Regular';
    case 3:
      return 'Ótimo';
    default:
      return score;
  }
}

export function ManagerDashboardPage() {
  const { tabs, responses } = useConfig();
  const [period, setPeriod] = useState<Period>('all');

  const filteredResponses = useMemo(() => {
    const start = getPeriodStart(period);
    if (!start) return responses;
    return responses.filter((r) => {
      const date = new Date(r.createdAt);
      return date >= start;
    });
  }, [responses, period]);

   const stats = useMemo(
    () => computeTabStats(tabs, filteredResponses),
    [tabs, filteredResponses]
  );

  return (
    <AppShell variant="manager">
      <div className="dashboard-filters">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`filter-btn ${period === opt.value ? 'filter-btn--active' : ''}`}
            onClick={() => setPeriod(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
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

