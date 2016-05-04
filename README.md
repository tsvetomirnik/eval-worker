# eval-worker
Eval expression executed in web worker without access to global variables.  

## Example
```javascript
var worker = new Worker('src/eval-worker.js');

// Send
worker.postMessage({
  command: 'execute',
  value: {
    code: 'return (a + b) * 2;',
    args: { a: 1, b: 2 }
  }
});

// Receive
worker.addEventListener('message', function (e) {
  if (e.data.type === 'result') {
    alert(JSON.stringify(e.data.value.result));
  }
}, false);
```
