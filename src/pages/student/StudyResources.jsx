import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, Book, Film, FileText, Search } from 'lucide-react';
import { db, FEW_SUBJECTS } from '../../data/mockData';
import Input from '../../components/ui/Input';

const StudyResources = () => {
    const subjects = FEW_SUBJECTS;
    const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [customTopic, setCustomTopic] = useState('');

    const topics = db.studyResources[selectedSubject] ? Object.keys(db.studyResources[selectedSubject]) : [];
    const resources = selectedTopic ? db.studyResources[selectedSubject][selectedTopic] : [];

    const handleCustomSearch = (e) => {
        if (e.key === 'Enter' && customTopic.trim() !== '') {
            // In a real app, this would trigger an API call to an AI service
            alert(`Searching for resources on "${customTopic}"... (This is a placeholder for backend integration)`);
        }
    }

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto p-8">
                <Link to="/student/dashboard" className="inline-flex items-center text-vidya-pink mb-4 hover:underline"><ChevronLeft className="h-4 w-4 mr-1" />Back to Dashboard</Link>
                <h1 className="text-3xl font-bold text-vidya-gray-900 mb-6">Study Resources</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-1/4">
                        <Card>
                            <Card.Header><Card.Title>Subjects</Card.Title></Card.Header>
                            <Card.Content className="p-2">
                                <nav className="flex flex-col gap-1">
                                    {subjects.map(subject => (
                                        <button key={subject} onClick={() => { setSelectedSubject(subject); setSelectedTopic(null); }} className={`p-2 text-left rounded-md text-sm font-medium ${selectedSubject === subject ? 'bg-vidya-light-pink text-vidya-pink' : 'hover:bg-vidya-gray-100'}`}>
                                            {subject}
                                        </button>
                                    ))}
                                </nav>
                            </Card.Content>
                        </Card>
                    </aside>
                    <div className="flex-1 space-y-6">
                        <Card>
                             <Card.Header>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input 
                                        placeholder="Search for a custom topic and press Enter..." 
                                        className="pl-10"
                                        value={customTopic}
                                        onChange={(e) => setCustomTopic(e.target.value)}
                                        onKeyDown={handleCustomSearch}
                                    />
                                </div>
                            </Card.Header>
                        </Card>
                        <Card>
                            <Card.Header><Card.Title>Topics in {selectedSubject}</Card.Title></Card.Header>
                            <Card.Content>
                                {topics.length === 0 ? (
                                    <p>No topics available for this subject yet.</p>
                                ) : (
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-1/3 border-r pr-4">
                                            <h4 className="font-semibold mb-2">Select a Topic</h4>
                                            {topics.map(topic => (
                                                <button key={topic} onClick={() => setSelectedTopic(topic)} className={`w-full text-left p-2 rounded ${selectedTopic === topic ? 'bg-vidya-light-pink' : ''}`}>
                                                    {topic}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="w-full md:w-2/3">
                                            <h4 className="font-semibold mb-2">Resources for {selectedTopic || '...'}</h4>
                                            {!selectedTopic ? (
                                                <p>Select a topic to see resources.</p>
                                            ) : resources.length === 0 ? (
                                                <p>No resources available for this topic yet.</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {resources.map((res, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 bg-vidya-gray-50 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                {res.type === 'Video' ? <Film className="h-5 w-5 text-vidya-pink"/> : <FileText className="h-5 w-5 text-vidya-blue"/>}
                                                                <div>
                                                                    <p className="font-medium">{res.title}</p>
                                                                    <p className="text-sm text-vidya-gray-500">{res.type === 'Video' ? `${res.duration}` : `${res.pages} pages`}</p>
                                                                </div>
                                                            </div>
                                                            <a href="#" className="text-vidya-pink font-bold">▶️</a>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card.Content>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudyResources;
