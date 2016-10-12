define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Hello Core Clr!';
            config.map([
                { route: '', moduleId: 'greeting/greeting', name: 'home', settings: { roles: [] } }
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('greeting/gethelloworldresponse',["require", "exports"], function (require, exports) {
    "use strict";
    var GetHelloWorldResponse = (function () {
        function GetHelloWorldResponse() {
        }
        return GetHelloWorldResponse;
    }());
    exports.GetHelloWorldResponse = GetHelloWorldResponse;
});

define('greeting/greeting',["require", "exports", 'aurelia-http-client', 'aurelia-framework'], function (require, exports, aurelia_http_client_1, aurelia_framework_1) {
    "use strict";
    var Greeting = (function () {
        function Greeting(http, logManager) {
            this.http = http;
            this.logManager = logManager;
            this.log = this.logManager.getLogger("greeting");
        }
        Greeting.inject = function () { return [aurelia_http_client_1.HttpClient, aurelia_framework_1.LogManager]; };
        Greeting.prototype.attached = function () {
        };
        Greeting.prototype.executeHelloWorld = function () {
            var _this = this;
            var name = this.inputText;
            if (name === undefined || name.length === 0) {
                this.log.warn("No name received. abort.. ");
                this.labelText = "";
                return;
            }
            this.log.info("We got the following name: " + name);
            this.http.get('api/helloworld/' + name)
                .then(function (response) {
                _this.log.info("Received http code " + response.statusCode);
                if (response.isSuccess) {
                    _this.log.info("Received data was: " + response.content.name);
                    _this.labelText = response.content.name;
                }
                else {
                    _this.log.warn("Oops... something went wrong.");
                    _this.labelText = "";
                }
            });
        };
        return Greeting;
    }());
    exports.Greeting = Greeting;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"bootstrap/css/bootstrap.css\"></require>\n    <div class=\"modal-header\">\n        <h1 class=\"modal-title\">Hello World</h1>\n    </div>\n    <p />  \n  <router-view></router-view>\n</template>\n"; });
define('text!css/styles.css', ['module'], function(module) { module.exports = "#toast-container > .toast {\n  background-image: none !important;\n}\n\n#toast-container > .toast::before {\n  position: relative;\n  font-family: FontAwesome;\n  font-size: 24px;\n  line-height: 18px;\n  float: left;\n  margin-left: -1em;\n  color: #fff;\n  padding-right: 0.5em;\n  margin-right: 0.5em;\n}\n\n/* See http://fontawesome.io/cheatsheet/ for icon codes */\n\n#toast-container > .toast-warning::before {\n  content: \"\\f071\";\n}\n\n#toast-container > .toast-error::before {\n  content: \"\\f001\";\n}\n\n#toast-container > .toast-info::before {\n  content: \"\\f05a\";\n}\n\n#toast-container > .toast-success::before {\n  content: \"\\f087\";\n}\n"; });
define('text!index.html', ['module'], function(module) { module.exports = "<!DOCTYPE html>\n<html lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" >\n<head>\n    <meta charset=\"utf-8\" />\n    <title>Hello World</title>\n    \n    <!-- build:cssbundle -->\n    <!-- endbuild -->\n    <!-- build:appbundle -->\n    <script src=\"jspm_packages/system.js\"></script>\n    <script src=\"jspm.conf.js\"></script>\n    <script>\n        System.import('bootstrap/css/bootstrap.css!')\n        System.import('bootstrap/css/bootstrap-theme.css!')\n        System.import('font-awesome/css/font-awesome.css!')\n        System.import('./css/toastr.css!')\n        System.import('./css/styles.css!')\n        System.import('./app')\n            .catch(console.error.bind(console)); // make sure any errors are print to console\n    </script>\n    <!-- endbuild -->\n</head>\n<body>\n    <div class=\"modal-header\">\n        <h1 class=\"modal-title\">Hello World</h1>\n    </div>\n    <p />\n\n    <div class=\"container-fluid\">\n        <div>\n            <div ui-view></div>\n        </div>\n    </div>\n</body>\n</html>\n"; });
define('text!css/toastr.css', ['module'], function(module) { module.exports = ".toast-title {\n  font-weight: bold;\n}\n\n.toast-message {\n  -ms-word-wrap: break-word;\n  word-wrap: break-word;\n}\n\n.toast-message a,\n.toast-message label {\n  color: #fff;\n}\n\n.toast-message a:hover {\n  color: #ccc;\n  text-decoration: none;\n}\n\n.toast-close-button {\n  position: relative;\n  right: -0.3em;\n  top: -0.3em;\n  float: right;\n  font-size: 20px;\n  font-weight: bold;\n  color: #fff;\n  -webkit-text-shadow: 0 1px 0 #fff;\n  text-shadow: 0 1px 0 #fff;\n  opacity: 0.8;\n  -ms-filter: progid:dximagetransform.microsoft.alpha(Opacity=80);\n  filter: alpha(opacity=80);\n}\n\n.toast-close-button:hover,\n.toast-close-button:focus {\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n  opacity: 0.4;\n  -ms-filter: progid:dximagetransform.microsoft.alpha(Opacity=40);\n  filter: alpha(opacity=40);\n}\n\n/* Additional properties for button version\n iOS requires the button element instead of an anchor tag.\n If you want the anchor version, it requires `href=\"#\"`. */\nbutton.toast-close-button {\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  -webkit-appearance: none;\n}\n\n.toast-top-center {\n  top: 0;\n  right: 0;\n  width: 100%;\n}\n\n.toast-bottom-center {\n  bottom: 0;\n  right: 0;\n  width: 100%;\n}\n\n.toast-top-full-width {\n  top: 0;\n  right: 0;\n  width: 100%;\n}\n\n.toast-bottom-full-width {\n  bottom: 0;\n  right: 0;\n  width: 100%;\n}\n\n.toast-top-left {\n  top: 12px;\n  left: 12px;\n}\n\n.toast-top-right {\n  top: 12px;\n  right: 12px;\n}\n\n.toast-bottom-right {\n  right: 12px;\n  bottom: 12px;\n}\n\n.toast-bottom-left {\n  bottom: 12px;\n  left: 12px;\n}\n\n#toast-container {\n  position: fixed;\n  z-index: 999999;\n  pointer-events: none;\n\n  /* overrides */\n}\n\n#toast-container * {\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n#toast-container > div {\n  position: relative;\n  pointer-events: auto;\n  overflow: hidden;\n  margin: 0 0 6px;\n  padding: 15px 15px 15px 50px;\n  width: 300px;\n  -moz-border-radius: 3px;\n  -webkit-border-radius: 3px;\n  border-radius: 3px;\n  background-position: 15px center;\n  background-repeat: no-repeat;\n  -moz-box-shadow: 0 0 12px #999;\n  -webkit-box-shadow: 0 0 12px #999;\n  box-shadow: 0 0 12px #999;\n  color: #fff;\n  opacity: 0.8;\n  -ms-filter: progid:dximagetransform.microsoft.alpha(Opacity=80);\n  filter: alpha(opacity=80);\n}\n\n#toast-container > :hover {\n  -moz-box-shadow: 0 0 12px #000;\n  -webkit-box-shadow: 0 0 12px #000;\n  box-shadow: 0 0 12px #000;\n  opacity: 1;\n  -ms-filter: progid:dximagetransform.microsoft.alpha(Opacity=100);\n  filter: alpha(opacity=100);\n  cursor: pointer;\n}\n\n#toast-container.toast-top-center > div,\n#toast-container.toast-bottom-center > div {\n  width: 300px;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n#toast-container.toast-top-full-width > div,\n#toast-container.toast-bottom-full-width > div {\n  width: 96%;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.toast {\n  background-color: #030303;\n}\n\n.toast-success {\n  background-color: #51a351;\n}\n\n.toast-error {\n  background-color: #bd362f;\n}\n\n.toast-info {\n  background-color: #2f96b4;\n}\n\n.toast-warning {\n  background-color: #f89406;\n}\n\n.toast-progress {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  height: 4px;\n  background-color: #000;\n  opacity: 0.4;\n  -ms-filter: progid:dximagetransform.microsoft.alpha(Opacity=40);\n  filter: alpha(opacity=40);\n}\n\n/* Responsive Design */\n@media all and (max-width: 240px) {\n  #toast-container > div {\n    padding: 8px 8px 8px 50px;\n    width: 11em;\n  }\n\n  #toast-container .toast-close-button {\n    right: -0.2em;\n    top: -0.2em;\n  }\n}\n\n@media all and (min-width: 241px) and (max-width: 480px) {\n  #toast-container > div {\n    padding: 8px 8px 8px 50px;\n    width: 18em;\n  }\n\n  #toast-container .toast-close-button {\n    right: -0.2em;\n    top: -0.2em;\n  }\n}\n\n@media all and (min-width: 481px) and (max-width: 768px) {\n  #toast-container > div {\n    padding: 15px 15px 15px 50px;\n    width: 25em;\n  }\n}\n"; });
define('text!greeting/greeting.html', ['module'], function(module) { module.exports = "<template>\n<form class=\"form-horizontal\" ng-submit=\"vm.executeHelloWorld();\">\n\n    <div class=\"row\">\n        <div class=\"col-xs-3\">\n            <img src=\"/images/goodnewseveryone.png\" alt=\"Good News!\" class=\"img-responsive img-rounded center-block\" width=\"200\" height=\"150\"/>\n        </div>    \n        <div class=\"col-xs-9\">\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eleifend consequat magna nec feugiat. Integer lacinia nisl nulla, sit amet ornare urna euismod eu. Vestibulum imperdiet justo ut nisi mattis porta. Duis a mattis leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris massa metus, fringilla sed massa eget, condimentum iaculis lectus. Ut vel dictum turpis.\n\nCurabitur sed scelerisque mauris, nec euismod massa. Aenean egestas, tellus at eleifend tincidunt, nibh nunc imperdiet ante, vel facilisis mi lacus a nunc. Mauris scelerisque ultricies aliquam. Cras porttitor augue ac mollis pretium. In sed nulla tellus. Nulla aliquet, sapien placerat molestie lacinia, arcu velit auctor augue, at condimentum ante libero at turpis. Integer enim eros, ultricies eu vestibulum nec, vestibulum sit amet massa. Proin non ligula lorem. Curabitur malesuada vel libero eu pulvinar. Morbi et efficitur dolor, nec scelerisque justo. \n        </div>\n    </div>\n    <hr />\n    <div class=\"form-group\">\n        <div class=\"col-xs-4\">\n            <input type=\"text\" class=\"form-control input-lg\" placeholder=\"Give me some text\" value.bind=\"inputText\" required />\n        </div>\n\n        <button type=\"submit\" class=\"col-xs-4 btn btn-primary btn-lg\" click.delegate=\"executeHelloWorld()\">\n            <i class=\"fa fa-play-circle-o fa-lg\"></i> Say Hello!\n        </button>\n\n        <div class=\"col-xs-4\">\n            <input class=\"form-control input-lg\" type=\"text\" placeholder=\"Something will happen over here\" value.bind=\"labelText\" disabled>\n        </div>\n    </div>\n</form>    \n</template>"; });
//# sourceMappingURL=app-bundle.js.map