var generators = require('yeoman-generator');
var fs = require('fs');
var _ = require('lodash');

module.exports = generators.Base.extend({

	prompting: function() {

		console.log('Hi you!');

		this.prompt = this.prompt([{
	      	type     : 'input',
	      	name     : 'app',
	      	message  : 'What is the name of your app / module?',
	      	validate : function(input) {
	      		if (input.length >= 2) {
	      			return true;
	      		}
	      		return false;
	      	}
	    },
		{
	      	type    : 'list',
	      	name    : 'type',
	      	message : 'What would you like to create?',
	      	choices : ['controller', 'directive', 'service']
	    },
		{
	      	type    : 'input',
	      	name    : 'name',
	      	message : 'What is the name of your new component?',
	      	validate : function(input) {
	      		if (input.length >= 2) {
	      			return true;
	      		}
	      		return false;
	      	}
	    }
	    ]).then(function (answers) {
	    	this.answers = answers;
	    }.bind(this));
	},

	writing: function () {

		this.prompt.then(function() {

	    	var fileInfo = this._fileInfo(this.answers);

	    	// create component
			this.fs.copyTpl(
				this.templatePath(this.answers.type + '.html'),
				this.destinationPath(fileInfo.fileName + '.' + this.answers.type +'.js'),
				{ 
					componentName: fileInfo.componentName,
					htmlName: fileInfo.htmlName,
					moduleName: fileInfo.moduleName
				}
			);

			// create unit test
			this.fs.copyTpl(
				this.templatePath(this.answers.type + '.unit.html'),
				this.destinationPath(fileInfo.fileName + '.' + this.answers.type + '.unit.spec.js'),
				{ 
					componentName: fileInfo.componentName,
					htmlName: fileInfo.htmlName,
					moduleName: fileInfo.moduleName
				}
			);

		}.bind(this));

		this._fileInfo = function(answers) {
			var nameParts = answers.name.trim().split(' ');
		 	var fileName = '';
			var componentName = '';
			var htmlName = '';
			var moduleName = answers.app.toLowerCase();

			fileName += 'cb-' + moduleName + '.';
			// remove Uppercase and spaces
			_.each(nameParts, function(namePart) {
				var part = namePart.toLowerCase();
				componentName += part.charAt(0).toUpperCase() + part.slice(1);
				fileName += part + '.';
				htmlName += part + '-';
			});
			fileName = fileName.substring(0, fileName.length - 1);
			htmlName = htmlName.substring(0, htmlName.length - 1);

			return {
				fileName: fileName,
				componentName: componentName,
				htmlName: htmlName,
				moduleName: moduleName
			};
		};
  	}

});

if(!String.prototype.trim) {  
  String.prototype.trim = function () {  
    return this.replace(/^\s+|\s+$/g,'');  
  };  
} 