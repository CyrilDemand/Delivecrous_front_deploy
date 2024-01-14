import React from 'react';
import NewIcon from '../ressources/icon_state_new.png';
import SuccessIcon from '../ressources/icon_state_success.png';
import FailedIcon from '../ressources/icon_state_failed.png';
import MoonLoader from 'react-spinners/MoonLoader';

export const StateIcon = ({ step, size }) => {

    const getTooltipMessage = () => {
        if (step.state === 'completed' || step.state === 'failed') {
            return (step.stacktrace ? step.stacktrace : step.state)
        }else{
            return step.state;
        }
    };

    return (
        <div title={getTooltipMessage()} className="bg-white px-2">
            {step.state === 'new' && <img src={NewIcon} alt="New" width={size} height={size}/>}
            {step.state === 'completed' && <img src={SuccessIcon} alt="Success" width={size} height={size}/>}
            {step.state === 'failed' && <img src={FailedIcon} alt="Failed" width={size} height={size}/>}
            {step.state === 'running' && <MoonLoader size={size-6} color="#999999"/>}
        </div>
    );
};