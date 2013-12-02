//Memory Manager


function MemoryManager(){
	this.init = function(){
		this.baseIndex = 0;
		this.endIndex = 0;
		this.len = MEMORY_LENGTH - 1;
		this.memory = new Memory();
		this.memory.init();
		this.programArray = [];
		this.residentList = [];
		this.offset = 0;
		this.programsLoaded = 0;
		this.pidOnFile = [];
	}

	this.load = function(program){
		if (this.memory.memoryArray.length !== MEMORY_LENGTH * 3){
	        if($.isArray(program)){
	        	if(program.length <= MEMORY_LENGTH){
	        		//console.log("in mmu loaded");
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
		            //console.log(processBlock);
		            processBlock.init();
		            this.programArray.push(processBlock);
		            this.programsLoaded++
		            //console.log(processBlock);

		            var table = $("#tablePcb tbody").children()
		            var spaceFound = false;
		            table.each(function(){
		            	//console.log("program array length: "+_MMU.programArray.length)
		            	//console.log($(this.firstElementChild).text());
		            	//console.log(spaceFound);
		            	//console.log($(this).find("#pidRow"));
		            	if(!spaceFound && $(this).find("#pidRow").text() === "-"){
		            		spaceFound = true;
		            		//$(this).first().text(processBlock.pid);
		            		//console.log(" pcb table if");
		            		//console.log(processBlock.pid);
		            		$(this).find("#pidRow").text(processBlock.pid);
		            		$(this).find("#stateRow").text(processBlock.state);
		            		$(this).find("#baseRow").text(processBlock.baseIndex);
		            		$(this).find("#endRow").text(processBlock.endIndex);
		            		$(this).find("#pcRow").text(processBlock.PC);
		            		//console.log($(this));
		            		//console.log($(this.firstElementChild).text());
		            	}
		            });
		        }
	      	}
	    }
	    else{
	    	buffer = [];
			for (var i = 0; i < MEMORY_LENGTH - program.length; i++){
				buffer.push("00");
			}

			this.offset = this.programArray.length * MEMORY_LENGTH;
			bufferedProgram = program.concat(buffer);
        	this.offset = 512;
        	this.baseIndex = 512; // will replace last program in array

            this.endIndex = 767; // will replace alst program in array
            processBlock = new ProcessControlBlock();
            //console.log(processBlock);
            processBlock.init();
            this.programArray.push(processBlock);
	    	_KernelInterruptQueue.enqueue( new Interrupt(FILESYSTEM_IRQ, ["program"+this.programsLoaded,CREATE]) );
			_KernelInterruptQueue.enqueue( new Interrupt(FILESYSTEM_IRQ, ["program"+this.programsLoaded,WRITE,bufferedProgram.join(" ")]) );
			this.pidOnFile.push(this.programsLoaded);
			this.programsLoaded++

	    }
	}


	this.accessMem = function(location, advancement, offset){
		return this.memory.memoryArray[location + advancement + offset]
	}
}
