import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import logo from '../ressources/logo.png'; // Assurez-vous que le chemin est correct
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const defaultTheme = createTheme();

export default function Login() {
    // ...fonction handleSubmit...

    function handleSubmit(){

    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <Typography component="h2" variant="h4" sx={{ mb: 2, mt: 10 }}>
                        CodePulse
                    </Typography>
                    <img src={logo} alt="CodePulse Logo" style={{ maxWidth: '150px', marginBottom: '20px' }} />

                    <Avatar sx={{ m: 1, bgcolor: '#0190A0' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 1 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                    <Typography component="h1" variant="h5">
                        Se connecter via Auth 2
                    </Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
