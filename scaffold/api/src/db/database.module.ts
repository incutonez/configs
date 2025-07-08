import { Global, Module } from "@nestjs/common";
import { SEQUELIZE } from "@/constants";
import { sequelize } from "@/db/config";

@Global()
@Module({
	providers: [{
		provide: SEQUELIZE,
		async useFactory() {
			await sequelize.sync();
			return sequelize;
		},
	}],
	exports: [SEQUELIZE],
})
export class DatabaseModule {}
