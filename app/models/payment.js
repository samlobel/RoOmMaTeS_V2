var mongoose = require('mongoose');

var PaymentSchema = mongoose.Schema({
  paymentIDs : [String]
});

module.exports = {schema : mongoose.model('Payment', PaymentSchema)};
