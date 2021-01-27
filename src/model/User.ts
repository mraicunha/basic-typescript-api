import * as mongoose from 'mongoose'

export interface IUser extends mongoose.Document {

  name: string,
  email: string,
  password: string

}

const UserSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})

export default mongoose.model<IUser>('User', UserSchema)