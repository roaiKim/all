<script setup lang="ts">
 
    import { reactive, ref, computed } from "vue";

    const text = ref(""); 
    const multipleText = ref(""); 
    const checked = ref(false); 
    const checkeds = ref([]); 
    const picks = ref([]); 
    const selected = ref("");
    const selecteds = ref([]);
    const valueBindRadio = ref("");
    const toggle = ref("");
    const valuePick = ref("");
    const first = ref("first");
    const second = ref("second");
    const lazyValue = ref("");
    const numberValue = ref("");
    const trimValue = ref("");

    const eventChange = () => {
        //
        console.log("--eventChange");
    }
    const eventBlur = () => {
        //
        console.log("--eventBlur");
    }

</script>

<template>
    <div>
        <div>
            <code style="color: red">表单输入值绑定{{ text }}</code>
            <input v-model="text"/>
        </div>
        <div>
            <code style="color: red">多行文本绑定{{ multipleText }}</code>
            <textarea  v-model="multipleText"></textarea>
        </div>
        <div>
            <code style="color: red">复选框{{ checked }}</code>
            <input type="checkbox"  v-model="checked" />
        </div>
        <div>
            <code style="color: red">复选框组{{ checkeds }}</code>
            <input type="checkbox" id="jack" value="Jack" v-model="checkeds" />
            <label for="jack">Jack</label>

            <input type="checkbox" id="john" value="John" v-model="checkeds" />
            <label for="john">John</label>

            <input type="checkbox" id="mike" value="Mike" v-model="checkeds" />
            <label for="mike">Mike</label>
        </div>
        <div>
            <code style="color: red">单选框组{{ picks }}</code>
            <input type="radio" id="one" value="One" v-model="picks" />
            <label for="one">One</label>

            <input type="radio" id="two" value="Two" v-model="picks" />
            <label for="two">Two</label>
        </div>
        <div>
            <code style="color: red">下拉单选择{{ selected }}</code>
            <select v-model="selected">
                <option disabled value="">请选择一个</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
            </select>
        </div>
        <div>
            <code style="color: red">下拉多选择{{ selecteds }}</code>
            <select v-model="selecteds" multiple> 
                <option>A</option>
                <option>B</option>
                <option>C</option>
            </select>
        </div>
        <div>
            <code style="color: red">值绑定 {{ valueBindRadio }}</code>
            <input type="radio" v-model="valueBindRadio" value="天才" />天才
        </div>
        <div>
            <code style="color: red">值绑定 {{ toggle }}</code>
            <input
                type="checkbox"
                v-model="toggle"
                true-value="yes"
                false-value="no" />
        </div>
        <div>
            <code style="color: red">值绑定 {{ valuePick }}</code>
            <input type="radio" v-model="valuePick" :value="first"/>
            <input type="radio" v-model="valuePick" :value="second"/>
        </div>
        <div>
            <code style="color: red">修饰符.lazy {{ lazyValue }}</code><!-- onInput 会在改变之后立刻触发，.lazy则使用onChange是触发 onChange时区焦点触发 -->
            <input v-model.lazy="lazyValue" />
        </div>
        <div>
            <code style="color: red">change 事件比blur事件先触发</code>
            <input @change="eventChange" @blur="eventBlur"/>
        </div>
        <div>
            <code style="color: red">修饰符.number 会自动转换为数字 如果无法转化则返回原值 {{ typeof numberValue }} {{ numberValue }}</code>
            <input v-model.number="numberValue" />
        </div>
        <div>
            <code style="color: red">修饰符.trim 去头尾空格, 如果中间有多个空格则最多保留一个 {{ trimValue }}</code>
            <input v-model.trim="trimValue" />
        </div>
    </div>
</template>

<style>
.author {
    color: red;
}
.active {
    color: red;
}
</style>