# async-and-promises-demo

* Async Tasks
function syncTaskA(done) { console.log('A'); done(); }
function asyncTaskB(done) { setTimeout(function() { console.log('B'); done();}, 1000) };
function asyncTaskC(done) { setTimeout(function() { console.log('C'); done();}, 4000) };
function syncTaskD(done) { console.log('D'); done(); }
function asyncTaskE(done) { setTimeout(function() { console.log('E'); done();}, 2000) };

* Question: Async Task Runner
* function TaskRunner() {

  }

* TaskRunner.prototype.push = function (task,taskValue) {

  }
