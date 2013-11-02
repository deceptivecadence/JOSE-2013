

function fillMemory(){
    var size = 768;
    var sections = 8;
    var length = size/sections;
    var counter = 0;
    var label = 0;
    for (var i=0; i<length; i++){
    	//console.log("first loop");
    	label = counter;
        $("#tableMemory>tbody").append("<tr class='memLabel' id='"+label.toString(16)+"'><td>$"+label.toString(16)+"</td></tr>");        
        
        for (var j=0; j<sections; j++){
        	$(".memLabel#"+label.toString(16)).append("<td class='memCell' id='"+counter.toString(16)+"'></td>");
        	counter = counter + 1;
        }
    }
}

function updateDisplay(){
	$(".memCell").each(function(index){
		$(this).text(_MMU.memory.memoryArray[index])
	});

	$("#cpuPC").text(_CPU.PC);
	$("#cpuAcc").text(_CPU.Acc);
	$("#cpuxReg").text(_CPU.Xreg);
	$("#cpuyReg").text(_CPU.Yreg);
	$("#cpuzFlag").text(_CPU.Zflag);

    if(programArray.length !== 0){
        for (var i = 0; i<_MMU.programArray.length;i++) {
            var table = $("#tablePcb tbody").children()
            table.each(function(){
                if($(this.firstElementChild).text() == _MMU.programArray[i].pid){
                    $("pidRow").text(_MMU.programArray[i].pid)
                    $("stateRow").text(_MMU.programArray[i].state)
                    $("baseRow").text(_MMU.programArray[i].baseIndex)
                    $("endRow").text(_MMU.programArray[i].endIndex)
                    $("pcRow").text(_MMU.programArray[i].PC)
                }
            })
        }
    }
}
