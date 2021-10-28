import React from "react";

interface TrsProps {
    name: string;
    age: number;
}

interface TrsState {
    we: string | null;
    he: string | null;
}

class Trs extends React.PureComponent<TrsProps, TrsState> {
    constructor(props: TrsProps) {
        super(props);
        this.state = {
            we: null,
            he: null,
        };
    }
    render() {
        return <div>wawawa</div>;
    }
}

export default Trs;
