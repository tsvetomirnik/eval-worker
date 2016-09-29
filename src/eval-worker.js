(function () {
  "use strict";

  var commands = {
    'execute': function (data) {
      var functionBody = generateFunctionBody(data.expression),
        output;

      try {
        output = evalExpression(functionBody, data.args);
        sendResult(data, output, null);
      } catch (error) {
        sendResult(data, null, error);
      }
    },
    'kill': function () {
      self.close();
    }
  }

  // Communication
  self.onmessage = function (e) {
    var command = commands[e.data.command];
    if (!command) {
      throw new Error('Unknown command');
    }
    command(e.data.value);
  }


  function generateFunctionBody(code) {
    var globalsToHide = [
      'self',
      'close',
      'onmessage',
      'onerror',
      'postMessage',
      'importScripts'
    ];

    var hideExpression = 'var ' + globalsToHide.join(',') + '=undefined;';
    return 'return(function(){"use strict";' + hideExpression + code + '}())';
  }


  function evalExpression(expression, args) {
    var argsNames = [],
      argsValues = [],
      funcDefinitionArgs,
      func;

    args = args || {};

    for (var key in args) {
      argsNames.push(key);
      argsValues.push(args[key]);
    }

    funcDefinitionArgs = argsNames.slice(0);
    funcDefinitionArgs.push(expression);

    func = Function.apply({}, funcDefinitionArgs);
    return func.apply({}, argsValues);
  }


  function sendResult(input, output, error) {
    var result = {
      input: input,
      output: output
    };

    if (error) {
      result.error = {
        message: error.message
      };
    }

    self.postMessage(result);
  }

} ());
