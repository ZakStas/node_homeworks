const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactsSchema = new Schema ({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: (value) => value.includes('@'),
    unique: true,
  },
  phone: {
   type: String,
   required: true,
   validate: {
   validator: function (v) {
   return /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/.test(v);
    },
  },
},
password: {
  type: String,
  required: true
}
});

const contactModel = mongoose.model("Contact", contactsSchema);
module.exports = contactModel;