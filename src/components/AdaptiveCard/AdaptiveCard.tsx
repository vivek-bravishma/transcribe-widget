import * as React from 'react';
import * as AdaptiveCards from 'adaptivecards';
import 'adaptivecards/lib/adaptivecards.css';
import "adaptivecards-designer/dist/adaptivecards-designer.css"
import 'adaptivecards-designer/dist/adaptivecards-defaulthost.css';
import axios from 'axios';

export interface AdaptiveCardProps {
    card: any;
}

const AdaptiveCard = ({ card }: AdaptiveCardProps) => {
    //   const cardWrapperRef = React.useRef<HTMLDivElement>(null);

    const cardWrapperRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (!cardWrapperRef || !card) return;

        const adaptiveCard = new AdaptiveCards.AdaptiveCard();

        adaptiveCard.parse(card);
        // adaptiveCard.onExecuteAction = function (action) {
        //     alert('Ow!');
        // };

        // Provide an onExecuteAction handler to handle the Action.Submit
        adaptiveCard.onExecuteAction = (action: AdaptiveCards.Action) => {
            console.log('button clicked');
            if (action instanceof AdaptiveCards.SubmitAction) {
                let actionData: any = action.data;
                console.log(action.title, ' -> ', actionData);

                let url = actionData.url;
                let payload = actionData.payload;
                console.log(url, payload);

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
