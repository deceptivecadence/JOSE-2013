

function fillMemory(){
    var size = 768;
    var sections = 8;
    var length = size/sections;
    var counter = 0;
    var label = 0;
    for (var i=0; i<length; i++){
    	//console.log("first loop");
    	label = counter;
        $("tbody").append("<tr class='memLabel' id='"+label.toString(16)+"'><td>$"+label.toString(16)+"</td></tr>");        
        
        for (var j=0; j<sections; j++){
        	$(".memLabel#"+label.toString(16)).append("<td class='memCell' id='"+counter.toString(16)+"'></td>");
        	counter = counter + 1;
        }
    }
}
