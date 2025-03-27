import React from 'react';
import { supabase } from '../../supabaseClient';


const TaskList = ({ tasks, onEdit, onDelete }) => {
    return (
        <div className="task-list">
            {tasks.map(task => (
                <div key={task.id} className="task-item">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <p>Status: {task.status}</p>
                    <button onClick={() => onEdit(task.id, task)}>Edit</button>
                    <button onClick={() => onDelete(task.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
