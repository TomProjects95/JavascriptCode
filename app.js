const discord = require('discord.js');
const client = new discord.Client();
const request = require('request');

let oneAM = new Date();
let sevenAM = new Date();
let onePM = new Date();
let sevenPM = new Date();

const queue = new Map();

client.on('ready', ready => 
{
    console.log('Bot is now ready');
    //startStatus()
    
    //startPlayers()
});

function startStatus(){
    
  var guild = client.guilds.cache.get("ID");
  let channel4 = guild.channels.cache.get("ID");
  
  var Embed = new discord.MessageEmbed()
      .setColor("#ff8c00")
      .setAuthor('Name', "https://logoimage.png")
      .setDescription("Im booting up! \n Fetching data...")
      .setTimestamp(new Date())
  var online = true;
  channel4.send(Embed).then((m) => {
      setInterval(() => {
          //Restart times 
          oneAM.setHours(3, 0, 0, 0); //3AM
          sevenAM.setHours(6, 0, 0, 0); //6AM
          onePM.setHours(12, 0, 0, 0); //1PM
          sevenPM.setHours(17, 0, 0, 0); //7PM

          //Now we have our restart dates for the current date.
          //Let's check where we are in the day right now, and possibly change the dates accordingly.
          let rightNow = new Date();
          if(rightNow > oneAM){
              if(rightNow > sevenAM){
                  if(rightNow > onePM){
                      if(rightNow > sevenPM){
                          //Next restart at 1am, next day
                          oneAM.setDate(oneAM.getDate()+1);
                          r = "GMT+1 : **3am** | 6am | 12pm | 5pm\nEST : **7pm** | 1am | 7am | 12pm";
                          nextRestart = oneAM;
                          lastRestart = sevenPM;

                          //Since the next restart is tomorrow, we can add a day to all of the times;
                          sevenAM.setDate(sevenAM.getDate()+1);
                          onePM.setDate(onePM.getDate()+1);
                          sevenPM.setDate(sevenPM.getDate()+1);
                      } else {
                          //Next restart at 7pm
                          r = "GMT+1 : 3am | 6am | 12pm | **5pm**\nEST : 7pm | 1am | 7am | **12pm**";
                          nextRestart = sevenPM;
                          lastRestart = onePM;
                      }
                  } else {    
                      //Next restart at 1pm
                      r = "GMT+1 : 3am | 6am | **12pm** | 5pm\nEST : 7pm | 1am | **7am** | 12pm";
                      nextRestart = onePM;
                      lastRestart = sevenAM;
                  }
              } else {
                  //Next restart at 7am
                  r = "GMT+1 : 3am | **6am** | 12pm | 5pm\nEST : 7pm | **1am** | 7am | 12pm";
                  nextRestart = sevenAM;
                  lastRestart = oneAM;
              }
          } else {
              //Next restart 1am this day
              r = "GMT+1 : **3am** | 6am | 12pm | 5pm\nEST : **7pm** | 1am | 7am | 12pm";
              nextRestart = oneAM;
          }
          client.user.setActivity(`${guild.memberCount} members!`, { type: 'WATCHING' });
          var ja = request('link to server api', { json: true }, async (err, res, body) => {
              if (body != null && body != undefined && body.Data != null && body.Data != undefined) {
                  var hostname = body['Data']['hostname'];
                  var players = body["Data"]["clients"];
                  var maxp = body["Data"]["sv_maxclients"];

                  if(body['Data']["vars"]['Uptime'] != undefined && body['Data']["vars"]['Uptime'] != null){
                      uptime = body['Data']['vars']['Uptime'];
                  }


                  t = new Date(nextRestart);
                  t.setHours(t.getHours() - rightNow.getHours());
                  t.setMinutes(t.getMinutes() - rightNow.getMinutes());
                  
                  t = ("0"+t.getHours()).slice(-2)+"h "+("0"+t.getMinutes()).slice(-2)+"m";

                  if (!online){ 
                      online = true; 
                  }
                  var hasQue = false;
                  if (hostname[0] == "[") {
                      hasQue = true;
                  }
                  var que = 0;
                  if (hasQue) {
                      var regex = /[+-]?\d+(?:\.\d+)?/g;
                      var match = regex.exec(hostname);
                      que = match[0];
                  } else {
                      que = "0";
                  }
                  var Embed = new discord.MessageEmbed()
                      .setColor("#ff8c00")
                      .setAuthor('Name', "https://imagelogo.png")
                      .setThumbnail('https://imagelogo.png')
                      .addField('**Players**', players + "/" + maxp, true)
                      .addField('**Queue**', que, true)
                      .addField('**Server Uptime**', uptime, true)
                      .setTimestamp(new Date())
                      .setFooter('creator');
                  m.edit(Embed);
                  online = true;
              }
              else if (online && res.statusCode == 200) {
                      var Embed = new discord.MessageEmbed()
                          .setColor("#ff8c00")
                          .setAuthor('Name', "https://imagelogo.png")
                          .setThumbnail('https://imagelogo.png')
                          .addField('**Players**', "0/64", true)
                          .addField('**Queue**', "0", true)
                          .addField('**Server Uptime**', "Server down", true)
                          .setTimestamp(new Date())
                          .setFooter('creator');
                      m.edit(Embed)
                      online = false;
                  }
          });
      }, 20000)
  }).catch((error) => { console.log("something went wrong\n"+error) });
}

function startPlayers(){
    
  var guild = client.guilds.cache.get("ID");
  let channel5 = guild.channels.cache.get("ID");

  var Embed = new discord.MessageEmbed()
      .setColor("#ff8c00")
      .setAuthor('Online Players', "https://imagelogo.png")
      .setDescription("Loading Online Players...")
      .setTimestamp(new Date())
      //.setFooter('creator');
 
  channel5.send(Embed).then((msg) => {
      setInterval(() => {

          var ja = request('link to api for server', { json: true }, async (err, res, body) => {
              if (body != null && body != undefined && body.Data != null && body.Data != undefined) {
                var playertable = body['Data']['players'];

                var Embed = new discord.MessageEmbed()
                    .setColor("#ff8c00")
                    .setAuthor('Online Players', "https://imagelogo.png")
                    .setTimestamp(new Date())
                    for (let index = 0; index < playertable.length; index++) {
                        //console.log(playertable[index])
                        //console.log(playertable[index]["name"])
                        Embed.addField(playertable[index]["name"], false, true);
                    }                                  

                msg.edit(Embed);
                  
              }
          });
      }, 20000)
  }).catch((error) => { console.log("something went wrong\n"+error) });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

client.on('message', async message => {

    if(message.author.bot) return;

    console.log(message.content);
    var splitString = message.content.split(" ");
    console.log(splitString);

    if (splitString[0] == 'test1')
    {
      message.channel.send("Is the best")
    }

    if (splitString[0] == 'test2')
    {
      const exampleEmbed = new discord.MessageEmbed()
        .setTitle('Hello')
        .setTimestamp()

      message.channel.send(exampleEmbed);
    }


    if (splitString[0] == '<@!BOT ID>')
    {
      message.channel.send("Sup?")
    }

    if (splitString[0] == 'ping')
    {
      message.channel.send("pong!")
    }

    if (splitString[0] == 'time')
    {
        let rightNow = new Date();
        let hour = rightNow.getHours()
        let minutes = rightNow.getMinutes()
        var time = hour+":"+minutes;
        let ampm = null;
        
        
        console.log(time.toLocaleString());
        message.channel.send('**Current time:** '+time+ " UK TIME");
    }

    if (splitString[0] == 'meme')
    {
     
      try
      {
        var msg = message.channel.send("Loading meme...");
        var random = getRandomInt(2);
        console.log(random)
        if (random === 1)
        {
          let result = request('https://some-random-api.ml/meme', { json: true }, async (err, res, body) => 
          {
            var url = body['image']
            var caption = body['caption']
            var cat = body['category']

            const exampleEmbed = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(caption)
            //.setURL('https://discord.js.org/')
    
            .setDescription('Category: '+cat)
            //.setThumbnail('https://i.imgur.com/W50GDO3.jpg')
            //.addFields(
            //    { name: 'Regular field title', value: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
            //    { name: '\u200B', value: '\u200B' },
            //    { name: 'Inline field title', value: 'Some value here', inline: true },
            //    { name: 'Inline field title', value: 'Some value here', inline: true },
            //)
            //.addField('Inline field title', 'Some value here', true)
            .setImage(url)
            .setTimestamp()
            .setFooter('Random Memays');

            message.channel.send(exampleEmbed);
            (await msg).delete(msg)
          });
        }
        else
        {
          let result = request('https://meme-api.herokuapp.com/gimme', { json: true }, async (err, res, body) => 
          {
            var url = body['url']
            var title = body['title']
            var cat = body['subreddit']

            const exampleEmbed = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(title)
            //.setURL('https://discord.js.org/')

            .setDescription('Subreddit: '+cat)
            //.setThumbnail('https://i.imgur.com/W50GDO3.jpg')
            //.addFields(
            //    { name: 'Regular field title', value: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
            //    { name: '\u200B', value: '\u200B' },
            //    { name: 'Inline field title', value: 'Some value here', inline: true },
            //    { name: 'Inline field title', value: 'Some value here', inline: true },
            //)
            //.addField('Inline field title', 'Some value here', true)
            .setImage(url)
            .setTimestamp()
            .setFooter('Random Memays');

            message.channel.send(exampleEmbed);
            (await msg).delete(msg)
          });
        }
        
      }
      catch(e)
      {
        message.channel.send("```\nThere was an error with the meme API request :(\n```")
        console.log("Error: "+e)
      }
    }

    if (splitString[0] == ';help')
    {
        message.channel.send('**Available Commands:** \nping \ncorona \ntime \nmeme \nchainlink \nbitcoin \nlookup *Country Name*');
    }
    
    if (splitString[0] == 'ping2')
    {
        message.channel.send(`Pong! 2`);
        //message.channel.send(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`)
        //message.channel.send('dont ping me <@'+message.member.user.id+'>');
    }

    if (splitString[0] == 'corona')
    {
      const msg = message.channel.send("Loading data...");

      try
      {
        var http = require("https");

        var options = {
          "method": "GET",
          "hostname": "coronavirus-monitor.p.rapidapi.com",
          "port": null,
          "path": "/coronavirus/worldstat.php",
          "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "2193055115msh342c0d944ff0066p1187d8jsn1221f081116d"
          }
        };
        let body;
        var req = http.request(options, function (res) {
          var chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function () {
              body = Buffer.concat(chunks);
              body = JSON.parse(body);
              //console.log(body);
              var coronaembed = new discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle("Global Stats")
                //.setURL('https://discord.js.org/')
                .setAuthor('Corona Bot')
                //.setDescription('Subreddit: '+cat)
                .setThumbnail('https://4vector.com/i/free-vector-toxic-icon_101641_Toxic_icon.png')
                //.addField('Total Cases', body.total_cases, true)
                .addFields(
                    { name: 'Total Cases', value: body.total_cases, inline: true},
                    { name: 'Total Deaths', value: body.total_deaths, inline: true},
                    { name: 'Total Recovered', value: body.total_recovered, inline: true},
                    { name: 'New Cases', value: body.new_cases, inline: true},
                    { name: 'New Deaths', value: body.new_deaths, inline: true}
                )
                //.addField('Inline field title', 'Some value here', true)
                //.setImage("https://4vector.com/i/free-vector-toxic-icon_101641_Toxic_icon.png")
                .setTimestamp()
                //.setFooter("Last Updated",body.statistic_taken_at)

              message.channel.send(coronaembed)
          });
        });
      }
      catch
      {
        message.channel.send("Error with corona data")
      }

      (await msg).delete(msg)
      req.end();
    }
    
    //https://widgets.coinmarketcap.com/v2/ticker/1975/?ref=widget&convert=USD

    if (splitString[0] == 'bitcoin')
    {
      try
      {
        let result = request('https://widgets.coinmarketcap.com/v2/ticker/1/?ref=widget&convert=GBP', { json: true }, async (err, res, body) => 
        {
          var name = body['data']['name']
          var GBPprice = body['data']['quotes']['GBP']['price']
          var GBPvol24h = body['data']['quotes']['GBP']['volume_24h']
          var GBPmarkCap = body['data']['quotes']['GBP']['market_cap']
          var GBPchangeper1h = body['data']['quotes']['GBP']['percent_change_1h']
          var GBPchangeper24h = body['data']['quotes']['GBP']['percent_change_24h']
          var GBPchangeper7d = body['data']['quotes']['GBP']['percent_change_7d']
          var url = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'
          const exampleEmbed = new discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(name)
          //.setURL('https://discord.js.org/')

          //.setDescription('Price: $'+USDprice)
          .setThumbnail(url)
          .addFields(
              { name: 'GBP Price', value: GBPprice},
              { name: 'GBP Volume 24h', value: GBPvol24h},
              { name: 'GBP Market Cap', value: GBPmarkCap},
              { name: 'GBP Price change 1H', value: GBPchangeper1h},
              { name: 'GBP Price change 24H', value: GBPchangeper24h},
              { name: 'GBP Price change 7d', value: GBPchangeper7d},
              //{ name: '\u200B', value: '\u200B' },
              //{ name: 'Inline field title', value: 'Some value here', inline: true },
              //{ name: 'Inline field title', value: 'Some value here', inline: true },
          )
          //.addField('Inline field title', 'Some value here', true)
          //.setImage(url)
          .setTimestamp()
          .setFooter('Bitcoain Prices');

          message.channel.send(exampleEmbed);
        });
      }
      
      catch(e)
      {
        message.channel.send("```\nThere was an error with the Bitcoin API request :(\n```")
        console.log("Error: "+e)
      }
    }

    if (splitString[0] == 'chainlink')
    {
      try
      {
        let result = request('https://widgets.coinmarketcap.com/v2/ticker/1975/?ref=widget&convert=USD', { json: true }, async (err, res, body) => 
        {
          var name = body['data']['name']
          //var caption = body['caption']
          var USDprice = body['data']['quotes']['USD']['price']
          var USDchangeper1h = body['data']['quotes']['USD']['percent_change_1h']
          var USDchangeper24h = body['data']['quotes']['USD']['percent_change_24h']
          var USDchangeper7d = body['data']['quotes']['USD']['percent_change_7d']
          var url = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png'
          const exampleEmbed = new discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(name)
          //.setURL('https://discord.js.org/')

          //.setDescription('Price: $'+USDprice)
          .setThumbnail(url)
          .addFields(
              { name: 'USD Price', value: USDprice},
              { name: 'USD Price change 1H', value: USDchangeper1h},
              { name: 'USD Price change 24H', value: USDchangeper24h},
              { name: 'USD Price change 7d', value: USDchangeper7d},
              //{ name: '\u200B', value: '\u200B' },
              //{ name: 'Inline field title', value: 'Some value here', inline: true },
              //{ name: 'Inline field title', value: 'Some value here', inline: true },
          )
          //.addField('Inline field title', 'Some value here', true)
          //.setImage(url)
          .setTimestamp()
          .setFooter('Chainlink Prices');

          message.channel.send(exampleEmbed);
        });
      }
      
      catch(e)
      {
        message.channel.send("```\nThere was an error with the chainlink API request :(\n```")
        console.log("Error: "+e)
      }
    }

    if(splitString[0] == 'lookup')
    {
      const msg = message.channel.send("Loading data...");
      var args = message.content.split("lookup");
      args = args[1].trim();
      console.log("PRINT "+args)
      if (args === null)
      {
        return;
      }
      try
      {
        var http = require("https");
        var options = {
          "method": "GET",
          "hostname": "coronavirus-monitor.p.rapidapi.com",
          "port": null,
          "path": "/coronavirus/cases_by_country.php",
          "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "2193055115msh342c0d944ff0066p1187d8jsn1221f081116d"
          }
        };
        let bycountry = null;
        let sent = false;
        var req = http.request(options, function (res) {
          var chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function () {
              bycountry = Buffer.concat(chunks);
              bycountry = JSON.parse(bycountry);
              

              for (let index = 0; index < bycountry['countries_stat'].length; index++)
              {
                var name = bycountry['countries_stat'][index]['country_name'].toString()

                if (args === name)
                {
                  var countryname = bycountry['countries_stat'][index].country_name
                  var totalcases = bycountry['countries_stat'][index].cases
                  var totaldeaths = bycountry['countries_stat'][index].deaths
                  var totalrecover = bycountry['countries_stat'][index].total_recovered
                  var newdeaths = bycountry['countries_stat'][index].new_deaths
                  var newcases = bycountry['countries_stat'][index].new_cases
                  var critialcase = bycountry['countries_stat'][index].serious_critical
                  var activecases = bycountry['countries_stat'][index].active_cases
                  var totcasepermil = bycountry['countries_stat'][index].total_cases_per_1m_population
                  var totaltests = bycountry['countries_stat'][index].total_tests
                  
                  console.log(bycountry['countries_stat'][index])
                  
                  var coronaembed = new discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(countryname)
                    //.setURL('https://discord.js.org/')
                    .setAuthor('Corona Bot')
                    //.setDescription('Subreddit: '+cat)
                    .setThumbnail('https://4vector.com/i/free-vector-toxic-icon_101641_Toxic_icon.png')
                    //.addField('Total Cases', body.total_cases, true)
                    .addFields(
                        { name: 'Total Cases', value: totalcases, inline: true},
                        { name: 'Total Deaths', value: totaldeaths, inline: true},
                        { name: 'Total Recovered', value: totalrecover, inline: true},
                        { name: 'New Deaths', value: newdeaths, inline: true},
                        { name: 'New Cases', value: newcases, inline: true},
                        { name: 'Serious/Critial Cases', value: critialcase, inline: true},
                        { name: 'Active Cases', value: activecases, inline: true},
                        { name: 'Total Cases per million population', value: totcasepermil, inline: true},
                        { name: 'Total tests', value: totaltests, inline: true}
                    )
                    //.addField('Inline field title', 'Some value here', true)
                    //.setImage("https://4vector.com/i/free-vector-toxic-icon_101641_Toxic_icon.png")
                    .setTimestamp()
                    //.setFooter("Last Updated",body.statistic_taken_at)

                  message.channel.send(coronaembed)
                  sent = true;
                  break
                }
              }
              if (sent!=true)
              {
                message.channel.send("Could not find any data for **"+args+"**\n(Case sensitive **lookup China** for example)")
              }
              
          });
        });
        (await msg).delete(msg)
        req.end();
      }
      catch(e)
      {
        (await msg).delete(msg)
        message.channel.send("```\nThere was an error with the coronavirus API request :(\n```")
        console.log("Error: "+e)
      }
    }


})

client.login('LOGIN ID');