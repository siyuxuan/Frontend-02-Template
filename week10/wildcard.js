function find(source, pattern){
    let startcount = 0;
    for (let i =0; i< pattern.length; i++){
        if(pattern[i] === "*"){
            startcount ++;
        }
            
    } 

    if(startcount === 0){
        for (let i = 0;i<pattern.length; i++){
            if(pattern[i] !== source[i] && pattern[i] !== "?")
                 return false;
        }
        return ;
    }

    let i = 0;
    let lastIndex = 0;
    for(i = 0; pattern[i] !== "*"; i++){
        if(pattern[i] !== source[i] && pattern[i] !== "?")
             return false;
    }

    lastIndex = i;
 
    for(let p =0; p < startcount -1; p++){
        i++;
        let subPattern = "";
        while(pattern[i] !== "*"){
            subPattern += pattern[i];
            i++;
        }

        let reg = new RegExp(subPattern.replace(/\?/g, "[\\S\\s]") ,"g");
        reg.lastIndex = lastIndex;

     //    console.log(reg.exec(soure));
     if(!reg.exec(source))
        return false;

     lastIndex = reg.lastIndex;
    }
 //    最后的*
    for(let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== "*"; j++) {
         if(pattern[pattern.length -j] !== source[source.length - j] && pattern[pattern.length - j ] !== "?")
         return false;
    }
    return true;   
}

console.log(find("abcabcabxcaac","a*b*bx*c"));
