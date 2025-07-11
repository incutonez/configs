import { Injectable } from "@nestjs/common";
import { AppInfoViewModel } from "@/viewModels/app.info.viewmodel";

@Injectable()
export class AppService {
	getInfo(): AppInfoViewModel {
		return {
			version: process.env.npm_package_version as string,
		};
	}
}
