import { useMemo, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useConfig } from '../store/useConfig';
import type { ReviewTabConfig } from '../models/review';

type EditableTab = ReviewTabConfig;

function createEmptyTab(nextOrder: number): EditableTab {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    questionText: '',
    scaleType: 'faces',
    maxScore: 3,
    color: '#4caf50',
    order: nextOrder,
    isActive: true,
  };
}

export function ManagerTabsPage() {
  const { tabs, upsertTab, removeTab } = useConfig();
  const [editing, setEditing] = useState<EditableTab | null>(null);

  const orderedTabs = useMemo(
    () => [...tabs].sort((a, b) => a.order - b.order),
    [tabs],
  );

  const startCreate = () => {
    setEditing(createEmptyTab(orderedTabs.length));
  };

  const startEdit = (tab: ReviewTabConfig) => {
    setEditing({ ...tab });
  };

  const handleChange = (field: keyof EditableTab, value: unknown) => {
    setEditing((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing || !editing.title || !editing.questionText) {
      return;
    }
    try {
      await upsertTab(editing);
      setEditing(null);
    } catch (error) {
      console.error('Erro ao salvar aba:', error);
    }
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Remover esta aba de avaliação?')) {
      removeTab(id);
    }
  };

  const handleMove = (id: string, delta: number) => {
    const currentIndex = orderedTabs.findIndex((tab) => tab.id === id);
    if (currentIndex === -1) return;
    const newIndex = currentIndex + delta;
    if (newIndex < 0 || newIndex >= orderedTabs.length) return;

    const updated = [...orderedTabs];
    const [moved] = updated.splice(currentIndex, 1);
    updated.splice(newIndex, 0, moved);

    updated.forEach((tab, index) => {
      upsertTab({ ...tab, order: index });
    });
  };

  return (
    <AppShell variant="manager" title="Configurar abas de avaliação">
      <div className="manager-tabs-layout">
        <section className="manager-tabs-list">
          <div className="manager-tabs-header">
            <h2>Abas configuradas</h2>
            <button type="button" className="primary-button" onClick={startCreate}>
              Nova aba
            </button>
          </div>
          {orderedTabs.length === 0 ? (
            <p>Nenhuma aba configurada ainda.</p>
          ) : (
            <ul className="manager-tabs-items">
              {orderedTabs.map((tab) => (
                <li key={tab.id} className="manager-tab-item">
                  <div className="manager-tab-main">
                    <div>
                      <div className="manager-tab-title">
                        {tab.title}{' '}
                        {!tab.isActive && <span className="manager-tab-badge">Inativa</span>}
                      </div>
                      <div className="manager-tab-question">{tab.questionText}</div>
                    </div>
                  </div>
                  <div className="manager-tab-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleMove(tab.id, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleMove(tab.id, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => startEdit(tab)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleRemove(tab.id)}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="manager-tab-form-section">
          <h2>{editing ? 'Editar aba' : 'Detalhes da aba'}</h2>
          {editing ? (
            <form className="manager-tab-form" onSubmit={handleSubmit}>
              <label className="form-field">
                Título
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </label>
              <label className="form-field">
                Pergunta exibida no totem
                <input
                  type="text"
                  value={editing.questionText}
                  onChange={(e) => handleChange('questionText', e.target.value)}
                  required
                />
              </label>
              <label className="form-field">
                Descrição (opcional)
                <input
                  type="text"
                  value={editing.description ?? ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </label>
              <label className="form-field form-field--inline">
                Ativa
                <input
                  type="checkbox"
                  checked={editing.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                />
              </label>
              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Salvar
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <p>Selecione uma aba para editar ou crie uma nova.</p>
          )}
        </section>
      </div>
    </AppShell>
  );
}

