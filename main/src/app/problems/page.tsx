'use client';

import { useState } from 'react';

interface Problem {
    title: string;
    description: string;
    url: string;
    tags: string[];
    source: string;
}

export default function ProblemScraper() {
    const [source, setSource] = useState<string>('stackoverflow');
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProblems = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `/api/scrap-problem?source=${source}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch problems');
            }

            setProblems(data.problems);
        } catch (err) {
            setError((err as Error).message);
            setProblems([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Programming Problem Scraper</h1>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                            Source
                        </label>
                        <select
                            id="source"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                        >
                            <option value="stackexchange">Stack Overflow</option>
                            <option value="github">GitHub</option>
                            <option value="devto">DEV Community</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={fetchProblems}
                            disabled={loading}
                            className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Fetch Problems'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.map((problem, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                    {problem.source}
                                </span>
                            </div>
                            <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                                <a href={problem.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 text-black">
                                    {problem.title}
                                </a>
                            </h2>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {problem.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {problem.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {problems.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Click &apos;Fetch Problems&apos; to load programming challenges</p>
                </div>
            )}
        </div>
    );
}
