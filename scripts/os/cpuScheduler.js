//Round Robin Scheduler


function CpuScheduler(){
	
	this.init = function(){
		this.quantum = 6;
		this.counter = 0;
	}
	
	this.check = function(){
		if(_ReadyQueue.getSize()>0){
			if(this.counter % this.quantum === 0 || _CPU.program.state==="ended"){
				this.cSwitch();
			}
			this.counter += 1;
		}else if (_CPU.program === null){
			_CPU.isExecuting = false;
		}else{
			//_CPU.program = null;
		}
	}

	this.cSwitch = function (){
		_CPU.isExecuting = false;
		this.counter = 0;
		if(_CPU.program.state !== "ended"){
			_CPU.program.update("paused");
			_ReadyQueue.enqueue(_CPU.program);
		}
		if(_ReadyQueue.getSize()>0){
			_CPU.loadProgram(_ReadyQueue.dequeue());
			_CPU.isExecuting = true;
		}
	}
}