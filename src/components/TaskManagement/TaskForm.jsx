import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSave, task }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending'
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                status: task.status
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task Title"
                required
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
            />
            <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>
            <button type="submit">Save Task</button>
        </form>
    );
};

export default TaskForm;
