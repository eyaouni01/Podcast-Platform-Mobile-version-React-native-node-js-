const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require("../../api");
const expect = chai.expect;
const sinon = require('sinon');
const Track  = require('../database/model/track').Track;

chai.use(chaiHttp);

describe('POST /track/newTrack/:podcastId', () => {
  it('should create a new track for a podcast', async () => {
    const podcastId = 1;
    const track = {
      title: 'Test Track',
      description: 'This is a test track',
      file: {
        path: 'C:/Users/GAMING/OneDrive/Bureau/real podcast app/server/src/tests/test-audio.mp3',
        originalname: 'test-audio.mp3',
      },
    };

    const res = await chai.request(app)
      .post(`/track/newTrack/${podcastId}`)
      .attach('file', track.file.path, track.file.originalname)
      .field('title', track.title)
      .field('description', track.description);

    expect(res).to.have.status(200);
    expect(res.body.title).to.equal(track.title);
    expect(res.body.description).to.equal(track.description);
    expect(res.body.podcastId).to.equal(podcastId);
    expect(res.body.trackUrl).to.include('https://evey-podcasts.s3.eu-west-3.amazonaws.com/tracks_audio/' + new Date().toISOString() + '-' );
  });

  it('should return a 400 error if invalid podcastId is provided', async () => {
    const invalidPodcastId = 'invalid';

    const res = await chai.request(app)
      .post(`/track/newTrack/${invalidPodcastId}`);

    expect(res).to.have.status(400);
  });

  it('should return a 500 error if an error occurs during file upload', async () => {
    const podcastId = 1;
    const track = {
      title: 'Test Track',
      description: 'This is a test track',
      file: {
        path: 'C:/Users/GAMING/OneDrive/Bureau/real podcast app/server/src/tests/nonexistent-file.mp3',
        originalname: 'nonexistent-file.mp3',
      },
    };

    const res = await chai.request(app)
      .post(`/track/newTrack/${podcastId}`)
      .attach('file', track.file.path, track.file.originalname)
      .field('title', track.title)
      .field('description', track.description);

    expect(res).to.have.status(500);
  });
});

/*
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require("../../api");
const Track  = require('../database/model/track').Track;

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /track/tracks', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return all tracks of a podcast', async () => {
    const expectedTracks = [ 
      { id: 1, title: 'Les avantages et inconvénients du télétravail' },
      { id: 2, title: 'Le défi du changement climatique' },
    ];

    // Stub the findAll method of the Track model to return the expected tracks
    const stub = sinon.stub(Track, 'findAll').returns(Promise.resolve(expectedTracks));

    const res = await chai.request(app).get(`/track/tracks`);
    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal(expectedTracks);

    // Check that the method was called once
    expect(stub.calledOnce).to.be.true;
  });

  it('should return a server error if an error occurs', async () => {
    
    // Stub the findAll method of the Track model to throw an error
    const stub = sinon.stub(Track, 'findAll').throws(new Error('Database connection error'));

    const res = await chai.request(app).get(`/track/tracks`);
    expect(res).to.have.status(500);
    expect(res.text).to.equal('Erreur serveur');

    // Check that the method was called once
    expect(stub.calledOnce).to.be.true;
  });
});
*/

/*
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../api'); // Your Express app
const User = require('../src/database/model/user').User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('User registration', () => {
 
  
    it('should register a new user', (done) => {
      const user = {
        name: 'eya',
        email: 'eya@example.com',
        password: 'password'
      };
  
      request(app)
        .post('/users/user')
        .send(user)
        .end((err, res) => {
          console.log(res.body); // log the response body
          console.log(res.status); // log the response status
          expect(res.status).to.equal(200);
          
          // Verify that user is saved in the database
          User.findOne({ where: { email: 
user.email
 } })
            .then((user) => {
              expect(user).to.not.be.null;
              expect(
user.name
).to.equal('eya');
              // Verify that password is hashed
              
bcrypt.compare
('password', user.password)
                .then((result) => {
                  expect(result).to.be.true;
                  done();
                })
                .catch((err) => done(err));
            })
            .catch((err) => done(err));
        });
    });
  }); 
*/