import { model, Schema } from "mongoose";
import { status } from "../../src/utils/constant/enums.js";


const userSchema = new Schema({
    userName: { type: String, required: true,unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true,select:false },
    status: { type: String, enum: Object.values(status), default: status.PENDING },

}, { timestamps: true });



// ✅ Hide password from JSON & Object responses
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

export const User = model('User', userSchema);