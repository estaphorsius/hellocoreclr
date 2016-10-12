import {Redirect, NavigationInstruction, Router, RouterConfiguration} from 'aurelia-router';

export class App {
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Hello Core Clr!';
        config.map([
            { route: '', moduleId: 'greeting/greeting', name: 'home', settings: { roles: [] } }
        ]);

        this.router = router;
    }
}
