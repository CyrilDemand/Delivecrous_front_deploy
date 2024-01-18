import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {useSocket} from "../contexts/SocketContext";
import toast from "react-hot-toast";
import withAuthProtection from "../contexts/AuthProtection";
import {StateIcon} from "./StateIcon";
import {confirmAlert} from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';


const Pipeline = () => {
    const { pipelineid } = useParams();
    const [data, setData] = useState(null);
    const [HasPipelineRunning, setHasPipelineRunning] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const socket = useSocket();
    const navigate = useNavigate();


    useEffect(() => {
        const updateisRunning = async () => {
            if (!data) {
                // Data is null, exit the function or handle accordingly
                return;
            }

            try {
                const url = `http://localhost:3001/repositories/haspipelinerunning/${data?.repoId}`;
                const repoResponse = await axios.get(url, { withCredentials: true });
                setHasPipelineRunning(repoResponse.data.isRunning);
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            }
        };
        updateisRunning();
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/pipelines/${pipelineid}`, { withCredentials: true });
                console.log(response.data)
                setData(response.data);
                setIsLoading(false);
                setIsRunning(response.data.state === "running")
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
                setIsLoading(false);
            }
        };

        fetchData();


        if (socket) {
            socket.on('pipelineUpdated', updatedPipeline => {
                if (updatedPipeline._id === pipelineid) {
                    setData(updatedPipeline);
                }
            });

            socket.on('pipelineStarted', () => {
                console.log('Pipeline started');
                fetchData();
            });

            socket.on('pipelineStopped', () => {
                console.log('Pipeline stopped');
                fetchData();
            });
        }

        return () => {
            if (socket) {
                socket.off('pipelineUpdated');
                socket.off('pipelineStarted');
                socket.off('pipelineStopped');
            }
        };
    }, [pipelineid, socket]);

    const startPipeline = async () => {
        if (HasPipelineRunning) {
            toast.error('A pipeline is already running for this repository');
            return;
        }

        try {
            axios.post(`http://localhost:3001/pipelines/start/${pipelineid}`,{}, { withCredentials: true })
                .catch((error) => {
                    toast.error(`Error: ${error.response.data}`)
                });
        } catch (error) {
            if (error.response) {
                toast.error(`Error: ${error.response.data}`);
            } else if (error.request) {
                toast.error('No response received from the server');
            } else {
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    const deletePipeline = async () => {
        confirmAlert({
            title: 'Delete pipeline ?',
            message: 'Are you sure you want to delete this pipeline ?',
            closeOnEscape: true,
            closeOnClickOutside: true,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:3001/pipelines/${pipelineid}`, { withCredentials: true });
                            toast.success('Pipeline successfully deleted');
                            navigate('/repository/'+data.repoId); // Navigate to a different page after deletion
                        } catch (error) {
                            console.error('Error deleting pipeline:', error);
                            toast.error('Failed to delete pipeline : '+error.response.data);
                        }
                    }
                },
                {
                    label: 'No',
                }
            ]
        });
    };

    return (
        <div className="container mx-auto p-4">
            {data ? (
                <div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Pipeline Details</h2>
                        <div className="mb-6">
                            <h3 className="text-xl mb-2">General Information</h3>
                            <p><strong>Name:</strong> {data.name}</p>
                            <p><strong>Commit:</strong> {data.branch}</p>
                            <p><strong>Commit ID:</strong> {data.commitId}</p>
                            <p><strong>Commit Message:</strong> {data.commitMessage}</p>
                            <p><strong>Author:</strong> {data.authorName}</p>
                            <p><strong>Creation Date:</strong> {new Date(data.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="mt-10 mb-10">
                        <div className="w-1/3 flex flex-row justify-between items-center relative">
                            <div className="absolute top-1/2 left-0 right-0 border-t border-black -z-10"></div>
                            {data.steps.map((step, index) => (
                                <StateIcon key={index} step={step} size={30} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={startPipeline}
                            disabled={HasPipelineRunning}
                            className={`mt-4 ${HasPipelineRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
                        >
                            Start Pipeline
                        </button>

                        <button
                            onClick={deletePipeline}
                            disabled={isRunning}
                            className={`mt-4 ml-4 ${isRunning ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-700'} text-white font-bold py-2 px-4 rounded`}
                        >
                            Delete Pipeline
                        </button>
                    </div>
                </div>
            ) : (
                isLoading ? (
                    <p className="text-gray-600">Loading...</p>
                ) : (
                    <p className="text-red-600 text-2xl font-bold w-full text-center">Pipeline not found</p>
                )

            )}


        </div>
    );
};

export default withAuthProtection(Pipeline);
