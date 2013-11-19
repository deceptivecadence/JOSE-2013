/* ----------------------------------
   DeviceDriverFileSystem.js
   
   Requires deviceDriver.js
   
   The Kernel FileSystem Device Driver.
   ---------------------------------- */

DeviceDriverFileSystem.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverFileSystem(){                     // Add or override specific attributes and method pointers.{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = function(){
        // Initialization routine for this, the kernel-mode Keyboard Device Driver.
        this.status = "loaded";
        // More?
    };
    this.isr = function(params){
        //expect to receive params as follows[filename,operation,data]
        switch(params[1]){
            case 0: createFile(params); break;
            case 1: readFile(params); break;
            case 2: writeFile(params); break;
            case 3: deleteFile(params); break;
            case 4: format(); break;
        }
    };
}

//expect to receive params as follows[filename,data]
function createFile(params){
    if(checkFormat()){
        console.log(typeof params[0])
        var filename = params[0].substr(0,60);
        console.log("test create")
        var dirSection = sessionStorage.getItem(MBR).substring(4,7);
        var newDirSection = stringFormatAndInc(dirSection);
        
        var currentFileSection = sessionStorage.getItem(MBR).substring(8,11);
        var newFileSection = stringFormatAndInc(currentFileSection);

        sessionStorage.setItem(currentFileSection,"1---"+FILE_DIVIDER+FILE_FILLER);
        sessionStorage.setItem(dirSection,"1"+currentFileSection+FILE_DIVIDER+filename);
        sessionStorage.setItem(MBR,sessionStorage.getItem(MBR).replace(dirSection,newDirSection).replace(currentFileSection,newFileSection));
        
        
        _StdIn.putText("File Created!");
        _StdIn.advanceLine();
        _OsShell.putPrompt();
        /*
        var data = params[1];
        var sections = Math.ceil(data.length/60);
        var dataSections = [];
        dataSections = data.match(/.{1,60}/g) || [];


        while(sections>0){
            if(sections === 1){
                fileSection = sessionStorage.getItem(MBR).substring(8,11);
                newSection = stringFormatAndInc(fileSection);
                sessionStorage.setItem(fileSection,"1---|"+data);
                sessionStorage.setItem(MBR,sessionStorage.getItem(MBR).replace(fileSection,newFileSection));
            }
            else{
                fileSection = sessionStorage.getItem(MBR).substring(8,11);
                newFileSection = stringFormatAndInc(fileSection);
                sessionStorage.setItem(fileSection,"1"+newFileSection+FILE_DIVIDER+data);
                sessionStorage.setItem(MBR,sessionStorage.getItem(MBR).replace(fileSection,newFileSection));
            }
            sections--;
        }*/

        /*for (var i=0; i<MAX_DIR_TRACK_LEN; i++) {
            for (var j=1; j<=MAX_BLOCK_LEN; j++) {
                if(j<=9){
                    if(sessionStorage["00"+j].substring(0,1)==="0"){
                        sessionStorage["00"+j] = 
                    }
                }
                else{
                    if(sessionStorage["0"+j].substring(0,1)==="0"){
                        sessionStorage["0"+j] = 
                    }
                }
            }
        }*/
    }
}

function readFile(params){
    
}

function writeFile(params){
    
}

function deleteFile(params){
    
}

function format(){
    //Set up directory track
    sessionStorage.setItem(MBR,"MBR-001-100~");
    for (var i=0; i<MAX_DIR_TRACK_LEN; i++) {
        for (var j=1; j<=MAX_BLOCK_LEN; j++) {
            if(j<=9){
                sessionStorage.setItem("00"+j,"0---"+FILE_DIVIDER+FILE_FILLER);
            }
            else{
                sessionStorage.setItem("0"+j,"0---"+FILE_DIVIDER+FILE_FILLER);
            }
        }
    }

    //Set up file track
    for (var i=0; i<MAX_FILE_TRACK_LEN; i++) {
        var track = i+1
        for (var j=0; j<=MAX_BLOCK_LEN; j++) {
            if(j<=9){
                sessionStorage.setItem(track+"0"+j,"0---"+FILE_DIVIDER+FILE_FILLER);
            }
            else{
                sessionStorage.setItem(track+""+j,"0---"+FILE_DIVIDER+FILE_FILLER);
            }
        }
    }
}

function checkFormat(){
    if(sessionStorage.getItem(MBR) !== null){
        return true;
    }
    else{
        _StdIn.putText("File System is not formatted, please wait...");
        _StdIn.advanceLine();
        //_OsShell.putPrompt();
        format();
        _OsShell.putPrompt();
        _StdIn.putText("File System has been formatted for convenience");
        _StdIn.advanceLine();
        _OsShell.putPrompt();
        return true;
    }
}

function findFileSpace(){
    for (var i=0; i<MAX_FILE_TRACK_LEN; i++) {
            var track = i+1
            for (var j=1; j<=MAX_BLOCK_LEN && !spaceFound; j++) {
                if(j<=9){
                    if(sessionStorage[i+"0"+j].substring(0,1)==="0"){
                        return [i+"0"+j,sessionStorage[i+""+j]]
                    }
                }
                else{
                    if(sessionStorage[i+""+j].substring(0,1)==="0"){
                        return [i+""+j,sessionStorage[i+""+j]]
                    }
                }
            }
        }
}

function findDirSpace(){

}

function stringFormatAndInc(integer){
    var newInt = parseInt(integer);
    newInt++;
    if(newInt >= 100){
        return ""+newInt
    }
    else if (newInt >= 10){
        return "0"+newInt
    }
    else{
        return "00"+newInt
    }
}