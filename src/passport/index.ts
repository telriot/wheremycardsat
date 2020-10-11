import passport from "passport";
import {User} from "../models/User";
import localStrategy from "./localStrategy";
import {IUser} from "../models/User"
passport.serializeUser((user:IUser, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(new Error("Failed to deserialize an user"));
  }
});

passport.use(localStrategy);

export { passport as default };
