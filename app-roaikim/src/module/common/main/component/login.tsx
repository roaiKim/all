import { useLocation, useParams } from "react-router";

export default function (props) {
    console.log("------------------props", props);
    // const params = useParams();
    const location = useLocation();
    console.log("----------location--------props", location);
    // console.log("----------params--------params", params);
    return <div>login</div>;
}
