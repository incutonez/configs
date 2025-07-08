import { InferAttributes, InferCreationAttributes, Model } from "@sequelize/core";
import { PrimaryKeyGuid } from "@/db/decorators";

export class BaseModel<T extends Model> extends Model<InferAttributes<T>, InferCreationAttributes<T>> {
	@PrimaryKeyGuid()
	declare id: string;

	getPlain() {
		return this.get(({
			plain: true,
		}));
	}
}
