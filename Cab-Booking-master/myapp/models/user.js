import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  _id: String,
  userName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    index: true
  },
  email: {
    type: String,
    default: '',
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  contact: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  isAdmin: Boolean
});

// schema.methods.generateAuthToken = () => { 
//     console.log("got here....")
//     const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('myprivatekey'));
//     console.log("token -----> ", token)
//     return token;
//   }

export default mongoose.model('user', schema);






