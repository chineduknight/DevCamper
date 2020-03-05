process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../server.js');
const { connectDB, closeDB } = require('../../../config/db.js');

describe('GET /api/v1/courses', () => {
  before(done => {
    connectDB()
      .then(() => done())
      .catch(err => done(err));
  });
  after(done => {
    closeDB()
      .then(() => done())
      .catch(err => done(err));
  });

  it('get all courses should be empty', done => {
    request(app)
      .get('/api/v1/courses')
      .then(res => {
        const body = res.body;
        // console.log(body.data);
        expect(body.data.length).to.equal(0);
        done();
      })
      .catch(err => done(err));
  });

  // it('should return one item from bootcamp', done => {
  //   request(app)
  //     .post('/api/v1/bootcamps')
  //     .send(testbootcamp)
  //     .then(res => {
  //       request(app)
  //         .get('/api/v1/bootcamps')
  //         .then(res => {
  //           const { data } = res.body;
  //           expect(data.length).to.equal(1);
  //           done();
  //         });
  //     })
  //     .catch(err => done(err));
  // });
});
