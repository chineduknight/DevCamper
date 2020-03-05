process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const server = require('../../../server.js');
const { connectDB, closeDB } = require('../../../config/db.js');
const User = require('../../../models/User');

chai.use(chaiHttp);

let token;

describe('Authentication route', () => {
  const signup = '/api/v1/auth/register';
  const signin = '/api/v1/auth/login';
  const currentUser = '/api/v1/auth/me';
  const logout = '/api/v1/auth/logout';
  const updatedetails = '/api/v1/auth/updatedetails';
  const updatepassword = '/api/v1/auth/updatepassword';
  const forgotpassword = '/api/v1/auth/forgotpassword';
  const resettoken = '/api/v1/auth//resetpassword/:resettoken';
  const user = {
    name: faker.name.findName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    role: 'publisher'
  };
  const testUser = {
    name: faker.name.findName(),
    password: faker.internet.password(),
    email: 'john@gmail.com',
    role: 'publisher'
  };

  before(done => {
    connectDB()
      .then(() => {})
      .catch(err => done(err));

    User.create(testUser)
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

  describe('signup', () => {
    it('should create new user if email not found', done => {
      chai
        .request(server)
        .post(signup)
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should return 403 if email was found', done => {
      chai
        .request(server)
        .post(signup)
        .send(testUser)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Duplicate field value entered');
          done();
        });
    });

    it('should return error 400 if empty object', done => {
      let user = {};
      chai
        .request(server)
        .post(signup)
        .send(user)
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal(
            'Please add a name,Please add an email,Please add a password'
          );
          done();
        });
    });
  });

  describe('signin', () => {
    it('should return error 400 if user email and password empty', done => {
      let user = {};
      chai
        .request(server)
        .post(signin)
        .send(user)
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal(
            'Please provide an email and password'
          );
          done();
        });
    });

    it('should return 200 and our token', done => {
      chai
        .request(server)
        .post(signin)
        .send(testUser)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

  describe('get logged in user details', () => {
    it('should return 200 and user details', done => {
      chai
        .request(server)
        .get(currentUser)
        .set('Authorization', 'Bearer ' + token)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body).not.to.be.empty;
          expect(res.body.data).to.have.property('_id');
          expect(res.body.data).to.have.property('name');
          expect(res.body.data).to.have.property('email');
          expect(res.body.data).to.have.property('createdAt');
          done();
        });
    });
    it('should fail if token is not valid', done => {
      chai
        .request(server)
        .get(currentUser)
        .end((err, res) => {
          expect(res.status).to.be.equal(401);
          expect(res.body).not.to.be.empty;
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal(
            'Not authorized to access this route'
          );
          done();
        });
    });
  });

  describe('signout', () => {
    it('should logout a user', done => {
      chai
        .request(server)
        .get(logout)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
        });
    });
  });
}); // Main describe
