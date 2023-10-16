import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service'; // Adjust the import path

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  function runBot() {
    const token = '6646578232:AAHoFtWiHxRkYUYYbgZcAYGtMcEYL_3aw2M';
    const bot = new TelegramBot(token, { polling: true });

    bot.on('message', async (msg) => {
      console.log(msg.from.first_name);

      const userService = app.get(UsersService);
      const users = userService.getUsers();

      const chatId = msg.chat.id;
      const userInput = msg.text;

      const index = users.findIndex(
        (prod) => prod.name.toLowerCase() === msg.from.first_name.toLowerCase(),
      );
      const user = users[index];
      console.log(user);
      if (user && user.isAllowed) {
        // console.log('user exists');
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=a50fdfc33501dcfe88aa59775ebe1b78`,
          );
          const data = response.data;
          const weather = data.weather[0].description;
          const temperature = data.main.temp - 273.15;
          const city = data.name;
          const humidity = data.main.humidity;
          const pressure = data.main.pressure;
          const windSpeed = data.wind.speed;
          const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
            2,
          )}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

          bot.sendMessage(chatId, message);
        } catch (error) {
          bot.sendMessage(chatId, "City doesn't exist.");
        }
      } else {
        bot.sendMessage(chatId, 'Requires permission from admin');
        // console.log("user doesn't exist");
      }
      // console.log(userInput);
    });
  }
  runBot();

  await app.listen(3000);
}
bootstrap();
