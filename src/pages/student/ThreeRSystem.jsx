import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, Edit, Eye, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import { db } from '../../data/mockData';

const ThreeRSystem = () => {
    const [activeTab, setActiveTab] = useState('review');
    const [summaries, setSummaries] = useState(db.summaries);
    const [todaySummary, setTodaySummary] = useState('');

    const handleSave = () => {
        const newSummary = { date: new Date().toISOString().split('T')[0], content: todaySummary };
        setSummaries([newSummary, ...summaries]);
        setTodaySummary('');
        alert('Summary Saved!');
    };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdaySummary = summaries.find(s => s.date === yesterday.toISOString().split('T')[0]);

    const tabs = [
        { id: 'review', name: 'Review', icon: Edit },
        { id: 'recall', name: 'Recall', icon: Eye },
        { id: 'revise', name: 'Revise', icon: RefreshCw },
    ];

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto p-8">
                <Link to="/student/dashboard" className="inline-flex items-center text-vidya-pink mb-4 hover:underline"><ChevronLeft className="h-4 w-4 mr-1" />Back to Dashboard</Link>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-vidya-gray-900">3R Summary System</h1>
                    <p className="mt-2 text-vidya-gray-500">Review → Recall → Revise: A systematic approach to effective learning.</p>
                </div>

                <Card className="mt-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex justify-center space-x-8" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id ? 'border-vidya-pink text-vidya-pink' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                    <tab.icon className="h-5 w-5" /> {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <Card.Content>
                        {activeTab === 'review' && (
                            <div>
                                <h3 className="text-lg font-semibold">Today's Study Summary ({new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})</h3>
                                <p className="text-sm text-vidya-gray-500 mb-4">Write a summary of what you studied today. Include key concepts, insights, and areas for improvement.</p>
                                <textarea value={todaySummary} onChange={(e) => setTodaySummary(e.target.value)} rows="8" className="w-full p-2 border rounded-md" placeholder="What did you study today? Write your summary here..."></textarea>
                                <Button onClick={handleSave} className="mt-4">Save Summary</Button>
                            </div>
                        )}
                        {activeTab === 'recall' && (
                            <div>
                                <h3 className="text-lg font-semibold">Yesterday's Summary</h3>
                                <p className="text-sm text-vidya-gray-500 mb-4">Review what you studied yesterday to reinforce your learning.</p>
                                {yesterdaySummary ? (
                                    <div className="p-4 bg-vidya-gray-50 rounded-md border">{yesterdaySummary.content}</div>
                                ) : (
                                    <div className="text-center p-8 border-2 border-dashed rounded-lg">
                                        <Eye className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Summary Found</h3>
                                        <p className="mt-1 text-sm text-gray-500">You haven't created a summary for yesterday yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'revise' && (
                             <div>
                                <h3 className="text-lg font-semibold">All Study Summaries</h3>
                                <p className="text-sm text-vidya-gray-500 mb-4">Access all your past summaries for comprehensive revision.</p>
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {summaries.length > 0 ? summaries.map(summary => (
                                        <div key={summary.date} className="p-4 border rounded-md">
                                            <p className="font-bold text-vidya-pink">{new Date(summary.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <p className="mt-2 whitespace-pre-wrap">{summary.content}</p>
                                        </div>
                                    )) : <p>No summaries saved yet.</p>}
                                </div>
                            </div>
                        )}
                    </Card.Content>
                </Card>
            </main>
        </div>
    );
};

export default ThreeRSystem;
