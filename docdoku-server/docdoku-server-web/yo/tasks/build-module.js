module.exports = function(grunt) {
	'use strict';
	/*
	 * Module build : grunt build-module:documentManagement
	 * */
	grunt.registerTask('build-module', function (module) {

		if(module === 'documentManagement'){
			return grunt.task.run([
				'clean:documentManagement',
				'requirejs:documentManagement',
				'uglify:documentManagement',
				'less:documentManagement',
				'htmlmin:documentManagement',
				'usemin:documentManagement'
			]);
		}

		if(module === 'productManagement'){
			return grunt.task.run([
				'clean:productManagement',
				'requirejs:productManagement',
				'uglify:productManagement',
				'less:productManagement',
				'htmlmin:productManagement',
				'usemin:productManagement'
			]);
		}

		if(module === 'productStructure'){
			return grunt.task.run([
				'clean:productStructure',
				'requirejs:productStructure',
				'uglify:productStructure',
				'less:productStructure',
				'htmlmin:productStructure',
				'usemin:productStructure'
			]);
		}

		if(module === 'changeManagement'){
			return grunt.task.run([
				'clean:changeManagement',
				'requirejs:changeManagement',
				'uglify:changeManagement',
				'less:changeManagement',
				'htmlmin:changeManagement',
				'usemin:changeManagement'
			]);
		}

		if(module === 'productFrame'){
			return grunt.task.run([
				'clean:productFrame',
				'requirejs:productFrame',
				'uglify:productFrame',
				'less:productFrame',
				'htmlmin:productFrame',
				'usemin:productFrame'
			]);
		}

	});
};
