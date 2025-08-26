import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <div className=" bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen min-w-screen">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5"/>
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className=" flex flex-col items-center justify-start h-screen top-0 pt-10 w-full">
                <h2 className="text-2xl">Authenticated as: {auth.user?.username}</h2>
                <div className="text-xl text-gray-600 font-semibold mt-3">Existing files:</div>
                <div className="flex flex-col gap-4 mt-5">
                    {files.map((file) => (
                        <div key={file.id} className="flex flex-row gap-4">
                            <p>{file.name}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 my-5 rounded-md cursor-pointer"
                        onClick={() => handleDelete()}
                    >
                        Wipe App Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WipeApp;
