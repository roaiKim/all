<script setup lang="ts">
    import { reactive, ref, watch, watchEffect } from "vue";
    const question = ref("");
    const answer = ref("");

    watch(question, (newQ, prevQ) => {
        answer.value = `关于${newQ}, 我不知道`;
    })

    const x = ref(0);
    const y = ref(0);

    watch(() => x.value + y.value, (sum, prevSum) => {
        console.log("==wum==", sum);
    });

    const obj = reactive({count: 0})
    // 不能直接监听响应式对象
    // watch(obj.count, () => {
    //     //
    // });
    watch(obj, (obj) => {
        console.log("==obj==", obj);
    });

    // 深层监听器
    //
    const deepObj = reactive({
        a: {
            b: {
                c: {d: "0", e: "1"},
                f: {d: "0", e: "1"},
            }
        }
    });

    
    // 依赖整个响应式对象时 默认是深层侦听器 任何属性变更都会触发
    watch(deepObj, (deepObj) => {
        console.log("==deepObj==", deepObj);
    });
    // 当返回响应式对象的getter函数时 只有返回不同的对象才会触发
    // 单a.b.c.d变化时 这个不会更新 因为依赖 deepObj.a.b 不变
    watch(() => deepObj.a.b, (deepObj) => {
        console.log("==deepObj==", deepObj);
    });
    // 这个会变 转换成了深层监听器 {deep: true}
    watch(() => deepObj.a.b, (deepObj) => {
        console.log("==deepObj==", deepObj);
    }, {deep: true});

    //
    const deepValue: any = reactive({
        a: {b: "111"}
    });
    watch(deepValue, (deepValue) => {
        console.log("==deepValue==", deepValue);
    });
    const changeDeepValue = () => {
        deepValue.a.c = "aaa";
    }

    // watchEffect 内部用法必须使用值
    const effectValue = reactive({time: "00"});
    watchEffect(() => {
        // 只会自动依赖需要同步的/这里用setTimeout不会执行
        // setTimeout(() => {
        //     console.log("-effectValue-", effectValue.time);
        //     // JSON.stringify({effectValue: effectValue.value})
        // }, 100);
        
         console.log("-effectValue-", effectValue.time);
    });
    
    // 默认情况下 侦听器会在 vue 组件更新前调用，这意味着你在侦听器回调访问的DOM是更新前的状态
    // 如果需要侦听器能访问 vue 更新后的 DOM 需要 子明参数 flush: post //或使用 watchPostEffect

    // 手动停止 一个侦听器
    // 1. 写在setup()中的同步创建的侦听器 会自动绑定在组件实例中 随着组件的卸载时 自动停止

</script>

<template>
    <p>{{ question }}</p>
    <input v-model="question"/>
    <p>{{ answer }}</p>
    <p>
        计算属性和侦听器都有依赖值 进行回调
        不同在于 计算属性依赖值 来进行计算缓存 必须要有返回值 而侦听器是一种副作用 可以是异步的
        默认侦听器第一次不会执行
        总结：
        计算属性是一种值缓存 而侦听器是监听并执行业务操作
        注意点： watch 不能

        watch 默认懒执行 仅仅当数据源变化时才会回调 可以通过传入 immediate: true 来立刻执行
        <br/>
        watchEffect()：
        1. 会自动跟踪响应式的依赖（只有同步执行期间才会追踪依赖）
        2. 回调会自动执行
    </p>
    <p>
        <input v-model="x"/><br/>
        <input v-model="y"/><br/>
        响应式对象
        <input v-model="obj.count"/><br/>
        深层监听器<br/>
        d:
        <input v-model="deepObj.a.b.c.d"/><br/>
        e:
        <input v-model="deepObj.a.b.f.e"/>
    </p>
    <p>
        <button @click="changeDeepValue">点击</button>
    </p>
    <br/>
    watchEffect: {{ effectValue }}
    <input v-model="effectValue.time"/><br/>
</template>




