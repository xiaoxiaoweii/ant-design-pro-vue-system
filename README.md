
#设备资产管理系统

##一、版本号规划：vx.x.x.x（V主版本号.子版本号.阶段版本号.线上bug修复版本号）

    1.主版本号(1.x.x)：当功能模块有较大的变动，比如增加多个模块或者整体架构发生变化。

    2.子版本号(x.1.x)：当功能有一定的增加或变化，比如增加了对权限控制、增加自定义视图等功能。

    3.阶段版本号(x.x.1)：一般是 Bug 修复或是一些小的变动，要经常发布更新版，时间间隔不限，修复一个严重的bug即可发布一个修订版。此版本号由项目经理决定是否修改。

    4.线上bug修复版本号(x.x.x.1):当已发布版本，上线后，运行中出现问题时，在已发布版本号的基础上，添加此版本号；如：线上运行的版本号为1.1.2，此时线上有bug需要修复，等修复完成后，此版本的版本号为1.1.2.1；

##二、Git代码库管理规范

## 分支管理
##### master分支-主分支

    代码库应该有一个、且仅有一个主分支。所有提供给用户使用的正式版本，都在这个主分支上发布。这个分支只能从其它分支合并，不能在这个分支上直接修改。
    master分支合并后打一个TAG（记录上线版本号，包含大版本和小版本及BUG版本）,格式：V主版本号.子版本号.阶段版本号，eg:v1.7.1.13；
##### feature分支-功能分支

      这个分支主要是用来开发一个新的功能,在maste基础上创建feature分支,格式：feature_功能说明。

##### hotfix分支

      线上问题，基于hotfix分支进行问题修复，测试人员在hotfix分支上进行验证；
      问题修复后研发负责人合并到master/feature分支，并删除主库的hotfix分支。

##三、代码提交规范

1. 开发人员从主仓库将项目fork到自己仓库，然后进行开发。参考文档：暂无

2. 将主仓库更新的代码同步到自己仓库的方法，参考文档：暂无

3. 每个开发人员每天将代码从本地提交到各自的远程仓库，自测完成后提交merge request，研发负责人review及合并代码。

4. 开发新功能时，由研发负责人在主仓库master分支基础上创建<feature_功能说明>分支,开发人员拉取该<feature_功能说明>分支，然后在<feature_功能说明>分支进行新功能开发，开发自测完成提交merge request,研发负责人进行代码review，然后合并到主仓库的<feature_功能说明>分支；同时可以在master上创建下一个版本的<feature_功能说明>分支，

5. 线上BUG修复，开发人员在自己仓库的hotfix分支进行bug修复(注意：先从主仓库同步hotfix分支)，修复完成后提交MR合并到主仓库的hotfix分支，然后由测试人员进行测试。



English | [简体中文](./README.zh-CN.md)

<h1 align="center">中铁设备业务管理系统</h1>



### Env and dependencies

- node
- yarn
- webpack
- eslint
- @vue/cli ~3
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - Picture edit
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - AntV G2
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - Antv/G2 of Vue

> Note:  [Yarn](https://yarnpkg.com/) package management is recommended, the exact same version loaded with the demo site of this project (yarn.lock) . but you can also use npm


### Project setup

- Clone repo
```bash
git clone ssh://git@gitlab.ocloudware.com:2289/zhangxiaoheng/equipmentbusiness-front.git
cd equipmentAssets-Front 
```

- Install dependencies
```
yarn install
```

- Compiles and hot-reloads for development
```
yarn run serve
```

- Compiles and minifies for production
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```


### Other

- [Vue-cli3](https://cli.vuejs.org/guide/) used by the project.
- Disable Eslint (not recommended): remove `eslintConfig`  field in `package.json`  and `vue.config.js` field `lintOnSave: false`

- Load on Demand: modify `/src/main.js` L14,  replace to `import './core/lazy_use'` code.

- Customize Theme:  [Custom Theme Config](https://github.com/kokoroli/antd-awesome/blob/master/docs/Ant_Design_%E6%A0%B7%E5%BC%8F%E8%A6%86%E7%9B%96.md)


## Browsers support

Modern browsers and IE10.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| IE10, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |


written at the end
----

Specific project structure introduction and use please refer to: [ANTD PRO VUE](https://pro.loacg.com/)