﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using SimpleInjector;
using SimpleInjector.Integration.AspNetCore;
using SimpleInjector.Integration.AspNetCore.Mvc;
using Serilog;
using Swashbuckle.SwaggerGen.Application;
using Swashbuckle.Swagger.Model;

namespace HelloWorldApp
{
    public class Startup
    {
        private Serilog.ILogger log = Log.ForContext<Startup>(); 
        private readonly Container container = new Container();
        
        public Startup(IHostingEnvironment env)
        {
            log.Information("Starting up.");
        }
                
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            log.Information("Configuring services.");
            
            services.AddCors(options =>
                options.AddPolicy("AllowFileOrigin", builder => 
                    builder.WithOrigins("file://")));
            
            // Add framework services.
            services.AddMvc();
            services.AddMvcCore()
                .AddJsonFormatters(options => 
                    options.ContractResolver = new CamelCasePropertyNamesContractResolver());

            services.AddSwaggerGen();
            services.ConfigureSwaggerGen(options =>
                SetupSwagger(options));

            // Add SimpleInjector Controller Activator
            services.AddSingleton<IControllerActivator>(new SimpleInjectorControllerActivator(container));
        }

        private void SetupSwagger(SwaggerGenOptions options)
        {
            options.SingleApiVersion(new Info
                {
                    Title = "Hello CoreCLR Service API",
                    Description = "Just a playground...",
                    TermsOfService = "None",
                    Version = "v1"
                });
        }
        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // Configure is called after ConfigureServices is called.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            log.Information("Configuring.");
            
            SetupSimpleInjector(app);
            SetupDatabaseAsync().Wait();
            
            //add NLog to ASP.NET Core
            loggerFactory.AddSerilog();
            
            if (env.IsDevelopment())
                app.UseCors("AllowFileOrigin");
            
            // Serve the default file, if present.
            app.UseDefaultFiles();
            // Add static files to the request pipeline.
            app.UseStaticFiles();

            // Add MVC to the request pipeline.
            app.UseMvc();

            app.UseSwagger();
            app.UseSwaggerUi();
        }

        private void SetupSimpleInjector(IApplicationBuilder app)
        {
            app.UseSimpleInjectorAspNetRequestScoping(container);
            container.Options.DefaultScopedLifestyle = new AspNetRequestLifestyle();
            
            container.RegisterSingleton<IResourceProvider, ResourceProvider>();
            container.RegisterSingleton<IActionFactory, ActionFactory>();
            container.Register<IGetHelloWorldAction, GetHelloWorldAction>();

            container.RegisterSingleton<IHelloWorldDbContextFactory>(() =>
                new HelloWorldDbContextFactory(CreateDatabaseOptions().Options));
            container.Register<IHelloWorldDataService,HelloWorldDataService>();
            
            container.Verify();
        }

        public virtual DbContextOptionsBuilder<HelloWorldDbContext> CreateDatabaseOptions()
        {
            return new DbContextOptionsBuilder<HelloWorldDbContext>()
                .UseSqlite("Filename=./helloworld.db");
        }

        private async Task SetupDatabaseAsync()
        {
            var dataService = container.GetInstance<IHelloWorldDataService>();

            await dataService.EnsureCreatedAsync();
            log.Information("Currently we have {0} saved Greetings.", dataService.GetNumberOfGreetings());
        }
    }
}
