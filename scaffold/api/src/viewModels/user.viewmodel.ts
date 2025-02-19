import { GetResponseModel } from "src/viewModels/base.list.viewmodel";

export class UserViewModel {
	firstName: string;
	id: number;
	lastName: string;
	phone: string;
}

export class UserListViewModel extends GetResponseModel<UserViewModel>(UserViewModel) {}
