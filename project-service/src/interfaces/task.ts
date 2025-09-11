import { IProfile } from './profile'
import { IProject } from './project'

export enum TaskPriorityLevel {
	HIGH = 'high',
	MEDIUM = 'medium',
	LOW = 'low'
}

export enum TaskStatus {
	TODO = 'todo',
	IN_PROGRESS = 'inProgress',
	DONE = 'done'
}

export interface ITask {
	id: string
    title: string
    description?: string
    projectId: string
    project: IProject
    deadline: Date
    toDoProfileId?: string
    toDoProfile?: IProfile
    subTasks?: ITask[]
    parentTaskId?: string
    parentTask?: ITask
    progress: number
    status: TaskStatus
    priorityLevel: TaskPriorityLevel
    createdAt: Date
    updatedAt: Date
}