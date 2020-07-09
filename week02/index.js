

var token = [];
const start = char => {
    if(char === '1' 
        || char === '2'
        || char === '3'
        || char === '4'
        || char === '5'
        || char === '6'
        || char === '7'
        || char === '8'
        || char === '9'
        || char === '0'
    ) {
        token.push(char);
        return inNumber;   
    }
    if(char === '+' 
        || char === '-'
        || char === '*'
        || char === '/'
    ) {
        emmitToken(char, char);
        return start
    }
    if(char === ' ') {
        return start;
    }
    if(char === '\r' 
        || char === '\n'
    ) {
        return start;
    }
}
const inNumber = char => {
    if(char === '1' 
        || char === '2'
        || char === '3'
        || char === '4'
        || char === '5'
        || char === '6'
        || char === '7'
        || char === '8'
        || char === '9'
        || char === '0'
    ) {
        token.push(char);
        return inNumber;
    } else {
        emmitToken("Number", token.join(""));
        token = [];
        return start(char); // put back char
    }
}
function emmitToken(type, value) {
    console.log(value);
}

var input = "1024 + 2 * 256"

var state = start;

for(var c of input.split(''))
    state = state(c);

state(Symbol('EOF'))
