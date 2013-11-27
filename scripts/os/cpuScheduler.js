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
            _KernelInterruptQueue.enqueue( new Interrupt(FILESYSTEM_IRQ, ["",PID_ON_FILE]) );
            var program = _ReadyQueue.dequeue();
            if(program.pid in _MMU.pidOnFile){
                var pOnFile = _KernelInterruptQueue.enqueue( new Interrupt(FILESYSTEM_IRQ, ["program"+program.pid, READ]) );
            }
            hostLog("Switched to program with pid: "+program.pid);
            _CPU.loadProgram(program);
            _CPU.isExecuting = true;
        }
    }

    this.changedSchedule = function (newSched){
        switch(newSched){
            case "rr": this.schedule = "rr"; this.quantum = 6;
                break;
            case "fcfs": this.schedule = "fcfs"; this.quantum = 1123581321345589144;
                break;
            case "priority": this.schedule = "priority";
                break;
            default: return false;
        }
        return true;
    }
}