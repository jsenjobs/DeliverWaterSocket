// 已完成：复制jswenjian到dist下，babel转换，压缩

module.exports = function(grunt) {
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),





		watch: {
           js: {
            files:['app/**/*.js'],
            tasks:['default'],
            options: {livereload:false}
          },
          babel:{
              files:'app/**/*.js',
              tasks:['babel']
          }
        },
        jshint:{
            build:['app/**/*.js'],
            options:{
                jshintrc:'.jshintrc' //检测JS代码错误要根据此文件的设置规范进行检测，可以自己修改规则
            }
        }, 
        copy: {
          main: {
          	files:[
          		{expand:true, cwd:'app/', src:['**'],dest:'dist/app/'},
          		{expand:true, src:['mock/**'],dest:'dist/mock/'},
          		{expand:true, src:['*.js'],dest:'dist/',filter:'isFile'}
          	]
          },
        },
        
        babel: {
            options: {
                sourceMap: false,
                presets: ['babel-preset-es2015']
                
            },
            dist: {
                files: [{
                   expand:true,
                   cwd:'dist/', //js目录下
                   src:['**/*.js'], //所有js文件
                   dest:'dist/'  //输出到此目录下
                 }] 
            }
        },
        uglify: {  
            options: {
             mangle: true, //混淆变量名
             comments: 'false' //false（删除全部注释），some（保留@preserve @license @cc_on等注释）
            },  
            my_target: {
                 files: [{
                   expand:true,
                   cwd:'dist/', //js目录下
                   src:['**.js'], //所有js文件
                   dest:'dist/'  //输出到此目录下
                 }] 
            } 
        }
	});


	//载入uglify插件，压缩js 
  	grunt.loadNpmTasks('grunt-contrib-copy');
  	grunt.loadNpmTasks('grunt-babel');
  	//grunt.loadNpmTasks('grunt-contrib-jshint');
  	grunt.loadNpmTasks('grunt-contrib-uglify'); 
  	grunt.loadNpmTasks('grunt-contrib-watch');
  	//注册任务  
  	grunt.registerTask('default', ['copy','babel','uglify']);
  	grunt.registerTask('watcher',['watch']);
};