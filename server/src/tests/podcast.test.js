let chai=require("chai");
let chaiHttp=require("chai-http");
const { describe } = require("mocha");
const expect = chai.expect;
const Podcast  = require('../src/database/model/podcast').Podcast;
const request = require('supertest');
let server=require("../api");
//Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Test podcast  api ',()=>{

    //testing the get podcast by id 
    it("it should get the podcast by id ",(done)=>{
        const podcastid=1;
        chai.request(server)
        .get("/podcast/podcast/"+podcastid)
        .end((err,response)=>{
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property("id").eq(1);
           done();
        });
    
    })
          //testing the get podcast by id 
    it("it should display an error message  ",(done)=>{
        const podcastid=2000;
        chai.request(server)
        .get("/podcast/podcast/"+podcastid)
        .end((err,response)=>{
            response.should.have.status(404);
            response.text.should.be.eq("Erreur recuperation");
           done();
        });
    
    })

    //************************* */
    describe('GET /topics/:topic/podcasts', () => {
        it('devrait retourner les 6 derniers podcasts pour le topic spécifié', (done) => {
          const topic = 'Technologie'; // Spécifier le topic pour le test
      
          request(server)
            .get(`/podcast/podcasts/${topic}`)
            .end((err, res) => {
              expect(res.body).to.be.an('array'); // Vérifier que la réponse est un tableau
              expect(res.body.length).to.equal(6); // Vérifier que le tableau contient 6 éléments
              expect(res.body[0]).to.have.property('id'); // Vérifier que chaque élément a une propriété 'id'
              expect(res.body[0]).to.have.property('title'); // Vérifier que chaque élément a une propriété 'title'
              expect(res.body[0]).to.have.property('description'); // Vérifier que chaque élément a une propriété 'description'
              
              done(); // Signaler que le test est terminé
            });
        });
      });
      

    /******************** */
    
    });
/*
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require("../../api");
const Podcast = require('../database/model/podcast').Podcast;

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /podcast/podcasts', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return all podcasts', async () => {

    const expectedPodcasts = [
    { id: 1, title: 'Baby, This is Keke Palmer', author: 'Keke Palmer' },
    { id: 7, title: 'News & Politics Podcast 1', author: 'Author 1' },
  ];

    // Stub the findAll method of the Podcast model to return the expected podcasts
    const stub = sinon.stub(Podcast, 'findAll').returns(Promise.resolve(expectedPodcasts));

    const res = await chai.request(app).get(`/podcast/podcasts`);
    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal(expectedPodcasts);

    // Check that the method was called once
    expect(stub.calledOnce).to.be.true;
  });

  it('should return a server error if an error occurs', async () => {
    
    // Stub the findAll method of the Podcast model to throw an error
    const stub = sinon.stub(Podcast, 'findAll').throws(new Error('Database connection error'));

    const res = await chai.request(app).get(`/podcast/podcasts`);
    expect(res).to.have.status(500);
    expect(res.text).to.equal('Erreur serveur');

    // Check that the method was called once
    expect(stub.calledOnce).to.be.true;
  });
});


const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');
const app = require('../../api');
const { Podcast } = require('../database/model/podcast');


let chai=require("chai");
let chaiHttp=require("chai-http");
const { describe } = require("mocha");
const expect = chai.expect;
const Podcast  = require('../src/database/model/podcast').Podcast;
const request = require('supertest');
let server=require("../api");
//Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Test podcast  api ',()=>{

    //testing the get podcast by id 
    it("it should get the podcast by id ",(done)=>{
        const podcastid=1;
        chai.request(server)
        .get("/podcast/podcast/"+podcastid)
        .end((err,response)=>{
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property("id").eq(1);
           done();
        });
    
    })
          //testing the get podcast by id 
    it("it should display an error message  ",(done)=>{
        const podcastid=2000;
        chai.request(server)
        .get("/podcast/podcast/"+podcastid)
        .end((err,response)=>{
            response.should.have.status(404);
            response.text.should.be.eq("Erreur recuperation");
           done();
        });
    
    })

    //************************* 
    describe('GET /topics/:topic/podcasts', () => {
      it('devrait retourner les 6 derniers podcasts pour le topic spécifié', (done) => {
        const topic = 'Technologie'; // Spécifier le topic pour le test
    
        request(server)
          .get(/podcast/podcasts/${topic})
          .end((err, res) => {
            expect(res.body).to.be.an('array'); // Vérifier que la réponse est un tableau
            expect(res.body.length).to.equal(6); // Vérifier que le tableau contient 6 éléments
            expect(res.body[0]).to.have.property('id'); // Vérifier que chaque élément a une propriété 'id'
            expect(res.body[0]).to.have.property('title'); // Vérifier que chaque élément a une propriété 'title'
            expect(res.body[0]).to.have.property('description'); // Vérifier que chaque élément a une propriété 'description'
            
            done(); // Signaler que le test est terminé
          });
      });
    });
    
    
    
    
    

  /******************** 
    
  
  
  });

chai.use(chaiHttp);
chai.use(chaiSpies);
const expect = chai.expect;

describe('GET /podcasts', () => {
  it('should return all podcasts', async () => {
    const expectedPodcasts = [      { id: 1, title: 'Baby, This is Keke Palmer' },      { id: 7, title: 'News & Politics Podcast 1' }    ];
    
    chai.spy.on(Podcast, 'findAll').resolves(expectedPodcasts);

    const res = await chai.request(app).get('/podcasts');
    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal(expectedPodcasts);

    chai.spy.restore(Podcast, 'findAll');
  });

  it('should return a server error if an error occurs', async () => {
    const errorMessage = 'Une erreur est survenue';
    chai.spy.on(Podcast, 'findAll').rejects(new Error(errorMessage));

    const res = await chai.request(app).get('/podcasts');
    expect(res).to.have.status(500);
    expect(res.text).to.equal('Erreur serveur');

    chai.spy.restore(Podcast, 'findAll');
  });
});



const podcastTest = require('../controllers/podcast.controller');
const Podcast = require('../database/model/podcast').Podcast; // Importer le modèle Podcast

describe('getAllPodcasts', () => {
  it('should return all podcasts', async () => {
    const expectedPodcasts = [
        { id: 1, title: 'Baby, This is Keke Palmer' },
        { id: 7, title: 'News & Politics Podcast 1' }
        ];
    
    jest.spyOn(podcastTest.Podcast, 'findAll').mockResolvedValue(expectedPodcasts);
    const req = {};
    const res = { json: jest.fn() };
    await podcastTest.getAllPodcasts(req, res);
    expect(res.json).toHaveBeenCalledWith(expectedPodcasts);
  });

  it('should return a server error if an error occurs', async () => {
    jest.spyOn(podcastTest.Podcast, 'findAll').mockRejectedValue(new Error('Database error'));
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    await podcastTest.getAllPodcasts(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Erreur serveur');
  });
});
*/