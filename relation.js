// models/relation.js
import User from './models/user.js';
import Room from './models/Room.js';
import Reservation from './models/Reservation.js';
import Payment from './models/Payment.js';

// Relasi antar model
User.hasMany(Reservation, { foreignKey: 'userId' }); // User memiliki banyak Reservation
Reservation.belongsTo(User, { foreignKey: 'userId' }); // Reservation milik satu User

Room.hasMany(Reservation, { foreignKey: 'roomId' }); // Room memiliki banyak Reservation
Reservation.belongsTo(Room, { foreignKey: 'roomId' }); // Reservation milik satu Room

Reservation.hasOne(Payment, { foreignKey: 'reservationId', onDelete: 'CASCADE'});
Payment.belongsTo(Reservation, { foreignKey: 'reservationId'})

export { User, Room, Reservation, Payment };
