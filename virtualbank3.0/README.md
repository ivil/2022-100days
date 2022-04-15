## 一.项目搭建

#### 1vue-router

###### 1.1 vue-router安装

```undefined
npm install vue-router
```

###### 1.2 vue-router引用

```jsx
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
```

#### 2 axios安装

###### 2.1 axios安装

```undefined
npm install axios --save
```

#### 3 vant安装(组件使用根据具体情况选择)

```undefined
npm i vant -S
```

## 二.项目模块封装

#### 1.项目结构模块

```
|— service	                    模拟后端响应
	|— node_modules				
    |— index.js
    |— pakage,json
    |— yarn.lock
|— virtualbank3.0	            项目文件
	|— node_modules				项目依赖模块
    |— src						项目源码目录
        |— api				    请求接口
            |— request			发出请求
            |— config.ts		请求基本配置
            |— net.ts			实例化axios
        |— assets				资源目录，资源会被webpack构建
            |— js				公共js文件目录
            |— css				公共样式文件目录
            |— images			图片存放目录
        |— components			公共组件目录
        |— lottie.json			动画库
        |— util                 工具类文件
        |— App.vue				根组件
        |— main.ts				入口js文件
        |— routers				前端路由目录
            |— index.js
        |— view					前端页面文件
        |— store				应用级数据管理
            |— index.js				
    |— .babel.config.js			babel的配置文件
    |— .eslintrc			    eslint配置文件
    |— .gitignore				git的忽略配置文件
    |— prettier.config.js		prettier配置文件
    |— stylelintrc.js			样式配置文件
    |— package.json				npm包配置文件，依赖包信息
    |— README.md				项目介绍
```

##  三.项目模块封装

####  1.移动端Vue项目UI框架：vant

## 四、 CSS预处理器选择

#### 1.less

#### 2.选择原因：

结构清晰，便于扩展。

## 五、 文件夹、组件命名规范，组件结构规范

#### 1.文件夹：

文件夹名称应统一格式，小写开头,其余文件夹名称统一按照项目结构目录命名规范统一命名。

#### 2.组件：

组件名以单词大写开头，当多个单词拼写成的组件时，采用驼峰式命名规则。一般是多个单词全拼，减少简写的情况，这样增加可读性。组件应该都放到components文件夹下，单个页面独立一个文件夹，用来放相对应的vue文件以及页面相关的样式文件，样式少可直接写到页面组件里边，这样更符合组件化的思想。
公用组件应该统一放到public文件下。

#### 3.基础组件：

当项目中需要自定义比较多的基础组件的时候，比如一些button，input，icon，建议以一个统一的单词Base开头，或者放到base文件夹统一管理，这样做的目的是为了方便查找。
页面级组件应该放到相对应页面文件夹下，比如一些组件只有这个页面用到，其他地方没有用到的，可以直接放到页面文件夹，然后以父组件开头命名，例如：HomeHeader.vue,HomeNav.vue。
项目级组件一般放到公共文件夹public下给所有的页面使用。

#### 4.组件结构：

组件结构遵循从上往下template，script，style的结构。

## 六、 组件样式

单个组件样式一般可直接写到组件下style标签下，为了防止样式污染，可添加scoped 属性，也可以通过设置作用域来防止样式污染，写样式的时候尽量少写元素选择器，为了提高代码查找速度，可以用类选择器。

## 七、 文件格式

1.UTF-8模式

## 八、 Template模板文件

1.尽量使用以.vue结束的单文件组件，方便管理，结构清晰。

2.标签语义化，避免清一色的div元素

3.样式class的命名：统一以小写字母开头，小写字母、下划线和数字组成。命名中尽量避免使用中文拼音，应该采用更简明有语义的英文单词进行组合。不建议使用驼峰法命名class属性。使用下划线的目的是为了和第三方库中的命名冲突。例如：xx_left,xx_line。

4.多特性，分行写，提高可读性。即一个标签内有多个属性，属性分行写。

5.自定义标签：使用自闭标签的写法。例如：，如果自定义标签中间需要传入slot，则写开始标签和结束标签，结束标签必须加/。

6.组件/实例选项中的空行。便于阅读和代码架构清晰。

## 九、 Style

1.使用 scoped关键字，约束样式生效的范围。

2.避免使用标签选择器（效率低、损耗性能）。

3.非特殊情况下，禁止使用 ID 选择器定义样式。有 JS 逻辑的情况除外。

4.CSS 属性书写顺序：先决定定位宽高显示大小，再做局部细节修饰！推荐顺序：定位属性(或显示属性，display)->宽高属性->边距属性(margin, padding)->字体，背景，颜色等，修饰属性的定义。

## 十、 数据中心（vuex）

1.各个文件的命名根据上面的项目结构命名。

2.应用层级的状态应该集中到单个 store 对象中。

3.action和mutation中的函数统一声明在mutation-type.ts内。

4.mutation-types里面的常量、常量值全部用大写+英文单词配合下划线的形式：例如：export const UPDATE_USERINFO = “UPDATE_USERINFO”。

5.提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。

6.异步逻辑都应该封装到 action 里面。

7.vuex 的dispatch和commit提交mutation的区别：dispatch=>actions用来触发异步操作，commit=>mutation用来触发同步操作的方法。当操作行为中含有异步操作，比如向后台发送请求获取数据，就需要使用action的dispatch去完成，其他使用commit即可。

## 十一、 路由

1. 路由至少包含三个选项：path、name、component。path统一小写；name对应于组件中的name，大写开头驼峰；component组件名称大写开头的组件驼峰。



2. 一级路由统一使用相对路径的形式。二级路由可以配置

## 十二、api管理

1. 新建api文件，由request文件夹， config.ts， net.ts组成



2. request存接口使用的方法



3. config.ts配置基础数据，实例化对象axios



4. net.ts定义一个类，属性instan，构造函数中实例化axios
