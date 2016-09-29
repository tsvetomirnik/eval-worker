# eval-worker
A simple Web Worker to evaluate JavaScript code in clean global contex.

## Example
```javascript
var worker = new Worker('src/eval-worker.js');

// Send
worker.postMessage({
  command: 'execute',
  value: {
    expression: 'return (a + b) * 2;',
    args: { a: 1, b: 2 }
  }
});

// Receive
worker.addEventListener('message', function (e) {
  // Error
  if (e.data.error) {
    alert(e.data.error.message);
    return;
  }

  // Success
  alert(JSON.stringify(e.data.output));
}, false);
```
