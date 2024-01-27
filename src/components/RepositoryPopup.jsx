import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { IoClose } from 'react-icons/io5';
import toast from "react-hot-toast";


const RepositoryPopup = ({ isOpen, onClose, onSuccess }) => {
    const [repositories, setRepositories] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(null);

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
        const fetchRepositories = async () => {
            try {
                const response = await axios.get('http://localhost:3001/user/repositories', { withCredentials: true });
                const repoOptions = response.data.map(repo => ({
                    value: repo.id,
                    label: repo.name,
                    url: repo.url,
                    description: repo.description
                }));
                setRepositories(repoOptions);
            } catch (error) {
                console.error('Error fetching repositories:', error);
            }
        };

        if (isOpen) {
            fetchRepositories();
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        try {
            if (selectedRepo) {
                const repoData = {
                    repoId: selectedRepo.value,
                    name: selectedRepo.label,
                    url: selectedRepo.url,
                    description: selectedRepo.description
                };

                const response = await axios.post('http://localhost:3001/repositories', repoData, { withCredentials: true })
                    .then(res => {
                        const repo = res.data;
                        onClose();
                        toast.success('Repository \''+repo.name+'\'added successfully!');
                        if (onSuccess) {
                            onSuccess(repo._id);
                        }
                    }).catch(err => {
                        toast.error('Repository already exists!');
                    })


            } else {
                console.error('No repository selected.');
            }
        } catch (error) {
            console.error('Error confirming repository:', error);
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-10">
                <div className="bg-white p-5 rounded-lg shadow-xl w-1/2 relative" ref={popupRef}>
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">Select a Repository</p>
                        <button className="cursor-pointer z-50" onClick={onClose}>
                            <IoClose className="w-6 h-6" />
                        </button>
                    </div>
                    <Select
                        options={repositories}
                        onChange={setSelectedRepo}
                        className="mb-4"
                        placeholder="Search for a repository..."
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        )
    );
};

export default RepositoryPopup;