let chai = require('chai');
let chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);
let app = require('../app');

describe('Cabs Booking APIs', () => {
    describe('/POST nearByCabs', () => {
        it('it should GET all the near by cabs', (done) => {
            chai.request(app)
                .post('/getCabs')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJjMTk2ZDMyZC04ZWZlLTQ5M2ItYWQ2MC0zMDc0MDBlYWI0MTIiLCJpYXQiOjE1OTE1Mzc1MjN9.0zigskdv0Ec-91_RHgJd9OfF3UTYBai63EfGL7j1wk0')
                .send({
                    "longitude": 10,
                    "lattitude": 20
                })
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    })

    describe('/POST booking', () => {
        it('it should book a cab for a user', (done) => {
            chai.request(app)
                .post('/cabs/booking')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJjMTk2ZDMyZC04ZWZlLTQ5M2ItYWQ2MC0zMDc0MDBlYWI0MTIiLCJpYXQiOjE1OTE1Mzc1MjN9.0zigskdv0Ec-91_RHgJd9OfF3UTYBai63EfGL7j1wk0')
                .send({
                    "longitude": 10,
                    "lattitude": 20,
                    "cabId": "1"
                })
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    })

    describe('/POST status', () => {
        it('it should GET change ride status of a cab', (done) => {
            chai.request(app)
                .post('/cabs/update/status')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJjMTk2ZDMyZC04ZWZlLTQ5M2ItYWQ2MC0zMDc0MDBlYWI0MTIiLCJpYXQiOjE1OTE1Mzc1MjN9.0zigskdv0Ec-91_RHgJd9OfF3UTYBai63EfGL7j1wk0')
                .send({
                    "cabId": "1",
                    "status": "completed",
                    "bookingDate": "2020-06-07T14:11:07.379Z"
                })
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    })

    describe('/POST completed', () => {
        it('it should GET all the completed rides', (done) => {
            chai.request(app)
                .post('/cabs/rides/get/completed')
                .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJjMTk2ZDMyZC04ZWZlLTQ5M2ItYWQ2MC0zMDc0MDBlYWI0MTIiLCJpYXQiOjE1OTE1Mzc1MjN9.0zigskdv0Ec-91_RHgJd9OfF3UTYBai63EfGL7j1wk0')
                .send({
                    "status": "completed",
                    "offset": 0
                })
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.body).should.be.a('object');
                    done();
                });
        });
    })

})