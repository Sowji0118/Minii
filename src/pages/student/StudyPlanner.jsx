import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, Plus, Calendar, BookOpen, BrainCircuit } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { generateWeeklyPlan, updatePlan } from '../../services/plannerService';
import Input from '../../components/ui/Input';

const StudyPlanner = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newPlan, setNewPlan] = useState({ subject: '', date: '', time: '' });
    const [activeTab, setActiveTab] = useState('today');

    useEffect(() => {
        // Initial generation of plans
        const performanceArray = Object.entries(user.performance).map(([subject, data]) => ({
            subject,
            myMarks: Math.round((data.total / 70) * 100),
        }));
        const weakSubjects = performanceArray.filter(p => p.myMarks < 70).map(p => p.subject);
        
        let initialPlans = generateWeeklyPlan(weakSubjects.length > 0 ? weakSubjects : ['General Revision']);
        initialPlans = updatePlan(initialPlans); // Check for overdue tasks on load
        setPlans(initialPlans);
    }, [user.performance]);

    const handleAddPlan = () => {
        const planToAdd = { ...newPlan, id: Date.now(), completed: false, type: 'manual' };
        const updatedPlans = updatePlan([...plans, planToAdd]);
        setPlans(updatedPlans);
        setShowModal(false);
        setNewPlan({ subject: '', date: '', time: '' });
    };
    
    const toggleComplete = (id) => {
        const updatedPlans = plans.map(p => p.id === id ? {...p, completed: !p.completed} : p);
        setPlans(updatePlan(updatedPlans));
    };

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const filteredPlans = useMemo(() => {
        if (activeTab === 'today') return plans.filter(p => p.date === todayStr);
        if (activeTab === 'tomorrow') return plans.filter(p => p.date === tomorrowStr);
        if (activeTab === 'upcoming') return plans.filter(p => p.date > tomorrowStr);
        return [];
    }, [activeTab, plans, todayStr, tomorrowStr]);

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto p-8">
                <Link to="/student/dashboard" className="inline-flex items-center text-vidya-pink mb-4 hover:underline"><ChevronLeft className="h-4 w-4 mr-1" />Back to Dashboard</Link>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-vidya-gray-900">Study Planner</h1>
                    <Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" /> Add Study Plan</Button>
                </div>

                <Card>
                    <Card.Header>
                        <div className="flex justify-between items-center">
                            <Card.Title>My Study Schedule</Card.Title>
                             <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('today')} className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'today' ? 'border-vidya-pink text-vidya-pink' : 'border-transparent'}`}>Today</button>
                                    <button onClick={() => setActiveTab('tomorrow')} className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'tomorrow' ? 'border-vidya-pink text-vidya-pink' : 'border-transparent'}`}>Tomorrow</button>
                                    <button onClick={() => setActiveTab('upcoming')} className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'upcoming' ? 'border-vidya-pink text-vidya-pink' : 'border-transparent'}`}>Upcoming</button>
                                </nav>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Content>
                        {filteredPlans.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No Plans for {activeTab}</h3>
                                <p className="mt-1 text-sm text-gray-500">Enjoy your day or add a new plan!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredPlans.sort((a,b) => (a.time || '00:00').localeCompare(b.time || '00:00')).map(plan => (
                                    <div key={plan.id} className={`p-4 rounded-lg flex items-center gap-4 ${plan.completed ? 'bg-green-100' : 'bg-vidya-light-pink/50'}`}>
                                        <input type="checkbox" checked={plan.completed} onChange={() => toggleComplete(plan.id)} className="h-5 w-5 rounded text-vidya-pink focus:ring-vidya-pink"/>
                                        <div className={`p-3 bg-white rounded-lg ${plan.type === 'ai' ? 'text-vidya-blue' : 'text-vidya-pink'}`}>
                                            {plan.type === 'ai' ? <BrainCircuit className="h-6 w-6"/> : <BookOpen className="h-6 w-6"/>}
                                        </div>
                                        <div className="flex-grow">
                                            <p className={`font-bold ${plan.completed ? 'line-through text-gray-500' : ''}`}>{plan.subject}</p>
                                            <p className="text-sm text-vidya-gray-500">
                                                {plan.time ? `${plan.time} - ` : ''} {plan.duration}
                                                {plan.isOverdue && <span className="ml-2 text-red-500 font-bold">(Overdue)</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Content>
                </Card>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="w-96">
                            <Card.Header><Card.Title>Add New Study Plan</Card.Title></Card.Header>
                            <Card.Content className="space-y-4">
                                <div><label>Subject</label><Input type="text" value={newPlan.subject} onChange={e => setNewPlan({...newPlan, subject: e.target.value})} className="mt-1" /></div>
                                <div><label>Date</label><Input type="date" value={newPlan.date} onChange={e => setNewPlan({...newPlan, date: e.target.value})} className="mt-1" /></div>
                                <div><label>Time</label><Input type="time" value={newPlan.time} onChange={e => setNewPlan({...newPlan, time: e.target.value})} className="mt-1" /></div>
                                <div><label>Duration</label><Input type="text" placeholder="e.g., 1 hour" value={newPlan.duration} onChange={e => setNewPlan({...newPlan, duration: e.target.value})} className="mt-1" /></div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button onClick={handleAddPlan}>Add Plan</Button>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudyPlanner;
