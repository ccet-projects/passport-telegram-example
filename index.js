const express = require('express');
const passport = require('passport');
const TelegramStrategy = require('passport-telegram').Strategy;

const throwError = () => {
  throw new TypeError('Не заданы переменные окружения BOT_TOKEN и BOT_NAME');
};

const botToken = process.env.BOT_TOKEN || throwError();
const botName = process.env.BOT_NAME || throwError();
const port = process.env.PORT || 80;

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.use(new TelegramStrategy({ botToken, passReqToCallback: true }, (req, data, done) => {
  req.user = data;
  done(null, data);
}));

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head></head>
      <body>
        <div id="widget">
          <script
            async
            src="https://telegram.org/js/telegram-widget.js?15"
            data-telegram-login="${botName}"
            data-size="medium"
            data-auth-url="/login"
            data-request-access="write"
          ></script>
        </div>
      </body>
    </html>
  `);
});

app.use(passport.initialize());

app.use('/login', passport.authenticate('telegram'), (req, res) => {
  res.send(`Вы вошли как ${req.user.first_name}`);
});

app.listen(port, () => {
  console.log(`Сервер слушает на порту ${port}`)
});