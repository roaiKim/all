import React from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@icon";
import "./index.less";
import { connect } from "react-redux";
import { actions } from "module/upload";

class Main extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <article className="ro-module-wrap ro-upload-module">
                Upload module
                <Upload
                    name="file"
                    action="http://localhost:3200/api/file/upload"
                    headers={
                        {
                            authorization: "authorization-text",
                        }
                    }
                    onChange={(info) => {
                        if (info.file.status !== "uploading") {
                            console.log(info.file, info.fileList);
                        }
                        if (info.file.status === "done") {
                            message.success(`${info.file.name} file uploaded successfully`);
                        } else if (info.file.status === "error") {
                            message.error(`${info.file.name} file upload failed.`);
                        }
                    }}
                >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                <Upload
                    beforeUpload={(file) => {
                        const { dispatch } = this.props;

                        const formFile = new FormData();
                        formFile.append("file", file);
                        dispatch(actions.upload(formFile));
                        return false;
                    }}
                >
                    <Button icon={<UploadOutlined />}>Click to Upload kkk</Button>
                </Upload>
            </article>
        );
    }

}

export default connect()(Main);
