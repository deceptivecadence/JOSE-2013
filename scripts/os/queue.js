/* ------------
   Queue.js
   
   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at http://www.w3schools.com/jsref/jsref_obj_array.asp .
   Look at the push and shift methods, as they are the least obvious here.
   
   ------------ */
   
function Queue()
{
    // Properties
    this.q = new Array();

    // Methods
    this.getSize = function() {
        return this.q.length;    
    };

    this.isEmpty = function(){
        return (this.q.length == 0);    
    };

    this.enqueue = function(element) {
        this.q.push(element);
        _CpuScheduler.changedSchedule(_CpuScheduler.schedule); //schedule doesn't change, but used for ordering      
    };
    
    this.dequeue = function() {
        var retVal = null;
        if (this.q.length > 0)
        {
            retVal = this.q.shift();
        }
        return retVal;        
    };

    this.toString = function() {
        var retVal = "";
        for (var i in this.q)
        {
            retVal += "[" + this.q[i] + "] ";
        }
        return retVal;
    };

    this.toStringSpecific = function(property) {
        var retVal = "";
        if(property === "pid"){
            for (var i in this.q)
            {
                retVal += "[" + this.q[i].pid + "] ";
            }
            return retVal;
        }
        
    };

    this.containsProgram = function(pid){
        for (var i=0; i<this.q.length;i++){
            if(this.q[i].pid === parseInt(pid)){
                return true;
            }
        }
        return false;
    }

    this.removeProgram = function(pid){
        for (var i=0; i<this.q.length;i++){
            if(this.q[i].pid === parseInt(pid)){
                if(i===0){
                    var elementsBefore = this.q.slice(0,i+1);
                }
                var elementsBefore = this.q.slice(0,i);
                var elementsAfter  = this.q.slice(i+1);
                this.q = elementsBefore.concat(elementsAfter);
            }
        }
    }
}
