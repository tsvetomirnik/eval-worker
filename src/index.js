var evalWorker = {
	var blob = new Blob([
		//@include('../dist/eval-worker.js')
	]);

	var blobURL = window.URL.createObjectURL(blob);
	
	return {
		createInstance: function () {
			return new Worker(blobURL);
		}
	};
};