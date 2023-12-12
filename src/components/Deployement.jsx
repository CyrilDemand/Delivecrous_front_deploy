import React, {useState, useEffect, useCallback} from 'react';
import { Box, Typography, Stack } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import DeploymentStep from "./DeployementStep";

export default function Deployment({ id, steps, statusP, updateStepStatus,projetName }) {
    const [deploymentSteps, setDeploymentSteps] = useState(steps);
    const [timer, setTimer] = useState(0);
    const [isWaiting, setIsWaiting] = useState(statusP === "pending");
    const [status, setStatus] = useState(statusP);

    useEffect(() => {
        // Démarrer le timer dès que le déploiement est en attente
        const interval = isWaiting ? setInterval(() => setTimer(prev => prev + 1), 1000) : null;

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isWaiting]);

    const updateSteps = useCallback(() => {
        const currentStepIndex = deploymentSteps.findIndex(step => step.status === 'pending');
        if (currentStepIndex !== -1) {
            const newSteps = [...deploymentSteps];
            newSteps[currentStepIndex] = { ...newSteps[currentStepIndex], status: 'success' };
            updateStepStatus(projetName, id, deploymentSteps[currentStepIndex].name, 'success')
            if (currentStepIndex < newSteps.length - 1) {
                newSteps[currentStepIndex + 1] = { ...newSteps[currentStepIndex + 1], status: 'pending' };
            } else {
                setIsWaiting(false);
                setStatus("success");
                toast.success(`Deployment ${id} completed successfully`);
            }
            setDeploymentSteps(newSteps);
        }
    }, [deploymentSteps, id]);

    useEffect(() => {
        const timeout = setTimeout(updateSteps, 5000); // Simule le temps nécessaire pour compléter l'étape
        return () => clearTimeout(timeout);
    }, [updateSteps]);





    return (
        <Box sx={{ p: 2 }}>
            <h1>Deployment n°{id}</h1>
            <Stack direction="row">
                {deploymentSteps.map((step, index) => (
                    <DeploymentStep key={index} stepName={step.name} status={step.status} />
                ))}
            </Stack>
            {isWaiting && (
                <Typography variant="body1">
                    Time elapsed: {timer} seconds
                </Typography>
            )}
            {!isWaiting && status==="success" && (
                <Typography variant="body1">
                    Deployement done in {timer} seconds
                </Typography>
            )}
            {!isWaiting && status==="failed" && (
                <Typography variant="body1">
                    Deployement failed in {timer} seconds
                </Typography>
            )}
            <Toaster />
        </Box>
    );
}
