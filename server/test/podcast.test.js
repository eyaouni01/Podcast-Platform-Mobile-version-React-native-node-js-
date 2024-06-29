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