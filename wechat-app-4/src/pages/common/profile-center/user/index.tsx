import { Loading, Module, register } from "@core";
import { UserService, UserService$getUser$Response } from "@api/UserService";
import { actions as mainActions } from "@pages/main";
import { RootState } from "@type/state";
import { verifiable } from "@utils/decorator/verifiable";
import { Toast } from "@utils/ui/toast";
import Main from "./component";
import { State } from "./type";

const initialUserState: State = {
    name: "user",
    profile: null,
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
        const id = this.rootState.app.main?.loginInfo?.extra?.partnerId;
        const user = await UserService.getUser(id);
        this.setState({ profile: user });
    }

    @Loading()
    async editUserInfo(info: Partial<UserService$getUser$Response>) {
        await UserService.editProfile({ ...this.state.profile, ...info });
        Toast.text();
        this.fetchUserInfo();
    }
}

const module = register(new UserModule("user", initialUserState));
export const actions = module.getActions();

export default module.connect(Main);
