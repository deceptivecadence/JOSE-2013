//Memory Manager


function MemoryManager(){
	this.init = function(){
		this.baseIndex = 0;
		this.endIndex = 0;
		this.len = MEMORY_LENGTH - 1;
		this.memory = new Memory();
		this.memory.init();
		this.programArray = [];
		this.offset = 0;
	}

	this.load = function(program){
		if (this.memory.memoryArray.length !== MEMORY_LENGTH * 3){
	        if($.isArray(program)){
	        	if(program.length <= MEMORY_LENGTH){
	        		console.log("in mmu loaded");
					buffer = [];
					
					for (var i = 0; i < MEMORY_LENGTH - program.length; i++){
						buffer.push("00");
					}
					
					this.offset = this.programArray.length * MEMORY_LENGTH;
					bufferedProgram = program.concat(buffer);
		        	this.baseIndex = this.memory.memoryArray.length;
		            this.memory.memoryArray = this.memory.memoryArray.concat(bufferedProgram);
		            this.endIndex = this.memory.memoryArray.length - 1;
		            processBlock = new ProcessControlBlock();
		            processBlock.init();
		            this.programArray.push(processBlock);
		        }
	      	}
	    }
	}

}
