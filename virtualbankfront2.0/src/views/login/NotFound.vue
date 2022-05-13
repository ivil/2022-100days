<template>
  <div class="notfound">
        <template>
            <lottie :options="defaultOptions" :height="500" :width="370" v-on:animCreated="handleAnimation" />
        </template>
    <div class="choose">
        <p>找不到页面了哟!!</p>
        <p @click="click">确定</p>
    </div>

  </div>
</template>

<script>
import * as animationData from "../../assets/jsonLogo/logo6.json";

export default {
name:"NotFound",
data(){
    return {
        defaultOptions: { animationData: animationData.default },
        animationSpeed: 1,
        anim: {},
    }
},
methods: {
    handleAnimation: function(anim) {
        this.anim = anim;
        console.log(anim); //这里可以看到 lottie 对象的全部属性
    },
    click(){
        console.log(111);
        this.$router.push('/')

    }
},

}


</script>

<style lang="less" scoped>
.choose{
    p{
        font-size: 20px;
        color: lightseagreen;

        &:nth-child(2){
            width: 100px;
            height: 40px;
            background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
            margin: 10px auto;
            line-height: 40px;
            border-radius: 5px;
        }
    }
}

</style>