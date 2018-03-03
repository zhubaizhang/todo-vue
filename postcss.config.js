/** 
 * postcss-loader是后处理css，将style文件编译成css之后，然后通过postcss来优化代码，
 * 使用 autoprefixer 组件来优化css代码
 * autoprefixer：是需要加浏览器前缀的css属性，通过它自动加上前缀属性
 * 安装组件：npm i postcss-loader autoprefixer
*/
const autoprefixer=require("autoprefixer");
module.exports={
    plugins:[
        autoprefixer()
    ]
}