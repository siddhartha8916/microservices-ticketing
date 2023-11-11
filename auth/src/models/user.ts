import mongoose from "mongoose";
import { Password } from "../utils/password";

// An interface that describes the properties that are required to create a user
interface UserProps {
  email: string;
  password: string;
}

// An interface that describes the properties that a User Model has
interface UserModelProps extends mongoose.Model<any> {
  build(user: UserProps): UserDocumentProps;
}

// An interface that describes what properties that a single User Document has
interface UserDocumentProps extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Anytime a user is saved to the Database this middleware function is executed
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

// Add a static function that we can call with the User model like
// User.build({
//   email:"test@test.com",
//   password:"asdfsd"
// })
userSchema.statics.build = (user: UserProps) => {
  return new User(user);
};

// <> In angle brackets the first one is the Document Props and the second One is the returning value which we pass
// User model somewhat returns an object of type UserModelProps
const User = mongoose.model<UserDocumentProps, UserModelProps>(
  "User",
  userSchema
);

export { User };
