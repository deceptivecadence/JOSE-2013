/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "JOSE";
var APP_VERSION = "8.UR55";
var REVISION_DATE = "Dec 5th, 2013"
var IMAGE = "url(http://24.media.tumblr.com/tumblr_m4po0153Ly1r3rwuuo1_400.gif)";
var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
var KTRAP_IRQ = 2;
var INVALID_KEYBOARD_INPUT_IRQ = 3;
var MEMORY_OUT_OF_BOUNDS = 4;
var INVALID_OP_CODE = 5;
var SOFTWARE_CONTEXT_SWITCH = 6;
var FILESYSTEM_IRQ = 7;

var KEYCODE_HISTORY_CONFLICT = false;
var MEMORY_LENGTH = 256;
var MAX_DIR_TRACK_LEN = 1;
var MAX_FILE_TRACK_LEN = 3;
var MAX_BLOCK_LEN = 77;
var MBR = "000";
var FILE_FILLER = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
var FILE_DIVIDER = "|"
var CREATE = 0;
var READ = 1;
var WRITE = 2;
var DELETE = 3;
var FORMAT = 4;
var LIST = 5;

//
// Global Variables
//
var _CPU = null;
var _MMU = null;
var _ReadyQueue = null;
var _CpuScheduler = null;
var _OSclock = 0;       // Page 23.

//var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas = null;               // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;
