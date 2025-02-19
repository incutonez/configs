import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppController } from "src/app/app.controller";
import { AppService } from "src/app/app.service";
import { UsersModule } from "src/users/users.module";
import { DBConfig } from "src/db/config";

@Module({
	imports: [
		UsersModule,
		ConfigModule.forRoot({
			envFilePath: [".env.local", ".env"],
		}),
		SequelizeModule.forRoot(DBConfig),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
