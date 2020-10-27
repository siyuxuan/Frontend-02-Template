var assert = require('assert');

// var add = require('../add.js').add;
// var mul = require('../add.js').mul;

import {add, mul} from "../add.js"



describe("add funtion testing", function(){
    it('1 + 2 should be 3', function() {
        // console.log(add(1, 2))
        // console.log(3);
        assert.equal(add(1, 2), 3);
        
      });
    
    
    it('-4 + 2 should be -2', function() {
        assert.equal(add(-4, 2), -2);
      });
    
    it('-4 * 2 should be -8', function() {
        assert.equal(mul(-4, 2), -8);
      });
})
