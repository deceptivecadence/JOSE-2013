//Memory Manager


function MemoryManager(){
	this.init = function(){
		this.baseIndex = 0;
		this.endIndex = 0;
		this.len = 255;
	}

	this.load = function(program){
		if (_Memory.memoryArray.length !== 768){
	        if($.isArray(program)){
	        	this.baseIndex = _Memory.memoryArray.length;
	            _Memory.memoryArray = _Memory.memoryArray.concat(program);
	            this.endIndex = _Memory.memoryArray.length;
	            processBlock = new ProcessControlBlock().init("TODO");
	      	}
	    }
	}

}