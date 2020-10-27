var assert = require('assert');

import {parseHTML} from "../src/parser.js"

describe("parse html", function(){
    // a
    it('<a></a>', function() { 
        let tree = parseHTML('<a></a>');
        console.log(tree)
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0)
      });
    
    //   属性相关的
      it('<a href="https://github.com/siyuxuan/Frontend-02-Template/tree/master/week17"></a>', function() { 
        let tree = parseHTML('<a href="https://github.com/siyuxuan/Frontend-02-Template/tree/master/week17"></a>');
        console.log(tree)
        // assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0)
      });
  
})
