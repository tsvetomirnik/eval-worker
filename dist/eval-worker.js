var evalWorker = {
	var blob = new Blob([
		'(function () {\r\n  \"use strict\";\r\n\r\n  var commands = {\r\n    \'execute\': function (data) {\r\n      var functionBody = generateFunctionBody(data.expression),\r\n        output;\r\n\r\n      try {\r\n        output = evalExpression(functionBody, data.args);\r\n        sendResult(data, output, null);\r\n      } catch (error) {\r\n        sendResult(data, null, error);\r\n      }\r\n    },\r\n    \'kill\': function () {\r\n      self.close();\r\n    }\r\n  }\r\n\r\n  // Communication\r\n  self.onmessage = function (e) {\r\n    var command = commands[e.data.command];\r\n    if (!command) {\r\n      throw new Error(\'Unknown command\');\r\n    }\r\n    command(e.data.value);\r\n  }\r\n\r\n\r\n  function generateFunctionBody(code) {\r\n    var globalsToHide = [\r\n      \'self\',\r\n      \'close\',\r\n      \'onmessage\',\r\n      \'onerror\',\r\n      \'postMessage\',\r\n      \'importScripts\'\r\n    ];\r\n\r\n    var hideExpression = \'var \' + globalsToHide.join(\',\') + \'=undefined;\';\r\n    return \'return(function(){\"use strict\";\' + hideExpression + code + \'}())\';\r\n  }\r\n\r\n\r\n  function evalExpression(expression, args) {\r\n    var argsNames = [],\r\n      argsValues = [],\r\n      funcDefinitionArgs,\r\n      func;\r\n\r\n    args = args || {};\r\n\r\n    for (var key in args) {\r\n      argsNames.push(key);\r\n      argsValues.push(args[key]);\r\n    }\r\n\r\n    funcDefinitionArgs = argsNames.slice(0);\r\n    funcDefinitionArgs.push(expression);\r\n\r\n    func = Function.apply({}, funcDefinitionArgs);\r\n    return func.apply({}, argsValues);\r\n  }\r\n\r\n\r\n  function sendResult(input, output, error) {\r\n    var result = {\r\n      input: input,\r\n      output: output\r\n    };\r\n\r\n    if (error) {\r\n      result.error = {\r\n        message: error.message\r\n      };\r\n    }\r\n\r\n    self.postMessage(result);\r\n  }\r\n\r\n} ());\r\n'
	]);

	var blobURL = window.URL.createObjectURL(blob);
	
	return {
		createInstance: function () {
			return new Worker(blobURL);
		}
	};
};