import React from 'react';
import Card from '../../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { SEM1_SUBJECTS, SEM2_SUBJECTS } from '../../../data/mockData';

const ProctorDashboard = ({ role, students }) => {
    const SUBJECT_COLORS = ['#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']; // Pink, Blue, Green, Yellow, Purple
    const PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Professional Green, Yellow, Red
    const subjects = role.semester === 1 ? SEM1_SUBJECTS : SEM2_SUBJECTS;

    const performanceData = students.map(s => {
        let totalMarks = 0;
        let subjectCount = 0;
        const subjectAverages = {};
        subjects.forEach(subject => {
            const perf = s.performance[subject];
            if (perf) {
                const avg = Math.round((perf.total / 70) * 100);
                totalMarks += avg;
                subjectCount++;
                subjectAverages[subject] = avg;
            } else {
                subjectAverages[subject] = 0;
            }
        });
        return { name: s.name.split(" ").slice(0, 2).join(" "), ...subjectAverages, average: subjectCount > 0 ? totalMarks / subjectCount : 0 };
    });

    const overallPerformance = [
        { name: 'Strong (>=85)', value: performanceData.filter(s => s.average >= 85).length },
        { name: 'Average (70-84)', value: performanceData.filter(s => s.average >= 70 && s.average < 85).length },
        { name: 'Weak (<70)', value: performanceData.filter(s => s.average < 70).length },
    ].filter(d => d.value > 0);
    
    const subjectAverageData = subjects.map(subject => {
        const total = performanceData.reduce((acc, student) => acc + (student[subject] || 0), 0);
        return { name: subject, average: performanceData.length > 0 ? total / performanceData.length : 0 };
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="lg:col-span-2">
                <Card.Header><Card.Title>Student Performance Overview (Subject-wise)</Card.Title></Card.Header>
                <Card.Content>
                    <ResponsiveContainer width="100%" height={Math.max(400, students.length * 40)}>
                        <BarChart data={performanceData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} interval={0} />
                            <Tooltip formatter={(value, name) => [`${value.toFixed(0)}%`, name.split(" ").slice(0,2).join(" ")]} />
                            <Legend wrapperStyle={{fontSize: "12px"}} />
                            {subjects.map((sub, i) => (
                                <Bar key={sub} dataKey={sub} stackId="a" fill={SUBJECT_COLORS[i % SUBJECT_COLORS.length]} name={sub.split(" ").slice(0,2).join(" ")}/>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Content>
            </Card>
            <Card>
                <Card.Header><Card.Title>Class Performance Distribution</Card.Title></Card.Header>
                <Card.Content>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={overallPerformance} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {overallPerformance.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card.Content>
            </Card>
             <Card>
                <Card.Header><Card.Title>Overall Subject Averages</Card.Title></Card.Header>
                <Card.Content>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={subjectAverageData}>
                            <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                            <Bar dataKey="average" name="Class Average">
                                {subjectAverageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={SUBJECT_COLORS[index % SUBJECT_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Content>
            </Card>
        </div>
    );
};

export default ProctorDashboard;
