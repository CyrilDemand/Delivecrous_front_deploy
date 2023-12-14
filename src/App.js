// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Pipelines from './components/Pipelines';
import Layout from './components/Layout';
import Pipeline from "./components/PipelineDetail";
import {SocketProvider} from "./contexts/SocketContext"; // Assurez-vous d'importer le composant de disposition

const App = () => {
    return (
        <SocketProvider>
            <Router>
                <Routes>
                <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Layout />}>
                        <Route path="pipelines/:repoid" element={<Pipelines />} />
                        <Route path="pipeline/:pipelineid" element={<Pipeline />} />
                    </Route>
                </Routes>
            </Router>
        </SocketProvider>
    );
};

export default App;
