import { Injectable } from "@nestjs/common";
import { Attributes, FindAndCountOptions } from "@sequelize/core";
import { UserModel } from "@/db/models/UserModel";
import { UsersMapper } from "@/users/users.mapper";
import { ApiPaginatedRequest } from "@/viewModels/base.list.viewmodel";

@Injectable()
export class UsersService {
	constructor(private mapper: UsersMapper) {
	}

	async listUsers({ page, limit = 20 }: ApiPaginatedRequest) {
		const query: FindAndCountOptions<Attributes<UserModel>> = {
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
		const response = await UserModel.findByPk(userId, {
			include: [
				{
					all: true,
					nested: true,
				},
			],
		});
		if (response) {
			return this.mapper.userToViewModel(response);
		}
	}
}
