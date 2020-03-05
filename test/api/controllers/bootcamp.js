process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const faker = require('faker');
const server = require('../../../server.js');
const { connectDB, closeDB } = require('../../../config/db.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const User = require('../../../models/User');
const testbootcamp = {
  name: 'Devworks Bootcamp',
  description:
    'Devworks is a full stack JavaScript Bootcamp located in the heart of Boston that focuses on the technologies you need to get a high paying job as a web developer',
  website: 'https://devworks.com',
  phone: '(111) 111-1111',
  email: 'enroll@devworks.com',
  address: '233 Bay State Rd Boston MA 02215',
  careers: ['Web Development', 'UI/UX', 'Business'],
  housing: true,
  jobAssistance: true,
  jobGuarantee: false,
  acceptGi: true
};
let token;
describe('Test bootcamp route /api/v1/bootcamps', () => {
  before(done => {
    // connectDB()
    //   .then(() => {})
    //   .catch(err => done(err));
    User.create({
      name: faker.name.findName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      role: 'publisher'
    })
      .then(user => {
        token = user.getSignedJwtToken();
        done();
      })
      .catch(err => done(err));
  });
  after(done => {
    closeDB()
      .then(() => done())
      .catch(err => done(err));
  });

  it('get all bootcamps should be empty', done => {
    request(server)
      .get('/api/v1/bootcamps')
      .then(res => {
        const body = res.body;
        // console.log(body.data);
        expect(body.data.length).to.equal(0);
        done();
      })
      .catch(err => done(err));
  });

  it('Create a bootcamp with current user', done => {
    chai
      .request(server)
      .post('/api/v1/bootcamps')
      .set('Authorization', 'Bearer ' + token)
      .send(testbootcamp)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.have.property('data');

        done();
      });
  });
});
