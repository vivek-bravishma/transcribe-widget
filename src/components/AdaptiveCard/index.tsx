import React from 'react';
import './style.css';
import AdaptiveCard from './AdaptiveCard';

// import * as samples from "./samples";
import { activityUpdate } from './samples';

const AdaptiveCardComp = ({ card, cardData }) => {
    return (
        <div className='adaptive-card-container'>
            <AdaptiveCard card={card} cardData={cardData} />
        </div>
    );
};

export default AdaptiveCardComp;
