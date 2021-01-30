import * as mongoose from 'mongoose';

export interface IToken extends mongoose.Document {
  token: string,
  user: mongoose.Schema.Types.ObjectId
}

const TokenModel = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Token = mongoose.model<IToken>('Token', TokenModel);
export default Token;
