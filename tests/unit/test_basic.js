const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const { LocalStorage }			= require('node-localstorage');
global.window				= {
    "localStorage": new LocalStorage("./scratch"),
};

const expect				= require('chai').expect;
const { Logger }			= require('../../src/index.js');


function basic_tests () {
    it("should create logger", async () => {
	const log			= new Logger("test_basic.js", "trace" );

	log.fatal("Testing");
	log.error("Testing");
	log.warn("Testing");
	log.normal("Testing");
	log.info("Testing");
	log.debug("Testing");
	log.trace("Testing");

	expect( log.info		).to.be.a("function");
    });
}

describe("Web Logger", () => {

    describe("Basic", basic_tests );

});
