
const CTX_LENGTH			= 10;
const LVL_LENGTH			= 5;

const LEVEL				= {
    "fatal":	[ 0, "color: #FF5555; font-weight: 800" ],
    "error":	[ 1, "color: #E20D03" ],
    "warn":	[ 2, "color: #ebab34; font-weight: 600" ],
    "normal":	[ 3, "font-weight: 800" ],
    "info":	[ 4, "color: #007e8a", "color: initial" ],
    "debug":	[ 5, "color: #008024", "color: #777" ],
    "trace":	[ 6, "color: #aaa" ],
};
const RANK_TO_LEVEL_NAME		= Object.fromEntries(
    Object.entries(LEVEL).map( ([ level, [ rank ] ]) => [rank, level])
);

const TERMINAL_COLOR_RESET		= "\x1b[0m";
const LEVEL_TERMINAL			= {
    "fatal":	"\x1b[91;1m",
    "error":	"\x1b[31m",
    "warn":	"\x1b[33;1m",
    "normal":	"\x1b[35;1m",
    "info":	"\x1b[36;1m",
    "debug":	"\x1b[1m",
    "trace":	"\x1b[2;1m",

    "fatal_message":	"\x1b[91;1m",
    "error_message":	"\x1b[31m",
    "warn_message":	"\x1b[22;33m",
    "normal_message":	"\x1b[37m",
    "info_message":	TERMINAL_COLOR_RESET,
    "debug_message":	TERMINAL_COLOR_RESET,
    "trace_message":	"\x1b[0;2m",
};

let $console				= console;

function log ( settings, ctx, lvl, msg, ...args ) {
    if ( typeof args[0] === "function" ) {
	args				= args[0]();

	if ( !Array.isArray(args) )
	    throw new TypeError(`Calculated "args" function must return an array; not type '${typeof args}'`);
    }

    let datetime			= (new Date()).toISOString();
    let context				= ctx.length > CTX_LENGTH
	? "\u2026" + ctx.slice( -( CTX_LENGTH - 1 ) )
	: ctx.padEnd( CTX_LENGTH );
    let level				= lvl
	.slice( 0, LVL_LENGTH )
	.padStart( LVL_LENGTH )
	.toUpperCase();

    if ( settings.colors && ( settings.colors === "false" || settings.colors === "0" ) )
	return $console.log(`${datetime} [ ${context} ] ${level}: ${msg}`, ...args );

    if ( typeof window !== "undefined" ) {
	$console.log(
	    `${datetime} [ %c${context}%c ] %c${level}%c: %c${msg}`,
	    "color: #75008a",	"color: initial",
	    settings.lvl_color,	"color: initial",
	    settings.msg_color || settings.lvl_color,
	    ...args
	);
    }
    else {
	// TODO: fix inconsistent color settings; the browser color settings are passed in but the
	// terminal is hard-coded.
	$console.log(
	    `${datetime} [ \x1b[35m${context}\x1b[0m ] %s${level}\x1b[0m: %s${msg}\x1b[0m`,
	    LEVEL_TERMINAL[ lvl ],
	    LEVEL_TERMINAL[ lvl + '_message' ] || TERMINAL_COLOR_RESET,
	    ...args
	);
    }
}

function getLocalSetting ( ctx ) {
    const override			= window.localStorage.getItem(`LOG_LEVEL.${ctx}`);
    const default_value			= window.localStorage.getItem("LOG_LEVEL");

    return override || default_value || null;
}

type LogFunction = ( msg: string, ...args: Array<any> ) => boolean;

export class Logger {
    #level		: number;
    #color_setting	: any;

    context		: string;
    levels		: Record<string, number>;

    fatal		: LogFunction;
    error		: LogFunction;
    warn		: LogFunction;
    normal		: LogFunction;
    info		: LogFunction;
    debug		: LogFunction;
    trace		: LogFunction;

    constructor ( context, level, colors? ) {
	const IS_BROWSER		= typeof window !== "undefined";
	const COLOR_SETTING		= IS_BROWSER ? window.localStorage.getItem("LOG_COLOR") : null;
	const LOCAL_LEVEL		= IS_BROWSER ? getLocalSetting( context ) : null;
	const DEFAULT_LEVEL		= LOCAL_LEVEL || 3;

	this.context			= context;

	this.#color_setting		= COLOR_SETTING || colors;

	this.setLevel( level || DEFAULT_LEVEL );
    }

    get level_rank () {
	return this.#level;
    }

    // Legacy support
    get level () {
	return this.#level;
    }

    get level_name () {
	return RANK_TO_LEVEL_NAME[ this.#level ];
    }

    get color_setting () {
	return this.#color_setting;
    }

    setLevel ( level ) {
	if ( typeof level === "string" ) {
	    if ( isNaN( parseInt(level) ) === false )
		this.#level		= parseInt( level );
	    else if ( LEVEL[ level.toLowerCase() ] === undefined )
		throw new Error(`Unknown log level '${this.#level}'; options are ${Object.keys(LEVEL).join(", ")}`);
	    else
		this.#level		= LEVEL[ level.toLowerCase() ][0];
	}
	else
	    this.#level			= level;

	this.levels			= Object.entries( LEVEL )
	    .reduce( (acc, [name, [verbosity, lvl_color, msg_color]]) => {
		acc[name]			= this.#level >= (verbosity as number);

		this[name]			= function ( msg, ...args ) {
		    this.levels[name] && log({
			"colors": this.#color_setting,
			lvl_color,
			msg_color,
		    }, this.context, name, msg, ...args );

		    return this.levels[name];
		}

		return acc;
	    }, {} );
	Object.freeze( this.levels );

	return this.#level;
    }
}


export function setConsole ( console ) {
    $console				= console;
}


export default {
    Logger,
    setConsole,
};
