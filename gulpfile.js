/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/4/13
 **/
const { parallel,series,src } = require('gulp');
const shelljs = require('shelljs');


let oldElectroncount=null;

async function startApp(cb){
    if(oldElectroncount===null) {
        oldElectroncount=getElectronPsCount();
    }
    cb();
    await sleep(20000);
    while (true) {
        currentCount=getElectronPsCount();
        if(currentCount < oldElectroncount+1) {
            console.log(`目前electron数量${currentCount}少于启动时electron数量${oldElectroncount},重新启动启动app`);
            startModule('app');
            await sleep(10000);
        } else {
            console.log(`当前electron数量:${currentCount}`);
        }
      await sleep(3500);
    }
}

function getElectronPsCount(){
    let result =  shelljs.exec("ps | grep 'NODE_ENV=development   electron ./dist/main.js'");
    let count =result.split(/\n/).filter(item=>item.includes('electron ./dist/main.js')).length;
    return count;
}


function sleep(time=1000){
    return new Promise(resolve=>{
        setTimeout(resolve,time);
    })
}


function startMoonUI(cb){
    startModule('moon-ui');
    cb();
}


function startMoonWeb(cb){
    startModule('web');
    cb();
}



function compileMoonSchemas(cb){
    tscWatchModule('moon-schemas');
    cb();
}



function compileJava2ast(cb){
    tscWatchModule('java2ast');
    cb();
}

function compileAst2Java(cb){
    tscWatchModule('ast-to-people');
    cb();
}

function compileCoreBackend(cb){
    tscWatchModule('core-backend');
    cb();
}

function compileCoreFrontend(cb){
    tscWatchModule('core-frontend');
    cb();
}


function compileCore(cb){
    tscWatchModule('core');
    cb();
}

exports.startMoonApp = series(parallel(startMoonUI,compileAst2Java,compileJava2ast,compileMoonSchemas,compileCoreBackend,compileCoreFrontend,compileCore),startApp);
exports.startMoonOldApp = series(parallel(startMoonWeb,compileAst2Java,compileJava2ast,compileMoonSchemas,compileCoreBackend,compileCoreFrontend,compileCore),startApp);
// exports.default = series(clean, build);

var typedoc = require("gulp-typedoc");
exports.typedoc = function() {
    return  src(
            ["packages/core-backend/src/**/*.ts"],
            ["packages/core-frontend/src/**/*.ts"]
        )
        .pipe(typedoc({
            module: "commonjs",
            target: "es5",
            out: "docs/",
            name: "My project title"
        }))
        ;
}


function startModule(moduleName,async=true){
    return shelljs.exec(`cd packages/${moduleName} && npm run start`, { async })
}

function buildModule(module,async=true) {
    return shelljs.exec(`cd packages/${module} && npm run build`, { async })
}

function watchModule(module,async=true) {
    return shelljs.exec(`cd packages/${module} && npm run watch`, { async })
}

function tscWatchModule(module,async=true) {
    return shelljs.exec(`cd packages/${module} && tsc -w`, { async });
}
