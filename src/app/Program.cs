using System;
using System.IO;
using System.Reflection;
using System.Runtime.Loader;
using System.Threading;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace HelloWorldApp
{
    public class Program
    {
        private static readonly CancellationTokenSource ShutdownCancellationTokenSource = new CancellationTokenSource();  

        // Entry point for the application.
        public static void Main(string[] args)
        {
            ConfigureNLog();
            ConfigureShutdownHandler();

            var builder = new WebHostBuilder()
                .UseKestrel()
                .UseStartup<Startup>();
            
#if DEBUG
            var log = Log.ForContext<Program>();
            var webroot = FindWebRoot();
            log.Warning("Running in Debug mode, hosting static files from '{0}'.", webroot);
            builder.UseWebRoot(webroot);
#endif
                
            var host = builder.Build();
            host.Run(ShutdownCancellationTokenSource.Token);
        }
        
        private static void ConfigureNLog()
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .CreateLogger();
        }

        private static void ConfigureShutdownHandler()
        {
            var loadContext = AssemblyLoadContext.GetLoadContext(Assembly.GetEntryAssembly());
            loadContext.Unloading += ctx =>
                Cancel("Application unloading, probably SIGTERM");
            Console.CancelKeyPress += (s, e) =>
                Cancel(e.SpecialKey == ConsoleSpecialKey.ControlC ? "SIGINT" : "SIGQUIT");
        }

        private static void Cancel(string signal)
        {
            var log = Log.ForContext<Program>();
            log.Information("{0} received, initiating shutdown.", signal);
            if (!ShutdownCancellationTokenSource.IsCancellationRequested)
                ShutdownCancellationTokenSource.Cancel();
            Log.CloseAndFlush();
        }
        
        private static string FindWebRoot()
        {
            var location = System.Reflection.Assembly.GetEntryAssembly().Location;
            location = location.Substring(0, location.LastIndexOf(Path.DirectorySeparatorChar));
                            
            var webroot = Path.Combine(new []{location, "..", "..", "..", "..", "..", "ui"});
            return Path.GetFullPath(webroot);
        }
    }
}
