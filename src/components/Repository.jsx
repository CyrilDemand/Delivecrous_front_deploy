import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../contexts/SocketContext';
import withAuthProtection from '../contexts/AuthProtection';
import PipelinePopup from "./PipelinePopup";
import toast from "react-hot-toast";
import {StateIcon} from "./StateIcon";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';


const Repository = () => {
    const { repoid } = useParams();
    const [data, setData] = useState([]);
    const [repository, setRepository] = useState(null);
    const [pageLoading, setPageLoading] = useState(true); // Loading state for the page
    const [pipelineLoading, setPipelineLoading] = useState(true); // Loading state for the pipeline list
    const [hasPipelineRunning, setHasPipelineRunning] = useState(false);
    const navigate = useNavigate();
    const socket = useSocket();

    const [isPipelinePopupOpen, setIsPipelinePopupOpen] = useState(false);

    const openPipelinePopup = () => {
        setIsPipelinePopupOpen(true);
    };

    const closePipelinePopup = () => {
        setIsPipelinePopupOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pipelinesResponse, repositoryResponse, hasPipelineRunningResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/pipelines?repoId=${repoid}`, { withCredentials: true }),
                    axios.get(`http://localhost:3001/repositories/${repoid}`, { withCredentials: true }),
                    axios.get(`http://localhost:3001/repositories/haspipelinerunning/${repoid}`, { withCredentials: true })
                ]);

                const sortedPipelines = pipelinesResponse.data.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                setData(sortedPipelines);
                setRepository(repositoryResponse.data);
                setHasPipelineRunning(hasPipelineRunningResponse.data.isRunning);

                // Set both loading states to false once data is fetched
                setPageLoading(false);
                setPipelineLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données', error);
                // Set both loading states to false in case of an error
                setPageLoading(false);
                setPipelineLoading(false);
            }
        };

        fetchData();

        if (socket) {
            socket.on('pipelineCreated', (newPipeline) => {
                console.log('pipelineCreated:', newPipeline);
                if (newPipeline.repoId === repoid) {
                    setData((prevData) => [newPipeline, ...prevData]);
                }
            });

            socket.on('pipelineUpdated', (updatedPipeline) => {
                console.log('pipelineUpdated : ' + updatedPipeline.toString());
                if (updatedPipeline.repoId === repoid) {
                    fetchData();
                }
            });

            socket.on('pipelineStopped', (updatedPipeline) => {
                console.log('pipelineStopped : ' + updatedPipeline.toString());
                if (updatedPipeline.repoId === repoid) {
                    fetchData();
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('pipelineCreated');
                socket.off('pipelineUpdated');
                socket.off('pipelineStopped');
            }
        };
    }, [repoid, socket]);

    const navigateToPipeline = (pipelineId) => {
        navigate(`/pipeline/${pipelineId}`);
    };

    const navigateToGithubCommit = (commitId, event) => {
        event.stopPropagation();
        let baseUrl = repository.url;

        // Remove '.git' from the end of the URL if it exists
        if (baseUrl.endsWith('.git')) {
            baseUrl = baseUrl.substring(0, baseUrl.length - 4);
        }

        const commitUrl = `${baseUrl}/commit/${commitId}`;
        window.open(commitUrl, '_blank');
    };

    const startPipeline = async (pipelineId,event) => {
        event.stopPropagation();
        try {
            axios.post(`http://localhost:3001/pipelines/start/${pipelineId}`,{}, { withCredentials: true })
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
    }

    const deletePipeline = async (pipelineId,event) => {
        event.stopPropagation();
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
                            await axios.delete(`http://localhost:3001/pipelines/${pipelineId}`, {withCredentials: true});
                            toast.success('Pipeline successfully deleted');
                            setData(prevData => prevData.filter(pipeline => pipeline._id !== pipelineId));
                        } catch (error) {
                            console.error('Error deleting pipeline:', error);
                            toast.error('Failed to delete pipeline : ' + error.response.data);
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
        <div>
            {repository ? (
                <div>
                    <div className="mb-4 p-4 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold">{repository.name}</h3>
                        <p className="text-sm text-gray-600">{repository.description || 'No description available'}</p>
                        <a href={repository.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Visit Repository
                        </a>
                    </div>

                    <button
                        onClick={openPipelinePopup}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create Pipeline
                    </button>

                    <PipelinePopup
                        isOpen={isPipelinePopupOpen}
                        onClose={closePipelinePopup}
                        repositoryId={repoid}
                    />

                    <div>
                        {pipelineLoading ? (
                            <p className="text-gray-600">Loading pipelines...</p>
                        ) : data.length === 0 ? (
                            <p className="text-gray-600 px-4">No pipelines available</p>
                        ) : (
                            <table className="min-w-full leading-normal">
                                <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        State
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Commit
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Creation Date
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">

                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((pipeline) => (
                                    <tr key={pipeline._id} onClick={() => navigateToPipeline(pipeline._id)} className="hover:bg-gray-100 cursor-pointer">
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {pipeline.name}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex flex-row items-center justify-center">
                                            <StateIcon step={{ state: pipeline.state }} size={30} />
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="text-blue-500 underline cursor-pointer w-min" onClick={(e) => navigateToGithubCommit(pipeline.commitId, e)}>
                                                {pipeline.commitId}
                                            </p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {pipeline.authorName}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            {new Date(pipeline.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <button
                                                disabled={hasPipelineRunning}
                                                onClick={(e) => startPipeline(pipeline._id,e)}
                                                className={`${hasPipelineRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}  text-white font-bold py-1 px-2 rounded mr-2`}
                                            >
                                                Start
                                            </button>

                                            <button
                                                disabled={pipeline.state === 'running'}
                                                onClick={(e) => deletePipeline(pipeline._id,e)}
                                                className={`${pipeline.state === 'running' ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-700'}  text-white font-bold py-1 px-2 rounded`}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            ) : (
                pageLoading ? (
                    <p className="text-gray-600">Loading...</p>
                ) : (
                    <div className="text-red-600 text-2xl font-bold w-full text-center">Repository not found</div>
                )
            )}
        </div>
    );
};

export default withAuthProtection(Repository);
