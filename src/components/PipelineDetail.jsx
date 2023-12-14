import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {useSocket} from "../contexts/SocketContext";
import toast from "react-hot-toast";
import withAuthProtection from "../contexts/AuthProtection";


const Pipeline = () => {
    const { pipelineid } = useParams();
    const [data, setData] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/pipelines/${pipelineid}`, { withCredentials: true });
                setData(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            }
        };

        fetchData();


        if (socket) {
            socket.on('pipelineUpdated', updatedPipeline => {
                if (updatedPipeline._id === pipelineid) {
                    setData(updatedPipeline);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('pipelineUpdated');
            }
        };
    }, [pipelineid, socket]);

    const startPipeline = async () => {
        try {
            await axios.post(`http://localhost:3001/pipelines/start/${pipelineid}`,{}, { withCredentials: true });
            toast.success('Pipeline started successfully');
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response);
                toast.error(`Error: ${error.response.data}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                toast.error('No response received from the server');
            } else {
                console.error('Error message:', error.message);
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            {data ? (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Pipeline Details</h2>
                    <div className="mb-6">
                        <h3 className="text-xl mb-2">General Information</h3>
                        <p><strong>Name:</strong> {data.name}</p>
                        <p><strong>Branch:</strong> {data.branch}</p>
                        <p><strong>Commit ID:</strong> {data.commitId}</p>
                        <p><strong>Commit Message:</strong> {data.commitMessage}</p>
                        <p><strong>Author:</strong> {data.authorName}</p>
                        <p><strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}</p>
                        <p><strong>Repository:</strong> <a href={data.repoHttpUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{data.repoHttpUrl}</a></p>
                    </div>
                    <div>
                        <h3 className="text-xl mb-2">Steps</h3>
                        <ul className="list-disc pl-5">
                            {data.steps.map((step, index) => (
                                <li key={index} className="mb-2">
                                    <span className="font-semibold">{step.step}:</span> {step.state}
                                    {step.stacktrace && <div className="text-red-600">Error: {step.stacktrace}</div>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">Chargement...</p>
            )}

            <button
                onClick={startPipeline}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Start Pipeline
            </button>
        </div>
    );
};

export default withAuthProtection(Pipeline);
