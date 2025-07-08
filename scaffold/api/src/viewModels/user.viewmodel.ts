import { GetResponseModel } from "@/viewModels/base.list.viewmodel";

export class UserViewModel {
	declare id: string;

	declare firstName: string;

	declare lastName: string;

	declare phone: string;
}

export class UserListViewModel extends GetResponseModel<UserViewModel>(UserViewModel) {}
