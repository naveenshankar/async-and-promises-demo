
// Async Tasks
function syncTaskA(done) { console.log('A'); done(); }
function asyncTaskB(done) { setTimeout(function() { console.log('B'); done();}, 1000) };
function asyncTaskC(done) { setTimeout(function() { console.log('C'); done();}, 4000) };
function syncTaskD(done) { console.log('D'); done(); }
function asyncTaskE(done) { setTimeout(function() { console.log('E'); done();}, 2000) };

// Question: Async Task Runner
function TaskRunner() {
   this.tasks = [];
}

TaskRunner.prototype.add = function (task,taskValue) {
    var taskPromise = new Promise (function(resolve,reject){
            task(function(){
                resolve(taskValue);
            });
    });
    return taskPromise;
}

TaskRunner.prototype.push = function (task,taskValue) {
    var taskPromiseFunction = function(){
      return new Promise (function(resolve,reject){
        task(function(){
          document.getElementById('output').innerHTML = document.getElementById('output').innerHTML +
          taskValue;
          resolve(taskValue);
        });
      });
    }
    this.tasks.push(taskPromiseFunction);
    //console.log(Object.assign({},this.tasks));
    return taskPromiseFunction;
}

//SOLUTION 1 WITH ARRAY REDUCE
TaskRunner.prototype.runTasksWithReduceSynchronously1 = function(){  this.tasks.reduce(function(acc,currVal,currIndex,arr)
 {
 		//console.log('currIndex',currIndex);
    //console.log('acc',acc);
    if(currIndex == 1){
    	return acc().then(currVal);
      //return arr[0]().then(currVal);
    }
    else{
    	return acc.then(currVal);
    }
 });//no acc means its the first value of arr
}

TaskRunner.prototype.runTasksWithReduceSynchronously2 = function(){  this.tasks.reduce(function(acc,currVal,currIndex,arr)
 {
 		//console.log('currIndex',currIndex);
    //console.log('acc',acc);
    if(currIndex == 0){
      return arr[0]();
    }
    else{
    	return acc.then(currVal);
    }
 },"firstValueforAccumulator");
}

TaskRunner.prototype.runTasksWithReduceSynchronously3 = function(){  this.tasks.reduce(function(acc,currVal,currIndex,arr)
 {
    	return acc.then(currVal);
 },Promise.resolve('A-Z'));
}

//SOLUTION 2 WITH ASYNC AWAIT
TaskRunner.prototype.runTasksASynchronouslyWithForLoops = function(){
    for (let task in this.tasks) {
      	this.tasks[task]();
    }
}

TaskRunner.prototype.runTasksSynchronouslyWithAsyncAwaitandForLoops = async function(){
    for (const task of this.tasks) {
      	await task();
    }
}

//SOLUTION 3 WITH LOOPED PROMISE THEN() - BAD PRACTICE
TaskRunner.prototype.runTasksSynchronouslyWithLoopedPromises = function () {
	//r.add(syncTaskA).then(function(){
 //    r.add(asyncTaskB).then(function(){
 //        r.add(asyncTaskC).then(function(){
 //            r.add(syncTaskD);
 //        });
 //    });
 //});
 
	var index = 0;		Promise.resolve().then(this.tasks[index]).then(this.tasks[++index]).then(this.tasks[++index]).then(this.tasks[++index]).then(this.tasks[++index]);
}

// SOLUTION 4 WITH RECURSION
TaskRunner.prototype.runTasksWithPureRecursionSynchronously = function(){
  var recursiveCall = function(index){
    index++;
    if(index < 5){
    	return this.tasks[index]().then(recursiveCall.bind(this,index));
    }
  }
  recursiveCall.call(this,-1);
}

TaskRunner.prototype.runTasksWithPureRecursionAsynchronously = function(){
  var recursiveCall = function(index){
    index++;
    if(index < 5){
    	return this.tasks[index]().then(recursiveCall.call(this,index));
    }
  }
  recursiveCall.call(this,-1);
}

var executeTask =  document.getElementById('run_task');
executeTask.addEventListener('click',function(e){
  var allRadios =  document.getElementsByClassName('promises');
  var r = new TaskRunner();
  
  r.push(syncTaskA,'A');
  r.push(asyncTaskB,'B');
  r.push(asyncTaskC,'C');
  r.push(syncTaskD,'D');
  r.push(asyncTaskE,'E');
  
  Array.prototype.slice.call(allRadios).forEach(function(val,index){
    if(val.checked){
      document.getElementById('output').innerHTML = '<div>OUTPUT:</div>';
      r[val.value].call(r);
    }
  });
  //SOLUTIONS:
  //r.runTasksWithReduceSynchronously1();
  //r.runTasksWithReduceSynchronously2();
  //r.runTasksWithReduceSynchronously3();
  //r.runTasksWithPureRecursionAsynchronously();
  //r.runTasksWithPureRecursionSynchronously();
  //r.runTasksSynchronouslyWithLoopedPromises(); //BAD PRACTICE
  //r.runTasksASynchronouslyWithForLoops();
  //r.runTasksSynchronouslyWithAsyncAwaitandForLoops();
});
