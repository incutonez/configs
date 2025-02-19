import { Injectable } from "@nestjs/common";
import { FindAndCountOptions } from "sequelize/types/model";
import { UsersMapper } from "src/users/users.mapper";
import { ApiPaginatedRequest } from "src/viewModels/base.list.viewmodel";
import { UserModel } from "src/db/models/UserModel";

@Injectable()
export class UsersService {
	constructor(private mapper: UsersMapper) {
	}

	async listUsers({ page, limit = 20 }: ApiPaginatedRequest) {
		const query: FindAndCountOptions<UserModel> = {
			limit,
			offset: (page - 1) * limit,
		};
		const { rows, count } = await UserModel.findAndCountAll(query);
		return {
			data: rows.map((item) => this.mapper.userToViewModel(item)),
			total: count,
		};
	}

	async getUser(userId: string) {
		const response = await UserModel.findOne({
			where: {
				id: userId,
			},
			include: [
				{
					all: true,
					nested: true,
				},
			],
		});
		return this.mapper.userToViewModel(response);
	}
}
