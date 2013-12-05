/*
	Process Control Block
*/



function ProcessControlBlock(){
	
	this.init = function(){
		this.state          = "ready";	 //Process state
		this.limit          = MEMORY_LENGTH;	 //memory limit
		this.baseIndex      = _MMU.baseIndex;	 //memory base addrress
		this.endIndex       = _MMU.baseIndex + this.limit - 1;
		this.pid            = _MMU.programsLoaded;	 //Process id
		this.PC             = 0;     // Program Counter
	    this.Acc   			= 0;     // Accumulator
	    this.Xreg  			= 0;     // X register
	    this.Yreg  			= 0;     // Y register
	    this.Zflag 			= 0;     // Z-ero flag
	    this.offset         = _MMU.offset;
	    this.priority       = 1;
	}
	
	this.update = function(state){
		this.state          = state;	 //Process state
		//this.limit          = MEMORY_LENGTH;	 //memory limit
		//this.baseIndex      = _MMU.baseIndex;	 //memory base addrress
		//this.endIndex       = _MMU.baseIndex + this.limit;
		//this.pid            = _MMU.programArray.length;	 //Process id should not change
		this.PC             = _CPU.PC   // Program Counter
	    this.Acc   			= _CPU.Acc;     // Accumulator
	    this.Xreg  			= _CPU.Xreg;     // X register
	    this.Yreg  			= _CPU.Yreg;     // Y register
	    this.Zflag 			= _CPU.Zflag;     // Z-ero flag
	}

	this.resetVals = function(){
		this.PC             = 0;     // Program Counter
	    this.Acc   			= 0;     // Accumulator
	    this.Xreg  			= 0;     // X register
	    this.Yreg  			= 0;     // Y register
	    this.Zflag 			= 0;     // Z-ero flag
	}
}
