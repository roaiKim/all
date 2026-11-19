import { Loading, Module, register } from "@core";
import { UserService, UserService$getUser$Response } from "@api/UserService";
import { actions as mainActions } from "@pages/main";
import { RootState } from "@type/state";
import { verifiable } from "@utils/decorator/verifiable";
import { Toast } from "@utils/ui/toast";
import Main from "./component";
import { State } from "./type";

const initialProfileState: State = {
    name: "user",
    profile: null,
    validatePassword: true,
};

@verifiable
class ProfileModule extends Module<RootState, "profile"> {
    onEnter(params, pageName): void | Promise<void> {
        this.fetchUserInfo();
    }

    @Loading()
    async fetchUserInfo() {
        const id = this.rootState.app.main?.loginInfo?.extra?.partnerId;
        const user = await UserService.getUser(id);
        this.setState({ profile: user });
    }
}

const module = register(new ProfileModule("profile", initialProfileState));
export const actions = module.getActions();

export default module.connect(Main);
