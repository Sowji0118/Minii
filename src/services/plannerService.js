const getNextWeekday = (dayOfWeek, fromDate = new Date()) => {
    const resultDate = new Date(fromDate.getTime());
    resultDate.setDate(fromDate.getDate() + (dayOfWeek + (7 - fromDate.getDay())) % 7);
    if (resultDate < fromDate) { // If it's today but in the past, get next week's
        resultDate.setDate(resultDate.getDate() + 7);
    }
    return resultDate.toISOString().split('T')[0];
};

export const generateWeeklyPlan = (weakSubjects) => {
    // A simple mock generator. In a real app, this would be a complex algorithm or AI call.
    const plan = [];
    const schedule = {
        [getNextWeekday(1)]: [weakSubjects[0] || 'Data Structures', '1 hour'], // Monday
        [getNextWeekday(2)]: [weakSubjects[1] || 'Algorithms', '1.5 hours'], // Tuesday
        [getNextWeekday(3)]: [weakSubjects[0] || 'Data Structures', '1 hour'], // Wednesday
        [getNextWeekday(4)]: ['General Revision', '2 hours'], // Thursday
        [getNextWeekday(5)]: [weakSubjects[1] || 'Algorithms', '1 hour'], // Friday
    };

    Object.entries(schedule).forEach(([date, [subject, duration]]) => {
        plan.push({
            id: `ai-${date}-${subject}`,
            date,
            subject,
            duration,
            time: '19:00',
            completed: false,
            type: 'ai' // To distinguish AI-generated from manual
        });
    });
    
    return plan;
};

export const updatePlan = (plans) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedPlans = [...plans];
    
    // Find incomplete tasks from the past
    const overdueTasks = updatedPlans.filter(p => !p.completed && p.date < todayStr);

    overdueTasks.forEach(task => {
        // Find the original task in the array to modify it
        const taskIndex = updatedPlans.findIndex(p => p.id === task.id);
        if (taskIndex > -1) {
            // Reschedule for today and mark as overdue
            updatedPlans[taskIndex].date = todayStr;
            updatedPlans[taskIndex].isOverdue = true;
        }
    });

    return updatedPlans;
};
