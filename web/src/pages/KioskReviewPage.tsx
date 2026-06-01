import { useCallback, useEffect, useRef, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useConfig } from '../store/useConfig';
import { RatingControl } from '../components/ratingControl/RatingControl';
import type { PendingScore, ReviewTabConfig } from '../models/review';
import { uploadScores } from '../services/reviewStorage';
import { useParams } from 'react-router-dom';
import { fetchTimer } from '../components/FunctionTimer/timer';

const FALLBACK_TIMEOUT = 30; 

export function KioskReviewPage() {
  const { idLoja } = useParams<{ idLoja: string }>();
  const { tabs, addResponse } = useConfig();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showThanks, setShowThanks] = useState(false);
  const [pendingScores, setPendingScores] = useState<PendingScore[]>([]);

  const [timeoutSeconds, setTimeoutSeconds] = useState(FALLBACK_TIMEOUT); // ← dynamic
  const [countdown, setCountdown] = useState(FALLBACK_TIMEOUT);

  const timerStartRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!idLoja) return;

    fetchTimer(idLoja)
      .then((value) => {
        if (value !== null) {
          setTimeoutSeconds(value);
          setCountdown(value); 
        }
      })
      .catch(() => {});
  }, [idLoja]);

  const cancelSurvey = useCallback(() => {
    setPendingScores([]);
    setCurrentIndex(0);
    setStarted(false);
    setCountdown(timeoutSeconds);
  }, [timeoutSeconds]);

  useEffect(() => {
    if (!started || showThanks) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    timerStartRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - (timerStartRef.current ?? Date.now())) / 1000;
      const remaining = Math.ceil(timeoutSeconds - elapsed); 

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        cancelSurvey();
      } else {
        setCountdown(remaining);
      }
    }, 200);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [started, currentIndex, showThanks, cancelSurvey, timeoutSeconds]);

  if (!idLoja) return <div>Invalid store ID</div>;

  const activeTabs = tabs
    .filter((tab) => tab.isActive)
    .sort((a, b) => a.order - b.order);

  const handleRate = (tab: ReviewTabConfig, score: number) => {
    const updatedScores = [...pendingScores, { tabId: tab.id, score }];
    setPendingScores(updatedScores);

    const isLast = currentIndex === activeTabs.length - 1;

    if (isLast) {
      updatedScores.forEach(({ tabId, score }) => {
        addResponse({ tabId, score, createdAt: new Date().toISOString() });
      });

      uploadScores(updatedScores, idLoja);
      setShowThanks(true);
      setTimeout(() => {
        setShowThanks(false);
        setStarted(false);
        setCurrentIndex(0);
        setPendingScores([]);
      }, 3000);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleStart = () => {
    setCurrentIndex(0);
    setPendingScores([]);
    setCountdown(timeoutSeconds);
    setStarted(true);
  };

  const currentTab = activeTabs[currentIndex];

  if (!started) {
    return (
      <AppShell variant="kiosk">
        <div className="kiosk-start-screen">
          <p className="kiosk-start-subtitle">
            Responda algumas perguntas rápidas sobre sua visita.
          </p>
          <button className="primary-button kiosk-start-btn" onClick={handleStart}>
            Iniciar Avaliação
          </button>
        </div>
      </AppShell>
    );
  }

  if (showThanks) {
    return (
      <AppShell variant="kiosk">
        <div className="kiosk-thanks-screen">
          <div className="kiosk-thanks-icon">✓</div>
          <p className="kiosk-thanks-text">Obrigado pela sua avaliação!</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell variant="kiosk">
      <div>
        <div className="kiosk-progress">
          <span className="kiosk-progress-label">
            {currentIndex + 1} de {activeTabs.length}
          </span>
          <div className="kiosk-progress-bar">
            <div
              className="kiosk-progress-fill"
              style={{ width: `${((currentIndex + 1) / activeTabs.length) * 100}%` }}
            />
          </div>
        </div>

        <div key={currentTab.id} className="kiosk-tab-card kiosk-tab-card--carousel">
          <h2 className="kiosk-tab-title">{currentTab.title}</h2>
          <p className="kiosk-tab-question">{currentTab.questionText}</p>
          <RatingControl
            maxScore={currentTab.maxScore}
            scaleType={currentTab.scaleType}
            onSelect={(score) => handleRate(currentTab, score)}
          />
          <p className="kiosk-countdown">Tempo restante: {countdown}s</p>
        </div>
      </div>
    </AppShell>
  );
}