/*
	Main Memory Prototype
*/


function Memory(){
	this.init = function() {
		this.memoryArray = [];
	}

    this.load = function(data){
    if (this.memory.length !== 768){
        if($.isArray(data)){
            this.baseIndex = this.memory.length
            this.memory = this.memory.concat(data)
            this.endIndex = this.memory.length
            this.numberOfProcesses += 1
            

      }
    }
    else{
        //TODO: throw memory interrupt
    }
}