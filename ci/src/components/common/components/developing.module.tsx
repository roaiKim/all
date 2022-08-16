export function DevelopingModule(props: { hidden: boolean }) {
    const { hidden } = props;
    return (
        <div className={`ro-g-developing-container-module ${hidden ? "" : "active-module"}`}>
            <div className="ro-develop-module ro-flex ro-center ro-height-100">
                <h2>模块开发中</h2>
            </div>
        </div>
    );
}
