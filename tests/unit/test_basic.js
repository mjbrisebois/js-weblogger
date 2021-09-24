const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const { LocalStorage }			= require('node-localstorage');

const expect				= require('chai').expect;
const { Logger }			= require('../../src/index.js');


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

	expect( log._color_setting	).to.equal("false");

	expect( log.error("Good")	).to.be.true;
	expect( log.warn("Bad")		).to.be.false;

	log.setLevel( 2 );

	expect( log.warn("Good")	).to.be.true;
	expect( log.normal("Bad")	).to.be.false;
    });
}

describe("Web Logger", () => {

    describe("Basic", basic_tests );

});
