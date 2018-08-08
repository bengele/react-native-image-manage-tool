# react-native-image-manage-tool
用于react和react-native静态图片资源统一管理工具   

1.node环境自行配置  
2.把图片全部放入images文件夹中,使用命令 node build.static.js就会在/images目录下生成index.js   
3.在代码中直接使用 STATIC_IMAGES["xxx.png"]   
4.build.static.js中可以配置路径，也可以用同样的方式生成其他需要的引入文件，如有需要请自行在其中配置。
