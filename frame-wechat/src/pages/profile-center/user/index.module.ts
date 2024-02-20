import { Loading, Module, register } from "@core";
import { verifiable } from "utils/decorator/verifiable";
import { Toast } from "utils/ui/toast";
import { RootState } from "type/state";
import { actions as mainActions } from "pages/main/index.module";
import { UserService } from "./service";
import { State } from "./type";

const initialUserState: State = {
    name: "user",
    profile: null,
    validatePassword: true,
};

@verifiable
class UserModule extends Module<RootState, "user"> {
    onShow(params, pageName): void | Promise<void> {
        if (pageName === "index") {
            this.fetchUserInfo();
        }
    }

    @Loading()
    async fetchUserInfo() {
        const user = await UserService.getUser();
        this.setState({ profile: user });
    }

    @Loading()
    async editUserInfo(info) {
        await UserService.editProfile({ ...this.state.profile, ...info });
        Toast.text();
        this.fetchUserInfo();
    }

    @Loading()
    async validatePassword(password) {
        await UserService.validatePassword(password);
        this.setState({ validatePassword: false });
    }

    @Loading()
    async changePassword(password) {
        await UserService.changePassword(password);
        this.dispatch(mainActions.exitByPasswordChanged());
    }
}

const module = register(new UserModule("user", initialUserState));
const actions = module.getActions();

export { actions, module };
