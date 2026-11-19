import { Loading, Module, register } from "@core";
import { UserService, UserService$changePassword$Request } from "@api/UserService";
import { actions as mainActions } from "@pages/main";
import { RootState } from "@type/state";
import { verifiable } from "@utils/decorator/verifiable";
import { Toast } from "@utils/ui/toast";
import Main from "./component";
import { State } from "./type";

const initialChangePasswordState: State = {
    name: "user",
};

@verifiable
class ChangePasswordModule extends Module<RootState, "changePassword"> {
    @Loading()
    async validatePassword(password: string) {
        await UserService.validatePassword(password);
    }

    @Loading()
    async changePassword(request: UserService$changePassword$Request) {
        await UserService.changePassword(request);
        this.dispatch(mainActions.exitByPasswordChanged());
    }
}

const module = register(new ChangePasswordModule("changePassword", initialChangePasswordState));
export const actions = module.getActions();

export default module.connect(Main);
