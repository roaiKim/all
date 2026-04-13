import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface HomeProps {}

function Home(props: HomeProps) {
    return <div className={joinLessPrefix("home-page")}>Hello Home</div>;
}

export default Home;
