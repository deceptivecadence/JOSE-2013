 /* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {

    this.init = function() {
        this.PC    = 0;     // Program Counter
        this.Acc   = 0;     // Accumulator
        this.Xreg  = 0;     // X register
        this.Yreg  = 0;     // Y register
        this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
        this.program = null; // should have?
        this.isExecuting = false;
        this.step = false;
    };
    
    //Being called when CPU isExecuting
    this.cycle = function() {
        krnTrace("CPU cycle");
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.
        
        _CpuScheduler.check();
        if(this.isExecuting && this.PC < this.program.endIndex){    
            this.execute(this.fetch());
            //console.log("yes");
        }
        else{
            this.isExecuting = false;
            //console.log("no");
        }
        
    };

    //program - program (string array)
    this.load = function(program){ 
        _MMU.load(program);
    }

    this.loadProgram = function(pcb){
        this.program = pcb;
        this.PC    = pcb.PC;     // Program Counter
        this.Acc   = pcb.Acc;     // Accumulator
        this.Xreg  = pcb.Xreg;     // X register
        this.Yreg  = pcb.Yreg;     // Y register
        this.Zflag = pcb.Zflag;
        pcb.update("running");  
    }

    this.fetch = function(){
        return _MMU.memory.memoryArray[this.PC]//offset will change within individual instruction function
    }


    /*   
        A9: Load the accumulator with a constant
        AD: load the accumulator from memory (extra param)
        8D: store the accumulator in memory (extra param)
        6D: add with carry adds contents of an addr to the contents of the acc and keeps the result in acc (extra param)
        A2: load the x reg with a constant 
        AE: load the x reg from memory (extra param)
        A0: load the y reg with a constant
        AC: load the y reg from memory (extra param)
        EA: No operation
        00: Break
        EC: compare a byte in mem to the x reg sets z flag  if equal (extra param)
        D0: branch x byes if z flag == 0
        EE: increment the value of a byte
        FF: system call
            #$01 in X reg = print the integer stored
                 in the Y register.
            #$02 in X reg = print the 00 - terminated string stored at the address in the Y register
    */


    this.execute = function(inst){
        //console.log(inst + " INST");
        switch(inst){
            case "A9":this.loadAcc(); break;
            case "AD":this.loadAccFromMemory(); break;
            case "8D":this.storeAccInMemory(); break;
            case "6D":this.addFromMemoryToAcc(); break;
            case "A2":this.loadxReg(); break;
            case "AE":this.loadxRegFromMemory(); break;
            case "A0":this.loadyReg(); break;
            case "AC":this.loadyRegFromMemory(); break;
            case "EA":this.noOp(); break;
            case "00":this.breakOp(); break;
            case "EC":this.compareByteMemToX(); break;
            case "D0":this.branchIfZero(); break;
            case "EE":this.incrementByByte(); break;
            case "FF":this.systemCall(); break;
            default: this.invalidOpCode(); break;
        }
        //console.log("PC: " + this.PC.toString(16) + " Acc: " + this.Acc + " X-reg: " + this.Xreg + " Y-reg: " + this.Yreg + " Z-flag: " + this.Zflag);
        console.log("Last ran: "+inst + ", with PC = after: "+ (this.PC  - 256));
    }

    //A9
    this.loadAcc = function(){
        //console.log(this.PC);
        this.Acc = parseInt(_MMU.memory.memoryArray[this.PC + 1],16);
        this.incrementPC(2);
    }

    //AD
    this.loadAccFromMemory = function (){
        var address = parseInt(_MMU.memory.memoryArray[this.PC + 2] + _MMU.memory.memoryArray[this.PC + 1],16) + this.program.offset;//index of address 
        var val = this.checkBoundsReference(address) + this.program.offset;
        if(typeof address === "number"){
            this.Acc = val;
        }
        this.incrementPC(3);

    }

    //8D
    this.storeAccInMemory = function(){
        var indexOfAddress = parseInt(_MMU.memory.memoryArray[this.PC + 2] + _MMU.memory.memoryArray[this.PC + 1],16) + this.program.offset; //index of address
        var address = this.checkBounds(indexOfAddress);
        if(typeof address === "number"){
            _MMU.memory.memoryArray[address] = this.Acc.toString(16);
        }
        this.incrementPC(3);
    }

    //6D
    this.addFromMemoryToAcc = function(){
        var address = parseInt(_MMU.memory.memoryArray[this.PC + 2] + _MMU.memory.memoryArray[this.PC + 1],16) + this.program.offset; //index of address
        var val = this.checkBoundsReference(address);
        if(typeof val === "number"){
            this.Acc = this.Acc + val;
        }
        this.incrementPC(3);
    }

    //A2
    this.loadxReg = function(){
        this.Xreg = parseInt(_MMU.memory.memoryArray[this.PC + 1],16);
        this.incrementPC(2);
    }

    //AE
    this.loadxRegFromMemory = function(){
        var address = parseInt(_MMU.memory.memoryArray[this.PC + 2] + _MMU.memory.memoryArray[this.PC + 1],16) + this.program.offset; //index of address
        var val = this.checkBoundsReference(address);
        if(typeof val === "number"){
            this.Xreg = val;
        }
        this.incrementPC(3);
    }

    //A0
    this.loadyReg = function(){
        this.Yreg = parseInt(_MMU.memory.memoryArray[this.PC + 1],16);
        this.incrementPC(2);
    }

    //AC
    this.loadyRegFromMemory = function(){
        var indexOfAddress = parseInt(_MMU.memory.memoryArray[this.PC + 2] + _MMU.memory.memoryArray[this.PC + 1],16) + this.program.offset; //index of address
        var val = this.checkBoundsReference(indexOfAddress);
        if(typeof val === "number"){
            this.Yreg = val;
        }
        this.incrementPC(3);
    }

    //EA
    this.noOp = function(){
        this.incrementPC(1);
    }

    //00
    this.breakOp = function(){
        this.program.update('ended');
        this.isExecuting = false;
    }

    this.terminate = function(){
        this.program.update('terminated');
        this.isExecuting = false;
    }

    //EC
    this.compareByteMemToX = function(){
        var address = parseInt(_MMU.memory.memoryArray[this.PC + 2] + _MMU.memory.memoryArray[this.PC + 1],16) + this.program.offset; //index of address
        var value = this.checkBoundsReference(address);
        if(typeof value === "number"){
            console.log("*******"+address+"*********"+this.Xreg+" "+value+"*********")
            if(value === this.Xreg){
                this.Zflag = 1;
            }else{
                this.Zflag = 0;
            }
        }
        this.incrementPC(3);
    }

    //D0
    this.branchIfZero = function(){
        if(this.Zflag == 0){
            var additionalBranchBytes = parseInt(_MMU.memory.memoryArray[this.PC + 1],16);
            this.incrementPC(2);
            var newAddress = (this.PC + additionalBranchBytes) % this.program.limit;
            //var address = this.checkBounds(newAddress);
            this.PC = newAddress + this.program.offset;
        }else{
            this.incrementPC(2);
        }
    }

    //EE
    this.incrementByByte = function(){
        var address = parseInt(_MMU.memory.memoryArray[this.PC + 2] + _MMU.memory.memoryArray[this.PC + 1],16) + this.program.offset; //index of address
        var value = this.checkBoundsReference(address);
        if(typeof value === "number"){
            var newVal = parseInt(value,16) + 1;
            _MMU.memory.memoryArray[address] = newVal.toString(16); 
        }
        this.incrementPC(3);
    }

    //FF
    this.systemCall = function(){
        //var param =  parseInt(_MMU.memory.memoryArray[this.PC + 1],16);
        var address = this.Yreg + this.program.offset
        if(this.Xreg === 1){
            _StdIn.putText('' + this.Yreg);
            _StdIn.advanceLine();
            _OsShell.putPrompt();
        }else if(this.Xreg === 2 && typeof this.checkBoundsReference(address) === "number"){
            console.log("sysCall xreg- 2")
            //var address = this.Yreg + this.program.offset;
            var array = [];
            while (_MMU.memory.memoryArray[address] !== '00'){
                array.push(String.fromCharCode(parseInt(_MMU.memory.memoryArray[address],16)));
                address = address + 1;
            }
            _StdIn.putText(array.join(""))
            _StdIn.advanceLine();
            _OsShell.putPrompt();
        
        }else{
            console.log("sys call error");
        }
        this.incrementPC(1);

    }

    this.checkBoundsReference = function(index){

        if (index >= this.program.baseIndex && index <= this.program.endIndex){
            return parseInt(_MMU.memory.memoryArray[index],16);
        }else{
            /*console.log(index);
            console.log(this.program.baseIndex);
            console.log(this.program.endIndex);
            console.log("bounds");*/
            //this.init(); //resets cpu attributes since program failed
            //TODO:raise memory bounds error
            this.terminate();
            _KernelInterruptQueue.enqueue( new Interrupt(MEMORY_OUT_OF_BOUNDS, [this.program.pid,this.PC]) );
        }

    }

    this.checkBounds = function(index){
        if (index >= this.program.baseIndex && index <= this.program.endIndex){
            return index;
        }
        else{
            /*console.log(index);
            console.log(this.program.baseIndex);
            console.log(this.program.endIndex);
            console.log("bounds");*/
            //this.init(); //resets cpu attributes since program failed
            //TODO:raise memory bounds error
            _KernelInterruptQueue.enqueue( new Interrupt(MEMORY_OUT_OF_BOUNDS, [this.program.pid,this.PC]) );
        }

    }
    this.invalidOpCode = function(){
        _KernelInterruptQueue.enqueue( new Interrupt(INVALID_OP_CODE, [this.program.pid,this.PC]) );
    }
    this.incrementPC = function(amount){
        this.PC = this.PC + amount
    }

    this.memoryAccessInMemory = function(addressOne, addressTwo){
        
    }

    this.memoryAccess = function(address){

    }
}
