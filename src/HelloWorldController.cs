﻿using Microsoft.AspNetCore.Mvc;
using NLog;

namespace HelloWorldApp
{
    [Controller]
    [Route("api")]
    public class HelloWorldController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        IActionFactory actionFactory;
        IHelloWorldDbContextFactory dbContextFactory;
        
        public HelloWorldController(IActionFactory actionFactory, IHelloWorldDbContextFactory dbContextFactory)
        {
            this.actionFactory = actionFactory;
            this.dbContextFactory = dbContextFactory;
        }
        
        [Route("helloworld/{name}")]
        [HttpGet]
        public IActionResult GetHelloWorld(string name)
        {
            logger.Info("'HelloWorld' Request received with '{0}'.", name);
            
            var action = actionFactory.CreateGetHelloWorldAction();
            var response = action.Execute(name);

            using(var db = dbContextFactory.CreateHelloWorldDbContext())
            {
                db.Greetings.Add(new Greeting{  Name = response.Name });
                db.Save();
            }                

            return new OkObjectResult(response);
        }
    }
}
