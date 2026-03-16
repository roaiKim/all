import { useLocation } from "react-router";

export default function (props) {
    console.log("------------------props", props);
    const location = useLocation();
    console.log("----------location--------props", location);
    return <div>login</div>;
}
