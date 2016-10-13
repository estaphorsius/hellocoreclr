import {RouterConfiguration, Router} from 'aurelia-router';
import {App} from '../../src/app';

describe('the app', () => {
  it('configures routing', () => {
    var sut : App = new App();
    var config : RouterConfiguration = new RouterConfiguration();
    var router : Router = new Router(null, null)
    sut.configureRouter(config, router);
    expect(config.title).toBe('Hello Core Clr!');
    router.configure(config).then((result:any)=>{
      expect(router.routes[0].name).toBe('home');
      expect(router.routes[0].moduleId).toBe('greeting/greeting');
    });
  });
});
