import * as React from 'react';
import { useState } from 'react';
import {Drawer, List, ListItem, ListItemText, Divider, Box, Typography, Toolbar, Button} from '@mui/material';
import logo from '../ressources/logo.png'; // Assurez-vous que le chemin est correct
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Dashboard() {
    const [selectedProject, setSelectedProject] = useState('front');
    let navigate = useNavigate();

    const handleListItemClick = (project) => {
        setSelectedProject(project);
    };

    const handleLogout = () => {
        navigate('/');

    }

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
                {/* Ici, ajoutez le contenu de chaque projet, comme les étapes de CI/CD */}
            </Box>
        </Box>
    );
}
