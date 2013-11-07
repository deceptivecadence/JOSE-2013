//Round Robin Scheduler


function CpuScheduler(){
	
	this.init = function(){
		this.quantum = 6;
	}
	
	this.check = function(){
		if(_ReadyQueue.getSize()>1){
			if(_OSclock % this.quantum === 0){
				this.cSwitch();
			}
		}
	}

	this.cSwitch = function (){
		_CPU.isExecuting = false;
		_CPU.program.update("paused");
		_ReadyQueue.enqueue(_CPU.program);
		_CPU.loadProgram(_ReadyQueue.dequeue());
		_CPU.isExecuting = true;
	}
}