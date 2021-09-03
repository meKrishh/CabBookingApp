import Promise from 'bluebird'
import moment from 'moment'
import {
    v4 as uuidv4
} from 'uuid'
import _ from 'lodash'
var mongoose = require('mongoose');

import user from '../models/user'
import cab from '../models/cab'
import booking from '../models/booking'

import Response from '../response'
import {
    promises
} from 'fs';

class TaskService {

    getNearByCabs(req) {
        const lattitude = parseInt(req.body.lattitude)
        const longitude = parseInt(req.body.longitude)
        var closestDistance = Infinity;
        const nearByCabs = [];
        console.log(lattitude, longitude, " -----> data")
        return cab.find({
                isBooked: false,
            }).then(cabs => {
                if (cabs.length > 0) {
                    return Promise.map(cabs, (cab) => {
                        const cabLocation = {
                            lattitude: cab.location.lattitude,
                            longitude: cab.location.longitude
                        }
                        console.log(cabLocation, "-----------------")
                        const a = cabLocation.lattitude - lattitude;
                        const b = cabLocation.longitude - longitude;
                        const distance = Math.sqrt(a * a + b * b);
                        if (distance < closestDistance) {
                            closestDistance = distance
                            nearByCabs.push(cab)
                        }
                    }).then(() => {
                        return Response.successResponse(nearByCabs)
                    })
                }
                return Response.errorResponse(1, "No nearby cabs found")
            })
            .catch(err => Response.errorResponse(1, err))
    }

    bookCab(req) {
        const idMap = uuidv4()
        const now = Date.now()
        return this.getNearByCabs(req).then(cabs => {
            if (cabs.success) {
                const cabAvailable = _.find(cabs.info, {
                    '_id': req.body.cabId
                });
                return cab.updateOne({
                        _id: req.body.cabId
                    }, {
                        $set: {
                            isBooked: true
                        }
                    }).then(() => {
                        return booking.update({
                            _id: idMap
                        }, {
                            userId: req.user._id,
                            cabId: cabAvailable._id,
                            bookingDate: now,
                            status: 'upcoming',
                            rideType: cabAvailable.rideType
                        }, {
                            upsert: true
                        }).then(() => {
                            return Response.successResponse(cabAvailable)
                        })
                    })
                    .catch(err => Response.errorResponse(1, err))
            }
            return Response.errorResponse(1, cabs.description)
        })
    }

    updateBookingStatus(req) {
        return booking.updateOne({
            userId: req.user._id,
            cabId: req.body.cabId,
            bookingDate: req.body.bookingDate
        }, {
            $set: {
                status: req.body.status
            }
        }).then(() => {
            if (req.body.status === 'completed' || req.body.status === 'cancelled') {
                return cab.updateOne({
                    _id: req.body.cabId
                }, {
                    $set: {
                        isBooked: false
                    }
                }).then(() => {
                    return Response.successResponse("Your ride status is updated")
                })
            }
            return Response.successResponse("Your ride status is updated")
        })
    }

    getCompletedRides(req) {
        const limit = 2
        const offset = req.body.offset
        return booking.aggregate([{
                $match: {
                    status: req.body.status,
                    userId: req.user._id
                }
            },
            {
                $lookup: {
                    from: 'cabs',
                    localField: 'cabId',
                    foreignField: '_id',
                    as: 'cab'
                }
            },
            {
                $unwind: '$cab'
            },
            {
                $project: {
                    "bookingDate": '$bookingDate',
                    "cabId": '$cabId',
                    "rideType": '$rideType',
                    "status": '$status',
                    "driverName": '$cab.driverName',
                    "driverNumber": '$cab.driverNumber'
                }
            },
            {
                $skip: Number(offset) * limit
            },
            {
                $limit: limit
            }
        ]).then(rides => {
            if(rides.length > 0) {
                return Response.successResponse(rides)
            }
            return Response.errorResponse(1, "No rides found")
        })
        .catch(err => Response.errorResponse(1, err))
    }

}

module.exports = new TaskService();