import { HttpClient, HttpResponseMessage, RequestMessage, XHR } from 'aurelia-http-client';
import { GetHelloWorldResponse } from '../../../src/greeting/gethelloworldresponse';
import { Greeting } from '../../../src/greeting/greeting';
import * as chai from "chai";
import * as sinon from "sinon";
import * as toastr from "toastr";

describe('greeting modules', () => {
    it('executes helloworld', (done: Function) => {
        let http: any = {};
        let sut: Greeting = new Greeting(http);
        sut.inputText = 'hello'

        http.get = (url: string): Promise<HttpResponseMessage> => {
            var result = {
                name: 'hello'
            };

            return Promise.resolve({
                statusCode: 200,
                isSuccess: true,
                content: result
            });
        }

        sut.executeHelloWorld();

        setTimeout(function () {
            expect(sut.labelText).toBe('hello');
            done();
        }, 1000);

    });
});