import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SentimentNeutralOutlinedIcon from '@mui/icons-material/SentimentNeutralOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import type { ScaleType } from '../models/review';

interface RatingControlProps {
  maxScore: number;
  scaleType: ScaleType;
  onSelect: (score: number) => void;
}

export function RatingControl({ maxScore, scaleType, onSelect }: RatingControlProps) {
  if (scaleType === 'faces' && maxScore === 3) {
    return (
      <div className="rating-control rating-control--faces">
        <button
          type="button"
          className="rating-control__icon-button"
          onClick={() => onSelect(3)}
        >
          <SentimentSatisfiedOutlinedIcon
            className="review-icon"
            sx={{ fontSize: 80, color: '#4caf50' }}
          />
        </button>
        <button
          type="button"
          className="rating-control__icon-button"
          onClick={() => onSelect(2)}
        >
          <SentimentNeutralOutlinedIcon
            className="review-icon"
            sx={{ fontSize: 80, color: '#ff9800' }}
          />
        </button>
        <button
          type="button"
          className="rating-control__icon-button"
          onClick={() => onSelect(1)}
        >
          <SentimentDissatisfiedOutlinedIcon
            className="review-icon"
            sx={{ fontSize: 80, color: '#f44336' }}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="rating-control rating-control--stars">
      {Array.from({ length: maxScore }, (_, index) => {
        const score = index + 1;
        return (
          <button
            key={score}
            type="button"
            className="rating-control__star-button"
            onClick={() => onSelect(score)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

