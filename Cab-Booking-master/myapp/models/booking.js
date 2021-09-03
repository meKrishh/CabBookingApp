import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    _id: String,
    userId: {
        type: String,
        default: '',
        index: true
    },
    cabId: {
        type: String,
        default: ''
    },
    bookingDate: {
        type: Date,
        default: '',
        index: true
    },
    status: {
        type: String,
        enum : ['upcoming', 'riding', 'completed','cancelled'],
        default: 'upcoming'
    },
    rideType: {
        type: String,
        default: ''
    }
});

export default mongoose.model('booking', schema);