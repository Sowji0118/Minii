import React from 'react';
import Card from '../../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SubjectDashboard = ({ role, students }) => {
    const subject = role.subject;
    const FACULTY_PIE_COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Yellow, Red
    const FACULTY_BAR_COLORS = ['#EC4899', '#3B82F6', '#10B981', '#F59E0B']; // Pink, Blue, Green, Yellow

    const performanceData = students.map(s => {
        const subjectPerf = s.performance[subject];
        if (!subjectPerf) return { name: s.name.split(' ')[0], average: 0, ia1: 0, ia2: 0, quiz: 0, aat: 0 };
        const average = (subjectPerf.total / 70) * 100;
        return { name: s.name.split(' ')[0], average, ...subjectPerf };
    });

    const performanceDistribution = [
        { name: 'Excellent (>=85)', value: performanceData.filter(s => s.average >= 85).length },
        { name: 'Good (70-84)', value: performanceData.filter(s => s.average >= 70 && s.average < 85).length },
        { name: 'Weak (<70)', value: performanceData.filter(s => s.average < 70).length },
    ].filter(d => d.value > 0);
    
    const attendanceData = students.map(s => {
        const subjectPerf = s.performance[subject];
        if (!subjectPerf) return { name: s.name.split(' ')[0], attendance: 0 };
        const attendancePercentage = (subjectPerf.attendance.present / subjectPerf.attendance.total) * 100;
        return { name: s.name.split(' ')[0], attendance: attendancePercentage };
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <Card.Header><Card.Title>Individual Student Marks</Card.Title></Card.Header>
                <Card.Content>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={performanceData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="ia1" stackId="a" fill={FACULTY_BAR_COLORS[0]} name="IA 1" />
                            <Bar dataKey="ia2" stackId="a" fill={FACULTY_BAR_COLORS[1]} name="IA 2" />
                            <Bar dataKey="quiz" stackId="a" fill={FACULTY_BAR_COLORS[2]} name="Quiz" />
                            <Bar dataKey="aat" stackId="a" fill={FACULTY_BAR_COLORS[3]} name="AAT" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Content>
            </Card>
            <Card>
                <Card.Header><Card.Title>Class Performance Distribution</Card.Title></Card.Header>
                <Card.Content>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={performanceDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {performanceDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={FACULTY_PIE_COLORS[index % FACULTY_PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card.Content>
            </Card>
            <Card className="lg:col-span-2">
                <Card.Header><Card.Title>Student Attendance Performance</Card.Title></Card.Header>
                <Card.Content>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={attendanceData}>
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => `${value.toFixed(0)}%`} />
                            <Legend />
                            <Bar dataKey="attendance" fill="#EC4899" name="Attendance %" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card.Content>
            </Card>
        </div>
    );
};

export default SubjectDashboard;
