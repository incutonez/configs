import { UserModel } from "@/db/models/UserModel";
import { UserViewModel } from "@/viewModels/user.viewmodel";

export class UsersMapper {
	userToViewModel(model: UserModel) {
		return {
			id: model.id,
			firstName: model.first_name,
			lastName: model.last_name,
			phone: model.phone,
		};
	}

	viewModelToUser({ id, firstName, lastName, phone }: UserViewModel) {
		return UserModel.build({
			phone,
			id: id ?? undefined,
			first_name: firstName,
			last_name: lastName,
		});
	}
}
