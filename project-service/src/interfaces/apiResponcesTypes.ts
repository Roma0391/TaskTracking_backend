
interface ISuccessMutationResponce {
	success: true,
}

interface IFeildResponce {
	success: false,
}

export interface ISuccessDataResponce<T> {
	success: true,
	result: {
		data: T[]
		curentPage: string,
		totalPage: string,
		totalItems: string,
	}
}

export type IMutationResponce = ISuccessMutationResponce | IFeildResponce;
export type IDataResponce<T> = ISuccessDataResponce<T> | IFeildResponce; 