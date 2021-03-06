var counter = 0
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
		$(this).text(_MMU.memory.memoryArray[index]);
	});

	$("#cpuPC").text(_CPU.PC);
	$("#cpuAcc").text(_CPU.Acc);
	$("#cpuxReg").text(_CPU.Xreg);
	$("#cpuyReg").text(_CPU.Yreg);
	$("#cpuzFlag").text(_CPU.Zflag);

    for (var i = 0; i<_MMU.programArray.length;i++) {
        var table = $("#tablePcb tbody").children();
        table.each(function(){
            if($(this).find("#pidRow").text() == _MMU.programArray[i].pid){
                $(this).find("#pidRow").text(_MMU.programArray[i].pid);
                $(this).find("#stateRow").text(_MMU.programArray[i].state);
                $(this).find("#baseRow").text(_MMU.programArray[i].baseIndex);
                $(this).find("#endRow").text(_MMU.programArray[i].endIndex);
                $(this).find("#pcRow").text(_MMU.programArray[i].PC);
            }
        });
    }

    //fill dialog div with sessionStorage
    //of table
    /*
    ____________________
    |---||----|--------|
    |---||----|--------|
    |---||----|--------|
    |---||----|--------|

    */
    if(counter % 5 === 0){
        //var table = $("#fileSystem tbody");
        $("#"+MBR+".FS").find("#main").text(MBR);
        $("#"+MBR+".FS").find("#address").text(sessionStorage.getItem(MBR).substring(0,3));
        $("#"+MBR+".FS").find("#data").text(sessionStorage.getItem(MBR).substring(4));
        var i="001"
        while(i !== "400"){
            $("#"+i+".FS").find("#main").text(i);
            $("#"+i+".FS").find("#address").text(sessionStorage.getItem(i).substring(0,4));
            $("#"+i+".FS").find("#data").text(sessionStorage.getItem(i).substring(5));
            i = stringFormatAndInc(i)
        }
        counter = 0
    }
    counter++
    //console.log(counter)
    
}
