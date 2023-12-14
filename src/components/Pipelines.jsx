import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../contexts/SocketContext';

const Pipelines = () => {
    const { repoid } = useParams();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const socket = useSocket();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/pipelines?repoId=${repoid}`);
                setData(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            }
        };

        fetchData();

        if (socket) {
            socket.on('pipelineCreated', newPipeline => {
                console.log('pipelineCreated : '+newPipeline.toString() )
                if (newPipeline.repoId === repoid) {
                    setData(prevData => [...prevData, newPipeline]);
                }
            });

            socket.on('pipelineUpdated', updatedPipeline => {
                console.log('pipelineUpdated : '+updatedPipeline.toString())
                if (updatedPipeline.repoId === repoid) {
                    setData(prevData => prevData.map(pipeline =>
                        pipeline._id === updatedPipeline._id ? updatedPipeline : pipeline
                    ));
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('pipelineCreated');
                socket.off('pipelineUpdated');
            }
        };


    }, [repoid]);

    const navigateToPipeline = (pipelineId) => {
        navigate(`/pipeline/${pipelineId}`);
    };

    return (
        <div>
            {data ? (
                <table className="min-w-full leading-normal">
                    <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Branch
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            State
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Author
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Timestamp
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((pipeline) => (
                        <tr key={pipeline._id} onClick={() => navigateToPipeline(pipeline._id)} className="cursor-pointer hover:bg-gray-100">
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {pipeline.name}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {pipeline.branch}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {pipeline.state}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {pipeline.authorName}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                {new Date(pipeline.timestamp).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">Chargement...</p>
            )}
        </div>
    );
};

export default Pipelines;