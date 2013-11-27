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
            case 5: listFiles(); break;
            case 6: findProgramFiles(); break;
        }
    };
    this.test = function(){
        updateMBR();
    }
}

//expect to receive params as follows[filename]
function createFile(params){
    if(checkFormat()){
        var filename = params[0].substr(0,60);
        var fileFound =  false;
        var reachedEnd = false;
        var i = "001";
        while(!reachedEnd){
            if(sessionStorage.getItem(i)[0] === "1"){
                if (filename === sessionStorage.getItem(i).split("|")[1].split("~")[0]){
                    fileFound = true;
                    reachedEnd = true;
                }
                i = stringFormatAndInc(i);
            }
            else{
                reachedEnd = true;
            }
        }
        if(!fileFound){
            var dirSection = sessionStorage.getItem(MBR).substring(4,7);
            //var newDirSection = stringFormatAndInc(dirSection);
            
            var currentFileSection = sessionStorage.getItem(MBR).substring(8,11);
            //var newFileSection = stringFormatAndInc(currentFileSection);

            //regex to replace the amount of characters that filename will take up
            var re = new RegExp("^.{"+filename.length+"}")
            var replacedData = sessionStorage.getItem(dirSection).substring(5).replace(re,filename);
            sessionStorage.setItem(currentFileSection,"1---"+FILE_DIVIDER+FILE_FILLER);
            sessionStorage.setItem(dirSection,"1"+currentFileSection+FILE_DIVIDER+replacedData);
            updateMBR();
            //sessionStorage.setItem(MBR,sessionStorage.getItem(MBR).replace(dirSection,newDirSection).replace(currentFileSection,newFileSection));
            
            
            _StdIn.putText("File Created!");
            _StdIn.advanceLine();
            _OsShell.putPrompt();
        }
        else{
            _StdIn.putText("File Has Already Been Created!");
            _StdIn.advanceLine();
            _OsShell.putPrompt();
        }
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
//expect to receive params as follows[filename,operation]
function readFile(params){
    var searchFor = params[0];
    var fileFound = false;
    var i = "001";
    var dataArr = [];
    while(!fileFound){
        if (searchFor === sessionStorage.getItem(i).split("|")[1].split("~")[0]){
            fileFound = true;
            var dataLocation = sessionStorage.getItem(i).split("|")[0].substr(1);
            var data = sessionStorage.getItem(dataLocation);
            var linkEnds = false;
            while(!linkEnds){
                var link = data.substring(1,4);
                if(isNaN(link)){
                    dataArr.push(data.split("|")[1].split("~")[0]);
                    _StdIn.putText(dataArr.join(""));
                    _StdIn.advanceLine();
                    _OsShell.putPrompt();
                    linkEnds = true;
                }
                else{
                    dataArr.push(data.split("|")[1].split("~")[0]);
                    data = sessionStorage.getItem(link);
                }
            }
        }
        i = stringFormatAndInc(i);
        if (i === "078"){
            fileFound = true
            _StdIn.putText("File not found");
            _StdIn.advanceLine();
            _OsShell.putPrompt();
        }
    }
    return dataArr;
}

//expect to receive params as follows[filename,operation,data]
//TODO: FIX LINK EXISTS
function writeFile(params){
    var filename = params[0];
    var data = params[2];
    var fileFound = false;
    var sections = Math.ceil(data.length/60);
    var dataSections = data.match(/.{1,60}/g) || [];

    var i = "001";
    while(!fileFound){
        if (filename === sessionStorage.getItem(i).split(FILE_DIVIDER)[1].split(FILE_FILLER.substr(0,1))[0]){
            fileFound = true;
            var dataLocation = sessionStorage.getItem(i).split(FILE_DIVIDER)[0].substr(1);
            var linkEnds = false;
            while(sections>0){
                var data = dataSections.shift()
                var re = new RegExp("^.{"+data.length+"}")
                sessionStorage.setItem(dataLocation,"1---"+FILE_DIVIDER+FILE_FILLER);
                var replacedData = sessionStorage.getItem(dataLocation).substring(5).replace(re,data);
                if(sections === 1){
                    sessionStorage.setItem(dataLocation,"1---"+FILE_DIVIDER+replacedData);
                }
                else{
                    var linkExists = sessionStorage.getItem(dataLocation).substring(1,4);
                    console.log(linkExists)
                    if(isNaN(linkExists)){
                        nextDataSection = sessionStorage.getItem(MBR).substring(8,11);
                    }
                    else{
                        nextDataSection = linkExists
                    }
                    newDataSection = stringFormatAndInc(nextDataSection);
                    sessionStorage.setItem(dataLocation,"1"+nextDataSection+FILE_DIVIDER+replacedData);
                    sessionStorage.setItem(MBR,sessionStorage.getItem(MBR).replace(nextDataSection,newDataSection));
                    dataLocation = nextDataSection;
                }
                sections--;
            }
            _StdIn.putText("Write succeeded");
            _StdIn.advanceLine();
            _OsShell.putPrompt();
        }
        i = stringFormatAndInc(i);
        if (i === "078"){
            _StdIn.putText("File not found");
            _StdIn.advanceLine();
            _OsShell.putPrompt();
            break;
        }
    }
}


//expect to receive params as follows[filename,operation,data]
function deleteFile(params){
    var filename = params[0];
    var fileFound = false;
    var i = "001";
    while(!fileFound){
        if (filename === sessionStorage.getItem(i).split(FILE_DIVIDER)[1].split(FILE_FILLER.substr(0,1))[0]){
            fileFound = true;
            var dataLocation = sessionStorage.getItem(i).split(FILE_DIVIDER)[0].substring(1,4);

            sessionStorage.setItem(i,"0---"+FILE_DIVIDER+FILE_FILLER);
            sessionStorage.setItem(MBR,sessionStorage.getItem(MBR).replace(sessionStorage.getItem(MBR).substring(4,7),i));

            sessionStorage.setItem(dataLocation,"0---"+FILE_DIVIDER+FILE_FILLER);
            sessionStorage.setItem(MBR,sessionStorage.getItem(MBR).replace(sessionStorage.getItem(MBR).substring(8,11),dataLocation));
            _StdIn.putText("File deleted!");
            _StdIn.advanceLine();
            _OsShell.putPrompt();
        }
        i = stringFormatAndInc(i);
        if (i === "078"){
            fileFound = true
            _StdIn.putText("File not found");
            _StdIn.advanceLine();
            _OsShell.putPrompt();
        }
    }
    updateMBR();
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

function findFreeSpace(){
    var spaceFound = false;
    var dirSpace = "";
    var fileSpace = "";
    for (var i=1; i<=MAX_FILE_TRACK_LEN && !spaceFound; i++) {
        for (var j=0; j<=MAX_BLOCK_LEN && !spaceFound; j++) {
            if(j<=9){
                if(sessionStorage[i+"0"+j].substring(0,1)==="0"){
                    fileSpace = i+"0"+j;
                    spaceFound = true;
                }
            }
            else{
                if(sessionStorage[i+""+j].substring(0,1)==="0"){
                    fileSpace = i+""+j;
                    spaceFound = true;
                }
            }
        }
    }
    spaceFound = false;
    for (var i=0; i<MAX_DIR_TRACK_LEN && !spaceFound; i++) {
        for (var j=1; j<=MAX_BLOCK_LEN && !spaceFound; j++) {
            if(j<=9){
                if(sessionStorage[i+"0"+j].substring(0,1)==="0"){
                    dirSpace = i+"0"+j;
                    spaceFound = true;
                }
            }
            else{
                if(sessionStorage[i+""+j].substring(0,1)==="0"){
                    dirSpace = i+""+j;
                    spaceFound = true;
                }
            }
        }
    }

    return [dirSpace,fileSpace];
}

function listFiles(){
    var i = "001";
    var fileArray = [];
    while (sessionStorage.getItem(i).split("|")[1].split("~")[0] !== ""){
        fileArray.push(sessionStorage.getItem(i).split("|")[1].split("~")[0]);
        i = stringFormatAndInc(i);
    }
    _StdIn.putText("Files: "+fileArray.join(", "));
    _StdIn.advanceLine();
    _OsShell.putPrompt();
}


function findProgramFiles(){
    var i = "001";
    var fileArray = [];
    while (i !== "078"){
        if(typeof sessionStorage.getItem(i).split("|")[1].split("~")[0].split("program")[1] !== "undefined"){
            fileArray.push(sessionStorage.getItem(i).split("|")[1].split("~")[0].split("program")[1]);
        }
        i = stringFormatAndInc(i);
    }
    _MMU.pidOnFile = fileArray;
}


function updateMBR(){
    var oldMBR = [sessionStorage.getItem(MBR).substring(4,7),sessionStorage.getItem(MBR).substring(8,11)]
    var newMBR = findFreeSpace();
    sessionStorage.setItem(MBR, sessionStorage.getItem(MBR).replace(oldMBR[0],newMBR[0]).replace(oldMBR[1],newMBR[1]));
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