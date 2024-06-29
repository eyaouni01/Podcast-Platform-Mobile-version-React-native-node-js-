let chai=require("chai");
let chaiHttp=require("chai-http");
const { describe } = require("mocha");
const expect = chai.expect;
const User  = require('../src/database/model/user').User;
const bcrypt = require('bcrypt');
let server=require("../api");



//Assertion Style
chai.should();
chai.use(chaiHttp);
describe('Test user api ',()=>{
/*Test the Get Route */
describe("Get user profile from users/user/profile",()=>{

it("it should get the user profile ",(done)=>{
    chai.request(server)
    .get("/users/user/profile")
    .end((err,response)=>{
        response.should.have.status(200);
        
        done();
    })
})
})

 


});