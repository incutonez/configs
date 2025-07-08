import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "@/users/users.service";
import { ApiPaginatedRequest } from "@/viewModels/base.list.viewmodel";
import { UserListViewModel, UserViewModel } from "@/viewModels/user.viewmodel";

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
	async getUser(@Param("userId") userId: string): Promise<UserViewModel> {
		const response = await this.service.getUser(userId);
		if (response) {
			return response;
		}
		throw new NotFoundException("User not found");
	}
}
