
module.exports=(check,timeout=100,maxRepeations=2000)=>{
    return new Promise(async (resolve,reject) => {
    let repeations=1
    let timeoutBlock=false
    if(await check()){return resolve()}
        let checkInterval = setInterval(async () => {
            if (maxRepeations < repeations) { clearInterval(checkInterval);reject()}
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