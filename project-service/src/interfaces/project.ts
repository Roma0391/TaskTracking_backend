import { ICandidate } from './candidate'
import { IProfile } from './profile'
import { ITask } from './task'

export enum ProjectPriorityLevel {
	HIGH = 'high',
	MEDIUM = 'medium',
	LOW = 'low'
}

export enum ProjectStatus {
	ACTIVE = 'active',
	DONE = 'done',
	DELAY = 'delay'
}

export interface IProject {
	id: string
    name: string
    description: string
	createdById: string,
  	createdBy: IProfile
  	members: IProfile[] | []
	candidates: ICandidate[] | []
    tasks: ITask[] | []
    status: ProjectStatus
    priorityLevel: ProjectPriorityLevel 
  	createdAt: Date
  	updatedAt: Date
}
