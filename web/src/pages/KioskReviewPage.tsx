import { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useConfig } from '../store/useConfig';
import { RatingControl } from '../components/RatingControl';
import type { ReviewTabConfig } from '../models/review';

export function KioskReviewPage() {
  const { tabs, addResponse } = useConfig();
  const [showThanks, setShowThanks] = useState(false);

  const activeTabs = tabs
    .filter((tab) => tab.isActive)
    .sort((a, b) => a.order - b.order);

  const handleRate = (tab: ReviewTabConfig, score: number) => {
    addResponse({
      tabId: tab.id,
      score,
      createdAt: new Date().toISOString(),
    });

    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 3000);
  };

  return (
    <AppShell variant="kiosk" title="Como foi sua experiência hoje?">
      <div className="kiosk-tabs-grid">
        {activeTabs.map((tab) => (
          <div key={tab.id} className="kiosk-tab-card">
            <h2 className="kiosk-tab-title">{tab.title}</h2>
            <p className="kiosk-tab-question">{tab.questionText}</p>
            <RatingControl
              maxScore={tab.maxScore}
              scaleType={tab.scaleType}
              onSelect={(score) => handleRate(tab, score)}
            />
          </div>
        ))}
      </div>

      {showThanks && (
        <div className="review-modal-backdrop">
          <div className="review-modal">Obrigado pela sua avaliação!</div>
        </div>
      )}
    </AppShell>
  );
}

