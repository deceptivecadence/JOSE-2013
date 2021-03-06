/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    //console.log(params);
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 123)) )   // a..z
    {
        // Determine the character we want to display.  
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);        
    }    
    else if ( ((keyCode >= 48) && (keyCode <= 57)) ||   // digits 
               (keyCode == 32)                     ||   // space
               (keyCode == 13)                     ||   // enter
               (keyCode == 8)                      ||   //backspace
               (keyCode == 38)                     ||   //up arrow
               (keyCode == 40)                     ||   //down arrow
               (keyCode == 188 || keyCode == 190))  //punctuation
    {
        if (keyCode == 188){
            keyCode = 44;
        }
        else if (keyCode == 190){
            keyCode = 46;
        }

        if (isShifted){
            switch (keyCode){
                case 48: keyCode = 41; break;
                case 49: keyCode = 33; break;
                case 50: keyCode = 64; break;
                case 51: keyCode = 35; break;
                case 52: keyCode = 36; break;
                case 53: keyCode = 37; break;
                case 54: keyCode = 94; break;
                case 55: keyCode = 38; KEYCODE_HISTORY_CONFLICT = true; break;
                case 56: keyCode = 42; break;
                case 57: keyCode = 40; KEYCODE_HISTORY_CONFLICT = true; break;
            }
        }

        chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr); 
    }
    else{
        _KernelInterruptQueue.enqueue( new Interrupt(INVALID_KEYBOARD_INPUT_IRQ, params) );
    }
}
