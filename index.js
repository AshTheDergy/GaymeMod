const Gaymer = require("./handlers/Client");
const { TOKEN } = require("./settings/config");
const client = new Gaymer();

module.exports = client;

client.start(TOKEN);

process.on("unhandledRejection", (reason, p) => {
   console.log(" [Error_Handling] :: Unhandled Rejection/Catch");
   console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
   console.log(" [Error_Handling] :: Uncaught Exception/Catch");
   console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
   console.log(" [Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
   console.log(err, origin);
});

process.on('SIGINT', () => {
   const channel = client.channels.cache.get(client.config.channel);

   if (channel) {
      channel.send('Shutting down -w-');
   }

   client.destroy();
   process.exit();
});

process.on('SIGTERM', () => {

   const channel = client.channels.cache.get(client.config.channel);

   if (channel) {
      channel.send('Brb :3');
   }

   client.destroy();

   setTimeout(() => {
       process.exit();
   }, 3000);
});
