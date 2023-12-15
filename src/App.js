// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Pipelines from './components/Repository';
import Layout from './components/Layout';
import Pipeline from "./components/Pipeline";
import {SocketProvider} from "./contexts/SocketContext";
import {Toaster} from "react-hot-toast";
import {AuthProvider} from "./contexts/AuthContext"; // Assurez-vous d'importer le composant de disposition

const App = () => {
    return (
        <div>
            <AuthProvider> {/* Use AuthProvider here */}
                <SocketProvider>
                    <Toaster/>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Layout />}>
                                <Route path="repository/:repoid" element={<Pipelines />} />
                                <Route path="pipeline/:pipelineid" element={<Pipeline />} />
                            </Route>
                        </Routes>
                    </Router>
                </SocketProvider>
            </AuthProvider>
        </div>
    );
};

export default App;
