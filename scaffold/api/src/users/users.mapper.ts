import {UserModel} from "src/db/models/UserModel";
import { UserViewModel } from "src/viewModels/user.viewmodel";

export class UsersMapper {
	userToViewModel(model: UserModel) {
		// We have to convert to a plain object because otherwise, the data is nested
		if (model instanceof UserModel) {
			model = model.getPlain();
		}

		return {
			id: model.id,
			firstName: model.first_name,
			lastName: model.last_name,
			phone: model.phone,
		}
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
