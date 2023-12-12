import * as React from 'react';
import { useState } from 'react';
import {Drawer, List, ListItem, ListItemText, Divider, Box, Typography, Toolbar, Button} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Deployment from "../components/Deployement";
import {fetchDeployments} from "../slices/DeployementSlice";

const drawerWidth = 240;
const socket = io('http://localhost:3002'); // Remplacez par l'URL de votre serveur

export default function Dashboard() {
    const [deployMessage, setDeployMessage] = useState('non');

    const [selectedProject, setSelectedProject] = useState('front');
    const [deployement, setDeployement ] = useState()
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const handleStatusChange = (projectId, stepName, newStatus) => {
        dispatch(updateStepStatus({ projectId, stepName, newStatus }));
    };

    const handleListItemClick = (project) => {
        setSelectedProject(project);
    };

    const handleLogout = () => {
        navigate('/');

    }

    useEffect(() => {
        setDeployement(dispatch(fetchDeployments()));
        socket.on('deployUpdate', (data) => {
            setDeployMessage(data.message);
            // Vous pouvez également effectuer d'autres actions en réponse à la notification
        });

        return () => {
            socket.off('deployUpdate');
        };
    }, []);

    const updateStepStatus = (projetName, projectId, stepName, newStatus) => {

    };


    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Button onClick={handleLogout}>logout</Button>
                <Toolbar />
                <Divider />
                <List>
                    {['front', 'back'].map((text, index) => (
                        <ListItem button key={text} selected={selectedProject === text} onClick={() => handleListItemClick(text)}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Toolbar />
                <Typography variant="h6">
                    {`Project: ${selectedProject}`}
                </Typography>
                <Button >Deploy !</Button>
                {deployMessage && <p>{deployMessage}</p>}

                {/*
                    depl.reverse().map(e => (
                        <Deployment key={e.id} id={e.id} steps={e.steps} statusP={e.status}
                                    updateStepStatus={updateStepStatus} projetName={selectedProject}/>
                    ))
                */}

                {/* Ici, ajoutez le contenu de chaque projet, comme les étapes de CI/CD */}
            </Box>
        </Box>
    );
}
