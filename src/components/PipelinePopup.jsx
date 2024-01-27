import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { IoClose } from 'react-icons/io5';
import pipeline from "./Pipeline";
import toast from "react-hot-toast";

const PipelinePopup = ({ isOpen, onClose, repositoryId }) => {
    const [commits, setCommits] = useState([]);
    const [selectedCommit, setSelectedCommit] = useState(null);
    const [pipelineName, setPipelineName] = useState('');

    const popupRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const fetchCommits = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/repositories/${repositoryId}/commits`, { withCredentials: true });

                const commitOptions = response.data.map(commit => ({
                    value: commit.commitId,
                    label: `${commit.commitMessage.substring(0, 50)}${commit.commitMessage.toString().length > 50 ? '...' : ''} - ${commit.author}`,

                    commitMessage: commit.commitMessage,
                    author: commit.author,
                }));
                setCommits(commitOptions);

                const defaultPipelineName = `pipeline-${Date.now()}`;
                setPipelineName(defaultPipelineName);
            } catch (error) {
                console.error('Error fetching commits:', error);
            }
        };

        if (isOpen) {
            fetchCommits();
        }
    }, [isOpen, repositoryId]);

    const handleConfirm = async () => {
        if (!pipelineName) {
            toast.error('Please enter a pipeline name');
            return;
        }
        if (!selectedCommit) {
            toast.error('Please select a commit');
            return;
        }

        try {
            const pipelineData = {
                repoId: repositoryId,
                pipelineName: pipelineName,
                commitId: selectedCommit.value, // Assuming selectedCommit.value contains commit ID
                commitMessage: selectedCommit.commitMessage,
                authorName: selectedCommit.author
            };

            await axios.post('http://localhost:3001/pipelines', pipelineData, { withCredentials: true });

            toast.success('Pipeline created successfully!');
            onClose(); // Close the popup after successful creation
        } catch (error) {
            toast.error('Failed to create pipeline : ',error);
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white p-5 rounded-lg shadow-xl w-1/2 relative" ref={popupRef}>
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">Create a pipeline</p>
                        <button className="cursor-pointer z-50" onClick={onClose}>
                            <IoClose className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="text-gray-600 mb-4">Enter a name for your pipeline:</p>
                    <input
                        type="text"
                        className="w-full p-2 mb-4 border rounded"
                        placeholder="pipeline-name"
                        value={pipelineName}
                        onChange={(e) => setPipelineName(e.target.value)}
                    />

                    <p className="text-gray-600 mb-4">Select a commit to create a pipeline for:</p>
                    <Select
                        options={commits}
                        onChange={setSelectedCommit}
                        className="mb-4"
                        placeholder="Select a commit..."
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleConfirm}
                    >
                        Create Pipeline
                    </button>
                </div>
            </div>
        )
    );
};

export default PipelinePopup;