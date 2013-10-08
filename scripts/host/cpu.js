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
    };
    
    //Being called when CPU isExecuting
    this.cycle = function() {
        krnTrace("CPU cycle");
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.
        if(this.PC < this.program.endIndex){
            this.execute(this.fetch());
        }
        else{
            this.isExecuting = false;
        }
        
    };

    //program - program (string array)
    this.load = function(program){ 
        _MMU.load(program);
        updateMemory();
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
        switch(inst){
            case "A9":this.loadAcc(); break;
            case "AD":this.loadAccFromMemory(); break;
            case "8D":this.storeAccMemory(); break;
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
            default: //TODO: ERROR
        }

    }

    this.loadAcc = function(){
        //console.log(this.PC);
        this.Acc = parseInt(_MMU.memory.memoryArray[this.PC + 1],16);
        this.PC = this.PC + 2;
        console.log(this.PC);
    }
    this.loadAccFromMemory = function (){
        //TODO: NEED TO READ OTHER PARAM?
        var indexOfAddress = praseInt(_MMU.memory.memoryArray[this.PC + 1],16); //index of address
        var address = checkBounds(indexOfAddress);
        if(typeof address === "number"){
            this.Acc = parseInt(_MMU.memory.memoryArray[address],16);
            this.PC = this.PC + 3
        }

    }
    this.storeAccMemory = function(){

    }
    this.addFromMemoryToAcc = function(){

    }
    this.loadxReg = function(){

    }
    this.loadxRegFromMemory = function(){

    }
    this.loadyReg = function(){

    }
    this.loadyRegFromMemory = function(){

    }
    this.noOp = function(){

    }
    this.breakOp = function(){

    }
    this.compareByteMemToX = function(){

    }
    this.branchIfZero = function(){

    }
    this.incrementByByte = function(){

    }
    this.systemCall = function(){

    }
    this.checkBounds = function(index){
        if (index <= this.prog.endIndex){
            return _MMU.memory.memoryArray[index];
        }
        else{
            this.init(); //resets cpu attributes since program failed
            //TODO:raise memory bounds error
            return null;
        }
    }
}
