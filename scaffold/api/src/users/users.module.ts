import { Module } from "@nestjs/common";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";
import { UsersMapper } from "src/users/users.mapper";

@Module({
	controllers: [UsersController],
	providers: [UsersService, UsersMapper],
})
export class UsersModule {}
