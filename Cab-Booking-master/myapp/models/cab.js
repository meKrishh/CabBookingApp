import mongoose from 'mongoose';

const loc = {
    lattitude: Number,
    longitude: Number
};

const schema = new mongoose.Schema({
    _id: String,
    driverName: {
        type: String,
        default: ''
    },
    driverNumber: {
        type: String,
        default: ''
    },
    location: {
        type: loc
    },
    isBooked: {
        type: Boolean,
        default: false,
        index: true
    },
    rideType: {
        type: String,
        default: ''
    }
});

export default mongoose.model('cab', schema);