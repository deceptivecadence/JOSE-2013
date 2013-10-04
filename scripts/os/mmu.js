//Memory Manager


function MemoryManager(){
	this.init = function(){
		this.baseIndex = 0;
		this.endIndex = 0;
		this.len = 255;
		this.memory = new Memory();
		this.memory.init();
		this.processArray = [];
	}

	this.load = function(program){
		if (this.memory.memoryArray.length !== 768){
	        if($.isArray(program)){
	        	if(program.length <= 256){
		        	this.baseIndex = this.memory.memoryArray.length;
		            this.memory.memoryArray = this.memory.memoryArray.concat(program);
		            this.endIndex = this.memory.memoryArray.length;
		            processBlock = new ProcessControlBlock().init("TODO");
		            this.processArray.push(processBlock);
		        }
	      	}
	    }
	}

}