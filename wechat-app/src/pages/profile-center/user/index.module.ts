import { Loading, Module, register } from "@core";
import { RootState } from "type/state";
import { verifiable } from "utils/decorator/verifiable";
import { Toast } from "utils/ui/toast";
import { State } from "./type";
import { UserService } from "./service";

const initialUserState: State = {
    name: "user",
    profile: null,
    confirmPassword: false,
};

// @verifiable
class UserModule extends Module<RootState, "user"> {
    onEnter(params, pageName): void | Promise<void> {
        if (pageName === "index") {
            this.fetchUserInfo();
        }
        console.log("---dd");
    }

    @Loading()
    async fetchUserInfo() {
        const user = await UserService.getUser();
        this.setState({ profile: user });
    }

    @Loading()
    async editUserInfo(info) {
        await UserService.editProfile({ ...this.state.profile, ...info });
        Toast.success();
        this.fetchUserInfo();
    }
}

const module = register(new UserModule("user", initialUserState));
const actions = module.getActions();

export { module, actions };
