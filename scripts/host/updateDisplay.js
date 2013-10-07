

function fillMemory(args) {
    var size = _MMU.memory.memoryArray.length;
    var sections = 8;
    var length = size/sections;
    var counter = 0
    for (var i=0; i<length; i++){
        $("table").append("<tr> <td class='memLabel' id='"+counter.toString(16)+"''> </tr>")
        
        for (var j=0; j<sections; j++){
        	var counter += j;
        	var stringVal = counter.toString(16);
        	$("#"+length.toString(16)).append("<td class='memCell' id='"+stringVal+"'></td>")
        }
    }
}
