import { Sequelize } from "@sequelize/core";
import { SqliteDialect } from "@sequelize/sqlite3";
import { UserModel } from "@/db/models/UserModel";

export const sequelize = new Sequelize({
	dialect: SqliteDialect,
	storage: "src/db/data.db",
	logging: false,
	models: [UserModel],
	sync: {
		alter: true,
	},
});
