
module.exports = function(grunt) {

	'use strict';

	var path = require('path');
	var cwd = process.cwd();
	var pkg = grunt.file.readJSON('package.json');
	var pathmodify = require('pathmodify');


	var paths = [
		pathmodify.mod.dir('config', path.join(__dirname, './src/scripts/config')),
		pathmodify.mod.dir('utilities', path.join(__dirname, './src/scripts/utilities')),
		pathmodify.mod.dir('widgets', path.join(__dirname, './src/scripts/widgets')),
		pathmodify.mod.dir('templates', path.join(__dirname, './src/templates'))
	];

	// Project configuration.
	grunt.initConfig({

		// Pkg data
		pkg				: pkg,
		pkgName			: '<%= pkg.name %>',
		pkgDesc			: '<%= pkg.description %>',
		metaTitle		: '<%= pkg.title %>',
		portNum			: '<%= pkg.portNumber %>',
		lrPortNum		: '<%= pkg.livereloadPortNum %>',
		// source file paths
		sourcePath		: './src',
		sourceHTML		: '<%= sourcePath %>/html',
		sourceImages	: '<%= sourcePath %>/images',
		sourceScripts	: '<%= sourcePath %>/scripts',
		sourceStyles	: '<%= sourcePath %>/styles',
		sourceTemplates	: '<%= sourcePath %>/templates',
		sourceVendor	: '<%= sourcePath %>/vendor',
		// output file paths
		sitePath		: './public',
		outputAssets	: '<%= sitePath %>/_assets',
		outputImages	: '<%= outputAssets %>/images',
		outputScripts	: '<%= outputAssets %>/scripts',
		outputStyles	: '<%= outputAssets %>/styles',


		// Start a connect web server
		'connect': {
			dev: {
				options: {
					hostname: '*',
					base: '<%= sitePath %>/',
					port: '<%= portNum %>',
					livereload: '<%= lrPortNum %>'
				}
			}
		},

		// Compile javascript modules
		'browserify': {
			options: {
				transform: ['browserify-handlebars', ['babelify', {presets: ['latest']}]],
				configure: function(b) {
					b.plugin(pathmodify, {mods: paths});
				},
				browserifyOptions: {
					extensions: ['.hbs'],
					fullPaths: false
				}
			},
			compile: {
				options: {
					debug: true
				},
				files: [{
					src: '<%= sourceScripts %>/initialize.js',
					dest: '<%= outputScripts %>/<%= pkgName %>.js'
				}]
			}
		},

		// Copy files and folders
		'copy': {
			html: {
				files: [{
					cwd: '<%= sourceHTML %>',
					src: '**/*.html',
					dest: '<%= sitePath %>',
					expand: true
				}]
			},
			images: {
				files: [{
					cwd: '<%= sourceImages %>',
					src: '**/*.*',
					dest: '<%= outputImages %>',
					expand: true
				}]
			}
		},

		// Concatenate files
		'concat': {
			options: {
				separator: '\n\n'
			},
			libs: {
				src: [
					'<%= sourceVendor %>/modernizr.custom.min.js',
					'<%= sourceVendor %>/jquery.min.js',
					'<%= sourceVendor %>/masonry.pkgd.min.js',
					'<%= sourceVendor %>/imagesloaded.pkgd.min.js',
					'<%= sourceVendor %>/underscore.min.js'
				],
				dest: '<%= outputScripts %>/vendor.js'
			}
		},

		// JS Linting using jshint
		'jshint': {
			options: {
				// esnext: true,
				esversion: 6,
				globals: {
					'alert': true,
					'console': true,
					'document': true,
					'module': true,
					'require': true,
					'window': true,
					'Modernizr': true,
					'jQuery': true,
					'$': true,
					'_': true,
					'Masonry': true,
					'Application': true
				}
			},
			files: [
				'<%= sourceScripts %>/**/*.js'
			]
		},

		// Compile Sass to CSS
		'sass': {
			compile: {
				options: {
					style: 'expanded'
				},
				files: [{
					src: '<%= sourceStyles %>/styles.scss',
					dest: '<%= outputStyles %>/<%= pkgName %>.css'
				}]
			}
		},

		// Add vendor-prefixed CSS properties
		'autoprefixer': {
			compile: {
				options: {
					browsers: ['last 5 versions', 'ie 9'],
					map: true
				},
				files: [{
					src: '<%= outputStyles %>/<%= pkgName %>.css',
					dest: '<%= outputStyles %>/<%= pkgName %>.css'
				}]
			}
		},

		// Watch files for changes
		'watch': {
			options: {
				spawn: false,
				livereload: '<%= lrPortNum %>'
			},
			html: {
				files: '<%= sourceHTML %>/**/*.html',
				tasks: ['copy:html']
			},
			images: {
				files: '<%= sourceImages %>/**/*.*',
				tasks: ['copy:images']
			},
			scripts: {
				files: '<%= sourceScripts %>/**/*.js',
				tasks: ['jshint', 'browserify']
			},
			styles: {
				files: '<%= sourceStyles %>/**/*.scss',
				tasks: ['sass', 'autoprefixer']
			},
			templates: {
				files: '<%= sourceTemplates %>/**/*.hbs',
				tasks: ['browserify']
			}
		}

	});
	// end Grunt task config


	// Load task dependencies
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	

	// Register custom tasks
	grunt.registerTask('build', ['copy', 'sass', 'autoprefixer', 'concat', 'jshint', 'browserify']);
	grunt.registerTask('run', ['build', 'connect', 'watch']);


};

