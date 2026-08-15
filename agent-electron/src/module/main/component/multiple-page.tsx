import { Route, Routes } from "react-router-dom";
// import { LoginComponent } from "module/common/login/type";
import { joinLessPrefix } from "utils/framework";
import MainLayout from "./main";

function MultiplePage() {
    return (
        <Routes>
            {/* <Route path="/login/:id?" element={<LoginComponent></LoginComponent>} /> */}
            <Route
                path="*"
                element={
                    <MainLayout>
                        <div className={joinLessPrefix("page-container")}>Main-page</div>
                    </MainLayout>
                }
            />
        </Routes>
    );
}

export default MultiplePage;
