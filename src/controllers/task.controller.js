import Task from "../models/Task.js";
import { getPagination } from "../libs/getPagination.js";
export const findAllTasks = async (req, res) => {
    try {
        const { title, size, page } = req.query

        const condition = title
            ? {
                title: { $regex: new RegExp(title), $options: "i" }
            }
            : {};
            console.log(condition)
        const { limit, offset } = getPagination(page, size)
        const data = await Task.paginate(condition, { offset, limit });
        console.log(data)
        res.json({
            totalItems: data.totalDocs,
            tasks: data.docs,
            totalPages: data.totalPages,
            currentPage: data.page -1
        })
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Something goes wrong retrieving the tasks'
        })
    }
}

export const createTask = async (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({ message: 'Content cannot be empty' })
    }
    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            done: req.body.done ?? false
        });
        const taskSaved = await newTask.save();
        res.json(taskSaved)
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Something goes wrong creating a tasks'
        })
    }
}



export const findOneTasks = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        res.json(task)
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Something goes wrong retrieving the task'
        })
    }
}

export const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id)
        res.json({
            message: "Task were deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Something goes wrong deleting a tasks'
        })
    }
}

export const findAllDoneTask = async (req, res) => {
    try {
        const tasksDone = await Task.find({ done: true })
        res.json(tasksDone)
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Something goes wrong retrieving the tasks done'
        })
    }
}

export const updateTask = async (req, res) => {
    try {
        const taskUpdate = await Task.findByIdAndUpdate(req.params.id, req.body)
        res.json('Task was updated Successfully')
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Something goes wrong updating a task'
        })
    }

}