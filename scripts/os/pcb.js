/*
	Process Control Block
*/



function ProcessControlBlock(){
	
	this.init = function(){
		this.state          = "ready";	 //Process state
		this.limit          = MEMORY_LENGTH;	 //memory limit
		this.baseIndex      = _MMU.baseIndex;	 //memory base addrress
		this.endIndex       = _MMU.endIndex + (this.limit - _MMU.endIndex);
		this.pid            = _MMU.programArray.length;	 //Process id
		this.PC             = _CPU.PC;     // Program Counter
	    this.Acc   			= _CPU.Acc;     // Accumulator
	    this.Xreg  			= _CPU.Xreg;     // X register
	    this.Yreg  			= _CPU.Yreg;     // Y register
	    this.Zflag 			= _CPU.Zflag;     // Z-ero flag
	}
	
	this.update = function(state){
		this.state          = state;	 //Process state
		this.limit          = MEMORY_LENGTH;	 //memory limit
		this.baseIndex      = _MMU.baseIndex;	 //memory base addrress
		this.endIndex       = _MMU.endIndex + (this.limit - _MMU.endIndex);
		//this.pid            = _MMU.programArray.length;	 //Process id should not change
		this.PC             = _CPU.PC   // Program Counter
	    this.Acc   			= _CPU.Acc;     // Accumulator
	    this.Xreg  			= _CPU.Xreg;     // X register
	    this.Yreg  			= _CPU.Yreg;     // Y register
	    this.Zflag 			= _CPU.Zflag;     // Z-ero flag
	}
}