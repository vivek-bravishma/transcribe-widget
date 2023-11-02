import * as React from 'react';
import * as AdaptiveCards from 'adaptivecards';
import 'adaptivecards/lib/adaptivecards.css';
import 'adaptivecards-designer/dist/adaptivecards-designer.css';
// import 'adaptivecards-designer/dist/adaptivecards-defaulthost.css';
import axios from 'axios';

import * as ACData from 'adaptivecards-templating';

export interface AdaptiveCardProps {
    card: any;
    cardData: any;
}

const AdaptiveCard = ({ card, cardData }: AdaptiveCardProps) => {
    //   const cardWrapperRef = React.useRef<HTMLDivElement>(null);

    const cardWrapperRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (!cardWrapperRef || !card) return;

        const template = new ACData.Template(card);

        const cardPayload = template.expand({
            $root: cardData,
        });

        const adaptiveCard = new AdaptiveCards.AdaptiveCard();
        adaptiveCard.parse(cardPayload);

        // Provide an onExecuteAction handler to handle the Action.Submit
        adaptiveCard.onExecuteAction = (action: AdaptiveCards.Action) => {
            console.log('button clicked');
            if (action instanceof AdaptiveCards.SubmitAction) {
                let actionData: any = action.data;
                console.log(action.title, ' -> ', actionData);

                let url = actionData.url;
                let payload = actionData.payload;
                let additionalData = actionData.Additional_Data;

                console.log('payload=> ', payload);
                console.log('additionalData==> ', additionalData);

                payload = { ...payload, additionalData };

                console.log('payload with additional data=> ', payload);

                axios
                    .post(url, payload)
                    .then((res) => console.log('res=> ', res))
                    .catch((err) => console.log('err=> ', err));
            }
        };

        cardWrapperRef.current.innerHTML = '';
        adaptiveCard.render(cardWrapperRef.current);
    }, [card, cardWrapperRef]);

    return <div ref={cardWrapperRef} />;
};

export default AdaptiveCard;
