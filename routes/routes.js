import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import nw from 'node-windows';

const router = express.Router();
router.use(fileUpload());

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

function ageSinceMod(filePath, now){

  const then = fs.statSync(filePath).mtimeMs;
  const diff = (now - then) / 1000;

  if (diff < 60) // < 1 minute
    return `file last modified ${Math.trunc(diff)} seconds ago`;
  else if (diff < (60 * 60)) // < 1 hour
    return `file last modified ${Math.trunc(diff / 60)} minutes ago`;
  else if (diff < (60 * 60 * 24)) // < 1 day
    return `file last modified ${Math.trunc(diff / (60 * 60))} hours ago`;
  else
    return `file last modified ${Math.trunc(diff / (60 * 60 * 24))} days ago`;
}

function generateFileMetrics(req){
  const fileMetrics = new Object(
    {
      'menu': req.body.menu ? req.body.menu : '',
      'shp': {
        'age': ageSinceMod('C:/OptInt/testit.shp', Date.now()),
        'uploaded': req.files?.shp ? true : false
      },
      'stg': {
        'age': ageSinceMod('C:/OptInt/testit.stg', Date.now()),
        'uploaded': req.files?.stg ? true : false
      },
      'vvf': {
        'age': ageSinceMod('C:/OptInt/testit.vvf', Date.now()),
        'content': fs.readFileSync('C:/OptInt/testit.vvf', 'utf8').split('\r\n'),
        'uploaded': req.files?.vvf ? true : false
      },
      'xvf': {
        'age': ageSinceMod('C:/OptInt/testit.xvf', Date.now()),
        'content': fs.readFileSync('C:/OptInt/testit.xvf', 'utf8').split('\r\n'),
        'uploaded': req.files?.xvf ? true : false
      },
      'hlg': {
        'age': ageSinceMod('C:/OptInt/testit.hlg', Date.now())
      },
      'wav': {
        'age': ageSinceMod('C:/OptInt/testit.wav', Date.now())
      },
      'op1': {
        'age': ageSinceMod('C:/OptInt/testit.op1', Date.now())
      },
      'op2': {
        'age': ageSinceMod('C:/OptInt/testit.op2', Date.now())
      },
      'op3': {
        'age': ageSinceMod('C:/OptInt/testit.op3', Date.now())
      },
      'op4': {
        'age': ageSinceMod('C:/OptInt/testit.op4', Date.now())
      },
      'pl1': {
        'age': ageSinceMod('C:/OptInt/testit.pl1', Date.now())
      },
      'pl2': {
        'age': ageSinceMod('C:/OptInt/testit.pl2', Date.now())
      },
      'pl3': {
        'age': ageSinceMod('C:/OptInt/testit.pl3', Date.now())
      },
      'pl4': {
        'age': ageSinceMod('C:/OptInt/testit.pl4', Date.now())
      },
      'pl5': {
        'age': ageSinceMod('C:/OptInt/testit.pl5', Date.now())
      },
      'FORT41' : {
        'age': ageSinceMod('C:/OptInt/FORT41', Date.now())
      },
      'out': {
        'age': ageSinceMod('C:/OptInt/terminal-output.txt', Date.now())
      }
    }
  );
  return fileMetrics;
}

// Render homepage
router.get('/', (req, res) => {
  
  const fileMetrics = generateFileMetrics(req);

  res.render('index', fileMetrics);

});

// Upload file then render homepage
// github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload
router.post('/upload', async (req, res) => {
  if (req.files && Object.keys(req.files).length > 0){
    for (const key in req.files){
      const file = req.files[key];
      const filename = file.name.toUpperCase();
      if (filename === `testit.${key}`.toUpperCase()){
        const uploadPath = `C:/OptInt/${filename}`;
        file.mv(uploadPath);
      }
    }
  }
  // Wait 2 seconds for fs changes
  await sleep(2000);

  const fileMetrics = generateFileMetrics(req);

  res.render('index', fileMetrics);
  res.redi
});

// Run a process then render homepage
router.post('/run', async (req, res) => {

  // Main menu option #2, klrint.exe (pass one)
  if(req.body.menu == 1){
    
    const commands = ['baseline','testit','testit.op1','y','testit.stg','y','1','testit.xvf','s','1','4',req.body.xvf[0],req.body.xvf[1],req.body.xvf[2],req.body.xvf[3],'r','testit.wav','y'];

    const ws = fs.createWriteStream('C:/OptInt/terminal-input.txt');
    commands.forEach( (value) => {
      ws.write(`${value}\r\n`);
    });
    ws.end();

    // Event logger
    var log = new nw.EventLogger('OptInt');
    log.info('OptInt information log message.', 1);

  }
  else if(req.body.menu == 2){
  
    let commands = ['testit', 'testit.op2', 'y', 'testit.stg', 'y', 'testit.wav', 'testit.shp', 'y', 'testit.hlg', 'y', 'k'];

    commands = commands.concat(req.body.sequence);

    console.log(commands);

    // const ws = fs.createWriteStream('C:/OptInt/terminal-input.txt');
    // commands.forEach( (value) => {
    //   ws.write(`${value}\r\n`);
    // });
    // ws.end();

    // // Event logger
    // var log = new nw.EventLogger('OptInt');
    // log.info('OptInt information log message.', 2);
  }
  else if(req.body.menu == 3){

    const commands = ['baseline', 'testit', 'testit.op3', 'y', 'testit.shp', 'y', '1', 'testit.xvf', 's', '1', '13', req.body.xvf[0], req.body.xvf[1], req.body.xvf[2], req.body.xvf[3], req.body.xvf[4], req.body.xvf[5], req.body.xvf[6], req.body.xvf[7], req.body.xvf[8], req.body.xvf[9], req.body.xvf[10], req.body.xvf[11], req.body.xvf[12], 'r', '1', 's', '22', '42', req.body.xvf[13], req.body.xvf[14], req.body.xvf[15], req.body.xvf[16], req.body.xvf[17], req.body.xvf[18], req.body.xvf[19], req.body.xvf[20], req.body.xvf[21], req.body.xvf[22], req.body.xvf[23], req.body.xvf[24], req.body.xvf[25], req.body.xvf[26], req.body.xvf[27], req.body.xvf[28], req.body.xvf[29], req.body.xvf[30], req.body.xvf[31], req.body.xvf[32], req.body.xvf[33], 'r', '1', 'testit.vvf', 's', '1', '50', req.body.vvf[0], req.body.vvf[1], req.body.vvf[2], req.body.vvf[3], req.body.vvf[4], req.body.vvf[5], req.body.vvf[6], req.body.vvf[7], req.body.vvf[8], req.body.vvf[9], req.body.vvf[10], req.body.vvf[11], req.body.vvf[12], req.body.vvf[13], req.body.vvf[14], req.body.vvf[15], req.body.vvf[16], req.body.vvf[17], req.body.vvf[18], req.body.vvf[19], req.body.vvf[20], req.body.vvf[21], req.body.vvf[22], req.body.vvf[23], req.body.vvf[24], req.body.vvf[25], req.body.vvf[26], req.body.vvf[27], req.body.vvf[28], req.body.vvf[29], req.body.vvf[30], req.body.vvf[31], req.body.vvf[32], req.body.vvf[33], req.body.vvf[34], req.body.vvf[35], req.body.vvf[36], req.body.vvf[37], req.body.vvf[38], req.body.vvf[39], req.body.vvf[40], req.body.vvf[41], req.body.vvf[42], req.body.vvf[43], req.body.vvf[44], req.body.vvf[45], req.body.vvf[46], req.body.vvf[47], req.body.vvf[48], req.body.vvf[49], 'r', 'testit.op4', 'y', 'testit.pl1', 'y', 'testit.pl2', 'y', 'testit.pl3', 'y', 'testit.pl4', 'y', 'testit.pl5', 'y'];

    const ws = fs.createWriteStream('C:/OptInt/terminal-input.txt');
    commands.forEach( (value) => {
      ws.write(`${value}\r\n`);
    });
    ws.end();

    // Event logger
    var log = new nw.EventLogger('OptInt');
    log.info('OptInt information log message.', 3);

  }
  // 5 seconds not long enough
  await sleep(7000);

  const fileMetrics = generateFileMetrics(req);

  res.render('index', fileMetrics);
});

// Download a file
router.get('/download/:filename', (req, res) => {
  const options = {headers: {'Content-Disposition': `attachment; filename=${req.params.filename.toUpperCase()}`, 'Content-Type': 'text/plain'}};

  // Generate .ssv from .wav
  if(req.params.filename === 'testit.wav.ssv'){
    let wav = fs.readFileSync('C:/OptInt/testit.wav', 'utf8');
    wav = wav.replace(/(E(\+|-)\d{2})/g,'$1 ');

    fs.writeFileSync(`C:/OptInt/${req.params.filename}`, wav);
  } 

  res.sendFile(`C:/OptInt/${req.params.filename}`, options, (err) => { if (err) next(err); });
});

// View a file
router.get('/view/:filename', (req, res) => {
  const options = {headers: {'Content-Disposition': 'inline', 'Content-Type': 'text/plain'}};

  res.sendFile(`C:/OptInt/${req.params.filename}`, options, (err) => { if (err) next(err); });
});

export {router};