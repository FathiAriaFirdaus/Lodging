// models/relation.js
import User from './models/User.js';
import Room from './models/Room.js';
import Reservation from './models/Reservation.js';
import Payment from './models/Payment.js';
import Service from './models/Service.js';
import ReservationService from './models/ReservationService.js';

// Relasi antar model
User.hasMany(Reservation, { foreignKey: 'userId' }); // User memiliki banyak Reservation
Reservation.belongsTo(User, { foreignKey: 'userId' }); // Reservation milik satu User

Room.hasMany(Reservation, { foreignKey: 'roomId' }); // Room memiliki banyak Reservation
Reservation.belongsTo(Room, { foreignKey: 'roomId' }); // Reservation milik satu Room

Reservation.hasOne(Payment, { foreignKey: 'reservationId', onDelete: 'CASCADE'});
Payment.belongsTo(Reservation, { foreignKey: 'reservationId'})

Reservation.belongsToMany(Service, {
    through: 'ReservationService',
    foreignKey: 'reservationId',
    otherKey: 'serviceId',
})

Service.belongsToMany(Reservation, {
    through: 'ReservationService',
    foreignKey: 'serviceId',
    otherKey: 'reservationId',
})

ReservationService.belongsTo(Reservation, { foreignKey: 'reservationId' });
ReservationService.belongsTo(Service, { foreignKey: 'serviceId' });

export { User, Room, Reservation, Payment, Service, ReservationService };
