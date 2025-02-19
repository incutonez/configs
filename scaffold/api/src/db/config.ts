import { SequelizeModuleOptions } from "@nestjs/sequelize";
import { UserModel } from "src/db/models/UserModel";

export const DBConfig: SequelizeModuleOptions = {
	dialect: "sqlite",
	storage: "src/db/data.db",
	host: "localhost",
	models: [UserModel],
};
