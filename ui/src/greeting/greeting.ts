import { HttpClient, HttpResponseMessage } from 'aurelia-http-client';
import { LogManager } from 'aurelia-framework';
import { Logger } from 'aurelia-logging';
import { GetHelloWorldResponse } from './gethelloworldresponse';

export class Greeting {
    static inject() { return [HttpClient, LogManager]; }
    private log: Logger;
    public labelText: string;
    public inputText: string;

    constructor(private http: HttpClient, private logManager: LogManager) { 
        this.log  = this.logManager.getLogger("greeting");
    }

    attached() {

    }

    public executeHelloWorld(): void {
        let name = this.inputText;
        if (name === undefined || name.length === 0) {
            this.log.warn("No name received. abort.. ");
            this.labelText = "";
            return;
        }

        this.log.info("We got the following name: " + name);
        //toastr.info("Working...");

        this.http.get('api/helloworld/' + name)
            .then((response: HttpResponseMessage) => {
                this.log.info("Received http code " + response.statusCode);
                if (response.isSuccess) {
                    this.log.info("Received data was: " + response.content.name);

                    //toastr.clear();
                    //toastr.success("HTTP/" + status);
                    this.labelText = response.content.name;
                }
                else {
                    this.log.warn("Oops... something went wrong.");

                    //toastr.clear();
                    //toastr.warning("Oops... HTTP/" + status);
                    this.labelText = "";
                }
            });
    }
}