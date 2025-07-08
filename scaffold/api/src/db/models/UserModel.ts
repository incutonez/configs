import { DataTypes } from "@sequelize/core";
import { Attribute, Table } from "@sequelize/core/decorators-legacy";
import { BaseModel } from "@/db/models/BaseModel";
import { ModelInterface } from "@/types";

export type IUserModel = ModelInterface<UserModel>;

@Table({
	tableName: "users",
	timestamps: false,
})
export class UserModel extends BaseModel<UserModel> {
	@Attribute(DataTypes.STRING)
	declare first_name: string;

	@Attribute(DataTypes.STRING)
	declare last_name: string;

	@Attribute(DataTypes.STRING)
	declare phone: string;
}
