/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer           = "";
    this.bufferHistory    = new Array();
    this.bufferIndex      = 0;
    
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
    };

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize;
    };

    this.handleInput = function() {
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if (chr == String.fromCharCode(13))  //     Enter key
           {
               // The enter key marks the end of a console command, so ...
               // ... tell the shell ...
               _OsShell.handleInput(this.buffer);
               // ... and reset our buffer.
               this.bufferHistory.push(this.buffer);
               this.bufferIndex = this.bufferHistory.length - 1;
               this.buffer = "";
           }
           // TODO: Write a case for Ctrl-C.
           //backspace handler
           else if (chr === String.fromCharCode(8)){
                this.CurrentXPosition = 0;
                prevChar = this.buffer.substring(this.buffer.length-1,this.buffer.length);
                this.clearLine(prevChar);
                this.buffer = this.buffer.substring(0,this.buffer.length-1);
                _OsShell.putPrompt();
                this.putText(this.buffer.substring(this.buffer));
                //this.putText(this.buffer);
           }
           else if (chr === String.fromCharCode(38) && !KEYCODE_HISTORY_CONFLICT){
                if (this.bufferIndex != 0){
                    this.CurrentXPosition = 0;
                    this.clearLine("");
                    _OsShell.putPrompt();
                    var prevCommand = this.bufferHistory[this.bufferIndex];
                    this.bufferIndex = this.bufferIndex - 1;
                    this.buffer = prevCommand;
                    this.putText(prevCommand);
                }
           }
           else if (chr === String.fromCharCode(40) && !KEYCODE_HISTORY_CONFLICT){
                if (this.bufferIndex != (this.bufferHistory.length - 1)){
                    this.CurrentXPosition = 0;
                    this.clearLine("");
                    _OsShell.putPrompt();
                    this.bufferIndex = this.bufferIndex + 1;
                    var nextCommand = this.bufferHistory[this.bufferIndex];
                    this.buffer = nextCommand;
                    this.putText(nextCommand);
                }
           }
           else{
               // This is a "normal" character, so ...
               // ... draw it on the screen...
               //console.log(chr);
               this.putText(chr);
               // ... and add it to our buffer.
               this.buffer += chr;
           }
       }
    };

    this.clearLine = function(text){
        var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
        _DrawingContext.clearRect(0, this.CurrentYPosition - (_DefaultFontSize + _FontHeightMargin)+1, _Canvas.width, _DefaultFontSize + _FontHeightMargin+5);
    }
    this.putText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.
       if (text !== "")
       {
           // Draw the text at the current X and Y coordinates.
           _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
         // Move the current X position.
           var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
           this.CurrentXPosition = this.CurrentXPosition + offset;
       }
    };

    this.advanceLine = function() {
       this.CurrentXPosition = 0;
       var oldY = this.CurrentYPosition;
       // console.log(this.CurrentYPosition);
       if (this.CurrentYPosition >= 489){
        //console.log("yespritn")
            var data = _DrawingContext.getImageData(0,0,_Canvas.width,_Canvas.height);
            this.clearScreen();
            this.resetXY();
            var distance = (_DefaultFontSize + _FontHeightMargin) * -1;//worst case-most lines currently a command (help) needs
            _DrawingContext.putImageData(data,0,distance)
            this.CurrentYPosition = oldY //distance is negative
       }else{
            this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
       }
       
       
       
    };
}
