
const COLOR_SETTING			= window.localStorage.getItem("LOG_COLOR");
const LOCAL_LEVEL			= window.localStorage.getItem("LOG_LEVEL");
const DEFAULT_LEVEL			= LOCAL_LEVEL || 3;

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
	return console.log(`${datetime} [ ${context} ] ${level}: ${msg}`, ...args );

    console.log(
	`${datetime} [ %c${context}%c ] %c${level}%c: %c${msg}`,
	"color: #75008a",	"color: initial",
	settings.lvl_color,	"color: initial",
	settings.msg_color || settings.lvl_color,
	...args
    );
}

class Logger {
    constructor ( context, level, colors ) {
	this.context			= context;

	this._color_setting		= COLOR_SETTING || colors;

	this.setLevel( level || DEFAULT_LEVEL );
    }

    setLevel ( level ) {
	this._level			= level;

	if ( typeof this._level === "string" ) {
	    if ( isNaN( this._level ) === false )
		this._level		= parseInt( this._level );
	    else if ( LEVEL[ this._level.toLowerCase() ] === undefined )
		throw new Error(`Unknown log level '${this._level}'; options are ${Object.keys(LEVEL).join(", ")}`);
	    else
		this._level		= LEVEL[ this._level.toLowerCase() ][0];
	}

	this.level			= Object.entries( LEVEL )
	    .reduce( (acc, [name, [verbosity, lvl_color, msg_color]]) => {
		acc[name]			= this._level >= verbosity;

		this[name]			= function ( ...args ) {
		    this.level[name] && log({
			"colors": this._color_setting,
			lvl_color,
			msg_color,
		    }, this.context, name, ...args );

		    return this.level[name];
		}

		return acc;
	    }, {} );

	return this._level;
    }
}


module.exports = {
    Logger,
};
