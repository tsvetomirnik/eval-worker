(function () {
  "use strict";

  function getExpression(code) {
    // TODO: Hide global variables
    // https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope
    var globalsToHide = [
      'self',
      'caches',
      'console',
      'close',
      'ctypto',
      'location',
      'navigator',
      'onmessage',
      'onerror',
      'onrejectionhandled',
      'onunhandledrejection',
      'performance',
      'postMessage',
      'PERSISTENT',
      'TEMPORARY',
      'indexedDB',
      'importScripts',
      'webkitIndexedDB'
    ];

    var hideExpression = 'var ' + globalsToHide.join(',') + '=undefined;';
    return 'return(function(){"use strict";' + hideExpression + code + '}())';
  }


  /**
   * @param {string} expression - Body of the function
   * @param {Object} args - Associative array for the function arguments
   */
  self.execute = function (expression, args) {
    var argsNames = [],
      argsValues = [],
      func,
      funcDefinitionArgs;

    args = args || {};

    for (var key in args) {
      argsNames.push(key);
      argsValues.push(args[key]);
    }

    funcDefinitionArgs = argsNames.slice(0);
    funcDefinitionArgs.push(expression);

    func = Function.apply({}, funcDefinitionArgs);
    return func.apply({}, argsValues);
  };


  // Communication
  self.addEventListener('message', function (e) {
    switch (e.data.command) {
      case 'execute':
        self.executeCommand(e.data.value);
        break;
      case 'kill':
        self.close();
        break;
      default:
        throw new Error('Unknown command');
    };
  }, false);
  
  
  self.executeCommand = function (data) {
     var expression = getExpression(data.code),
      result;

    try {
      result = self.execute(expression, data.args);
    } catch (error) {
      return self.postMessage({
        type: 'error',
        value: {
          error: {
            message: error.message
          }
        }
      });
    }

    // Completed
    self.postMessage({ type: 'result', value: { result: result } });
  };

}());
