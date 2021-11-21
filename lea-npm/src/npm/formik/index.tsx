import React from "react";
import { SignupForm } from "./1";
import YupWith from "./1_yup";
import { Example } from "./field-r";
import { FriendList } from "./field-array";

export default function () {
    return (
        <div>
            {/* <SignupForm /> */}
            <YupWith />
            <Example />
            <FriendList />
        </div>
    );
}
