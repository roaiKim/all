import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { AtButton, AtIcon } from "taro-ui";
import { Picker, Text, Textarea, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { RootState } from "@type/state";
import { backHistory } from "@utils";
import { actions } from "../index";
import { State } from "../type";
import "./index.less";

interface Props {
    state: State;
}

function Abnormal({ state }: Props) {
    const dispatch = useDispatch();
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [levelIndex, setLevelIndex] = useState(0);
    const [description, setDescription] = useState("");
    const category = state.categories[categoryIndex];
    const levels = category?.levels ?? [];
    const level = levels[levelIndex];
    const submit = async () => {
        if (!category || !category.enabled || !level || !description.trim()) {
            Taro.showToast({ title: "请完善异常信息", icon: "none" });
            return;
        }
        const response = await dispatch(actions.submit(category.code, level.code, description.trim()));
        if (!response) {
            return;
        }
        Taro.showToast({ title: "已提交", icon: "success" });
        backHistory();
    };

    return (
        <View className="ro-task-abnormal-page">
            <View className="ro-task-detail-nav">
                <AtIcon value="chevron-left" onClick={() => backHistory()} />
                <Text>运输异常上报</Text>
                <View />
            </View>
            <View className="ro-task-abnormal-card">
                <View className="abnormal-line">
                    <Text>任务编号</Text>
                    <Text>{state.taskId || "-"}</Text>
                </View>
                <View className="abnormal-line">
                    <Text>异常环节</Text>
                    <Text>{state.stage === "SIGNOFF" ? "货物签收" : "提货装车"}</Text>
                </View>
                <Picker
                    mode="selector"
                    range={state.categories.map((item) => item.name)}
                    value={categoryIndex}
                    onChange={(event) => {
                        setCategoryIndex(Number(event.detail.value));
                        setLevelIndex(0);
                    }}
                >
                    <View className="picker-line">
                        <Text>异常类型</Text>
                        <Text>{category?.name || "请选择"}</Text>
                    </View>
                </Picker>
                <Picker
                    mode="selector"
                    range={levels.map((item) => item.name)}
                    value={levelIndex}
                    onChange={(event) => setLevelIndex(Number(event.detail.value))}
                >
                    <View className="picker-line">
                        <Text>异常级别</Text>
                        <Text>{level?.name || "请选择"}</Text>
                    </View>
                </Picker>
                <View className="description-field">
                    <Text>异常详细描述</Text>
                    <Textarea
                        value={description}
                        maxlength={2000}
                        placeholder="请输入异常详细描述"
                        onInput={(event) => setDescription(event.detail.value)}
                    />
                </View>
                <AtButton type="primary" onClick={submit}>
                    提交异常
                </AtButton>
            </View>
        </View>
    );
}

const mapStateToProps = (rootState: RootState) => ({ state: rootState.app.taskAbnormal });

export default connect(mapStateToProps)(Abnormal);
