
module.exports = function(grunt) {

	'use strict';

	var path			= require('path');
	var cwd				= process.cwd();
	var pkg				= grunt.file.readJSON('package.json');
	var remapify		= require('remapify');


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
		outputAssets	: '<%= sitePath %>/_ui',
		outputImages	: '<%= outputAssets %>/img',
		outputScripts	: '<%= outputAssets %>/js',
		outputStyles	: '<%= outputAssets %>/css',


		// Start a connect web server
		'connect': {
			dev: {
				options: {
					hostname: '*',
					port: '<%= portNum %>',
					base: '<%= sitePath %>/',
					livereload: '<%= lrPortNum %>'
				}
			}
		},

		// Compile javascript modules
		'browserify': {
			compile: {
				src: '<%= sourceScripts %>/initialize.js',
				dest: '<%= outputScripts %>/social-wall.js',
				options: {
					preBundleCB: function(b) {
						b.plugin(remapify, [
							{
								cwd: './src/scripts/config',
								src: './**/*.js',
								expose: 'config'
							},
							{
								cwd: './src/scripts/utilities',
								src: './**/*.js',
								expose: 'utilities'
							},
							{
								cwd: './src/scripts/widgets',
								src: './**/*.js',
								expose: 'widgets'
							}
						]);
					},
					transform: ['browserify-handlebars'],
					browserifyOptions: {
						fullPaths: false
					},
					debug: true
				}
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
				separator: '\n;\n'
			},
			libs: {
				src: [
					'<%= sourceVendor %>/modernizr.custom.min.js',
					'<%= sourceVendor %>/jquery.min.js',
					'<%= sourceVendor %>/masonry.pkgd.min.js',
					'<%= sourceVendor %>/imagesloaded.pkgd.min.js'
				],
				dest: '<%= outputScripts %>/vendor.js'
			}
		},

		// JS Linting using jshint
		'jshint': {
			options: {
				globals: {
					$: true,
					_: true,
					jQuery: true,
					Modernizr: true,
					alert: true,
					console: true,
					document: true,
					module: true,
					require: true,
					window: true
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
					dest: '<%= outputStyles %>/social-wall.css'
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
				tasks: ['sass']
			},
			templates: {
				files: '<%= sourceTemplates %>/**/*.hbs',
				tasks: ['browserify']
			}
		}

	});
	// end Grunt task config


	// Load task dependencies
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	

	// Register custom tasks
	grunt.registerTask('build', ['copy', 'sass', 'concat', 'jshint', 'browserify']);
	grunt.registerTask('run', ['build', 'connect', 'watch']);


};

