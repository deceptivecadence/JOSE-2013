/*
	Process Control Block
*/



function ProcessControlBlock(){
	
	this.init = function(memoryData){
		this.state          = "ready";	 //Process state
		this.programCounter = "";	 //Program Counter
		this.baseIndex      = _MMU.baseIndex;	 //memory base addrress
		this.endIndex       = _MMU.endIndex;
		this.limit          = 255;	 //memory limit
		this.pid            = _MMU.processArray.length + 1;	 //Process id
		this.PC             = 0;     // Program Counter
	    this.Acc   			= _CPU.Acc;     // Accumulator
	    this.Xreg  			= _CPU.Xreg;     // X register
	    this.Yreg  			= _CPU.Yreg;     // Y register
	    this.Zflag 			= _CPU.Zflag;     // Z-ero flag
	}
}