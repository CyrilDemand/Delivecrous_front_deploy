import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function DeploymentStep({ stepName, status }) {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval;

        if (status === 'pending') {
            interval = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000); // Met à jour le temps toutes les secondes
        }

        return () => {
            clearInterval(interval); // Nettoie l'intervalle lors du démontage du composant
        };
    }, [status]);

    const backgroundColor = status === 'success' ? 'green' : status === 'failed' ? 'red' : 'grey';

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <Box sx={{
            width: 100,
            height: 120, // Augmenté pour accueillir le timer
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: backgroundColor,
            margin: 1
        }}>
            <Typography variant="subtitle1" color="white">{stepName}</Typography>
            {status === 'pending' && (
                <Typography variant="caption" color="white">
                    {formatTime(elapsedTime)}
                </Typography>
            )}
        </Box>
    );
}

export default DeploymentStep;
