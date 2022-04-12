
module.exports=(check,timeout=100)=>{
return new Promise(resolve=>{
    let timeoutBlock=false
let checkInterval=setInterval(async ()=>{
    if(timeoutBlock){return}
    timeoutBlock=true
    let result=await check()
    timeoutBlock=false
if(result){
    clearInterval(checkInterval)
resolve()
}
},timeout)
})
}