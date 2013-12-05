function CpuScheduler(){

    this.init = function(){
        this.quantum = 6;
        this.counter = 1;
        this.schedule = "rr";
    }

    this.check = function(){
        if(_ReadyQueue.getSize()>0){
            if(this.counter % this.quantum === 0 || _CPU.program.state==="ended"){
                _KernelInterruptQueue.enqueue( new Interrupt(SOFTWARE_CONTEXT_SWITCH, []));
            }
            //this.counter += 1;
            }
            else if (_ReadyQueue.getSize() === 0 && _CPU.program.state==="ended"){
                _CPU.isExecuting = false;
            }else{
            //_CPU.program = null;
            }
    }

    this.cSwitch = function (){
        _CPU.isExecuting = false;
        this.counter = 1;
        if(_CPU.program.state !== "ended"){
            _CPU.program.update("paused");
            _ReadyQueue.enqueue(_CPU.program);
        }
        if(_ReadyQueue.getSize()>0){
            var newProgram = _ReadyQueue.dequeue();
            var oldProgram = _CPU.program;
            //console.log(newProgram.pid)
            //console.log(_MMU.pidOnFile)
            DID_SWAP = false;
            if(_MMU.pidOnFile[0] === newProgram.pid){
                console.log("switch to disk")
                //program is swapped
                DID_SWAP = true;
               _KernelInterruptQueue.enqueue( new Interrupt(FILESYSTEM_IRQ, [oldProgram, SWAP, newProgram]) );
               //console.log(_KernelInterruptQueue)
            }
            //console.log(DID_SWAP)
            if(!DID_SWAP){
                this.loadProgram(newProgram);
            }
        }
    }

    this.loadProgram = function(newProgram){
        hostLog("Switched to program with pid: "+newProgram.pid);
        _CPU.loadProgram(newProgram);
        _CPU.isExecuting = true;
    }
    this.changedSchedule = function (newSched){
        switch(newSched){
            case "rr": this.schedule = "rr"; this.quantum = 6;
                break;
            case "fcfs": this.schedule = "fcfs"; this.quantum = 1123581321345589144; _ReadyQueue.q.sort(function(a,b){return a.pid - b.pid});
                break;
            case "priority": this.schedule = "priority"; this.quantum = 1123581321345589144; _ReadyQueue.q.sort(function(a,b){return a.priority - b.priority});
                break;
            default: return false;
        }
        return true;
    }
}