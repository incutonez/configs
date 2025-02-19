import { Column, Table } from "sequelize-typescript";
import { PrimaryKeyGuid } from "src/db/decorators";
import { BaseModel } from "src/db/models/BaseModel";
import { ModelInterface } from "src/types";

export type IUserModel = ModelInterface<UserModel>;

@Table({
	tableName: "users",
	timestamps: false,
})
export class UserModel extends BaseModel {
	@PrimaryKeyGuid()
	declare id: number;

	@Column
	declare first_name: string;

	@Column
	declare last_name: string;

	@Column
	declare phone: string;
}
