import '../../styles/StarsReviewCss.css';
import { useState } from 'react';

import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SentimentNeutralOutlinedIcon from '@mui/icons-material/SentimentNeutralOutlined';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';

export const ReviewComponent = () => {
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleReviewClick = () => {
        setHasSubmitted(true);

        setTimeout(() => {
            setHasSubmitted(false);
        }, 3000);
    };
    
    return(
        <>
            <div className="review-wrapper">
                <div className="review-icons">
                    <SentimentSatisfiedOutlinedIcon 
                        className="review-icon"
                        sx={{ fontSize: 100, color: '#4caf50', cursor: 'pointer' }} 
                        onClick={handleReviewClick}
                    />
                    <SentimentNeutralOutlinedIcon 
                        className="review-icon"
                        sx={{ fontSize: 100, color: '#ff9800', cursor: 'pointer' }} 
                        onClick={handleReviewClick}
                    />
                    <SentimentDissatisfiedOutlinedIcon 
                        className="review-icon"
                        sx={{ fontSize: 100, color: '#f44336', cursor: 'pointer' }} 
                        onClick={handleReviewClick}
                    />
                </div>
                <p className="review-text">Avalie o Estabelecimento...</p>
            </div>

            {hasSubmitted && (
                <div className="review-modal-backdrop">
                    <div className="review-modal">
                        Obrigado pela sua avaliação!
                    </div>
                </div>
            )}
        </>
    )
}

export default ReviewComponent;