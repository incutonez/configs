import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";
import { ApiPaginatedRequest } from "src/viewModels/base.list.viewmodel";
import { UserListViewModel } from "src/viewModels/user.viewmodel";

@ApiTags("users")
@Controller("users")
export class UsersController {
	constructor(private readonly service: UsersService) {
	}

	@Post("list")
	@HttpCode(HttpStatus.OK)
	async listUsers(@Body() body: ApiPaginatedRequest): Promise<UserListViewModel> {
		return this.service.listUsers(body);
	}

	@Get(":userId")
	async getUser(@Param("userId") userId: string) {
		return this.service.getUser(userId);
	}
}
