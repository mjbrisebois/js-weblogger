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
}

describe("Web Logger", () => {

    describe("Basic", basic_tests );

});
