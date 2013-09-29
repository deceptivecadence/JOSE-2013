/*
	Process Control Block
*/



function ProcessControlBlock(){
	

	this.init = function(cpuData){
		this.state          = "";	 //Process state
		this.programCounter = "";	 //Program Counter
		this.base           = cpuData.baseIndex;	 //memory base addrress
		this.end          	= cpuData.endIndex;	 //memory limit
		this.pid            = cpuData.numberOfProcesses;	 //Process id
		this.PC             = 0;     // Program Counter
	    this.Acc   			= cpuData.Acc;     // Accumulator
	    this.Xreg  			= cpuData.Xreg;     // X register
	    this.Yreg  			= cpuData.Yreg;     // Y register
	    this.Zflag 			= cpuData.Zflag;     // Z-ero flag
	}
}