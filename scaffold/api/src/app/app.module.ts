import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "@/app/app.controller";
import { AppService } from "@/app/app.service";
import { DatabaseModule } from "@/db/database.module";
import { UsersModule } from "@/users/users.module";

@Module({
	imports: [
		DatabaseModule,
		UsersModule,
		ConfigModule.forRoot({
			envFilePath: [".env.local", ".env"],
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
