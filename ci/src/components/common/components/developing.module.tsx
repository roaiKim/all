export function DevelopingModule(props: { hidden: boolean; ns: string }) {
    const { hidden, ns } = props;
    return (
        <div className={`ro-g-developing-container-module ${hidden ? "" : "active-module"}`}>
            <div className="ro-develop-module ro-flex ro-center ro-height-100">
                <h2>模块开发中{ns}</h2>
            </div>
        </div>
    );
}
