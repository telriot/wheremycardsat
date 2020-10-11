import  {User} from "../models/User";
import {Strategy as LocalStrategy} from 'passport-local';


const userLocalStrategy = new LocalStrategy(
  async (username, password, done) => {
    
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect credentials" });
      }
      if (!user.checkPassword(password)) {
        return done(null, false, { message: "Incorrect credentials" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
)

export {userLocalStrategy as default}
