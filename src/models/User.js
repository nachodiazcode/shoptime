import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    roles: [{ type: String, enum: ['user', 'admin'], default: 'user' }],
    isActive: { type: Boolean, default: true },
    reputation: { type: Number, default: 0 },  // Campo de reputación añadido
    profile: {
        firstName: { type: String, trim: true, default: '' },
        lastName: { type: String, trim: true, default: '' },
        phone: { type: String, trim: true, default: '' }
    },
    address: {
        street: { type: String, trim: true, default: '' },
        city: { type: String, trim: true, default: '' },
        state: { type: String, trim: true, default: '' },
        country: { type: String, trim: true, default: '' },
        zip: { type: String, trim: true, default: '' }
    },
    paymentMethods: [{
        cardType: { type: String, enum: ['Visa', 'MasterCard', 'Amex'], default: 'Visa' },
        cardNumber: { type: String, trim: true, default: '' },
        cardName: { type: String, trim: true, default: '' },
        cardExpiration: { type: String, trim: true, default: '' },
        cardCVV: { type: String, trim: true, default: '' }
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
