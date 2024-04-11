import { LocalStorage }			from 'node-localstorage';

import { expect }			from 'chai';
import { Logger, setConsole }		from '../../lib/index.js';

if ( !process.env.LOG_LEVEL )
    setConsole({
	log () {},
    });


function basic_tests () {
    it("should create logger", async () => {
	const log			= new Logger("test_basic.js", "trace" );

	expect( log.fatal("Testing")	).to.be.true;
	expect( log.error("Testing")	).to.be.true;
	expect( log.warn("Testing")	).to.be.true;
	expect( log.normal("Testing")	).to.be.true;
	expect( log.info("Testing")	).to.be.true;
	expect( log.debug("Testing")	).to.be.true;
	expect( log.trace("Testing")	).to.be.true;
    });

    it("should update level", async () => {
	const log			= new Logger("test_basic.js");

	expect( log.normal("Good")	).to.be.true;
	expect( log.info("Bad")		).to.be.false;

	log.setLevel( 4 );

	expect( log.info("Good")	).to.be.true;
	expect( log.debug("Bad")	).to.be.false;
    });

    it("should use local storage settings", async () => {
	global.window				= {
	    "localStorage": new LocalStorage("./scratch"),
	};

	window.localStorage.setItem("LOG_COLOR", "false");
	window.localStorage.setItem("LOG_LEVEL", "error");

	const log			= new Logger("test_basic.js");

	expect( log.color_setting	).to.equal("false");

	expect( log.error("Good")	).to.be.true;
	expect( log.warn("Bad")		).to.be.false;

	log.setLevel( 2 );

	expect( log.warn("Good")	).to.be.true;
	expect( log.normal("Bad")	).to.be.false;
    });

    it("should use specific local storage settings", async () => {
	window.localStorage.setItem("LOG_LEVEL",		"trace");
	window.localStorage.setItem("LOG_LEVEL.submodule",	"error");

	const log1			= new Logger("module");
	const log2			= new Logger("submodule");

	expect( log1.trace("allow")	).to.be.true;
	expect( log2.trace("deny")	).to.be.false;
    });

    it("should get level rank", async () => {
	{
	    const log			= new Logger("foo", "fatal" );
	    expect( log.level_rank	).to.equal( 0 );
	}
	{
	    const log			= new Logger("foo", "trace");
	    expect( log.level_rank	).to.equal( 6 );
	}
    });

    it("should get level", async () => {
	{
	    const log			= new Logger("foo", "fatal" );
	    expect( log.level_name	).to.equal( "fatal" );
	}
	{
	    const log			= new Logger("foo", "trace");
	    expect( log.level_name	).to.equal( "trace" );
	}
    });
}

describe("Web Logger", () => {

    describe("Basic", basic_tests );

});
