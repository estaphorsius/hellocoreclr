/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />
/// <reference path="../../../../typings/sinon/sinon.d.ts" />
/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/angularjs/angular-mocks.d.ts" />
"use strict";

describe("HelloWorldController Test ", () => {
    let http;
    let httpBackend;
    let log;

    beforeEach(() => {
        inject( function($http, $httpBackend: ng.IHttpBackendService, $log: ng.ILogService){
            let res = new greeting.GetHelloWorldResponse();
            res.Name = "Hello World!";
            $httpBackend.whenGET("/api/helloworld/Hello").respond(200, res);
            $httpBackend.whenGET("/api/helloworld/Error").respond(500);

            http = $http;
            httpBackend = $httpBackend;
            log = $log;
        });
    });

    it("does nothing when there is no input", () => {
        let logSpy = sinon.spy(log, "warn");
        let sut = new greeting.HelloWorldController(http, log);

        sut.executeHelloWorld();

        chai.expect(sut.labelText).to.equals("");
        chai.expect(logSpy.calledOnce).to.equals(true);
    });

    it("can handle a valid response", () => {
        let logSpy = sinon.spy(log, "info");
        let sut = new greeting.HelloWorldController(http, log);
        sut.inputText = "Hello";

        sut.executeHelloWorld();

        httpBackend.flush();
        chai.expect(sut.labelText, "Hello World!").to.equals("Hello World!");
        chai.expect(logSpy.called).to.equals(true);
    });

    it("can handle an error response", () => {
        let logSpy = sinon.spy(log, "warn");
        let sut = new greeting.HelloWorldController(http, log);
        sut.inputText = "Error";

        sut.executeHelloWorld();

        httpBackend.flush();
        chai.expect(sut.labelText).to.equals("");
        chai.expect(logSpy.calledOnce).to.equals(true);
    });
});
