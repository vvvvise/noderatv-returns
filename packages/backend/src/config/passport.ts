import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY || '',
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET || '',
      callbackURL: 'http://localhost:3000/auth/twitter/callback',
    },
    (token, tokenSecret, profile, done) => {
      // DB保存などの処理
      return done(null, profile);
    }
  )
);

export default passport;
