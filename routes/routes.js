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
      'wav': {
        'age': ageSinceMod('C:/OptInt/testit.wav', Date.now())
      },
      'op1': {
        'age': ageSinceMod('C:/OptInt/testit.op1', Date.now())
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

// Load the homepage
router.get('/', (req, res) => {
  
  const fileMetrics = generateFileMetrics(req);

  res.render('index', fileMetrics);

});

// Handle post then load the homepage
router.post('/', async (req, res) => {
  // File upload
  // github.com/richardgirges/express-fileupload/tree/master/example#basic-file-upload    
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
  else{ // Execute program
    // Main menu option #2, klrint.exe (pass one)
    if(req.body.menu == 1){
      //const commands = ['','','','','','','','','s','1','4',req.body.xvf[0],req.body.xvf[1],req.body.xvf[2],req.body.xvf[3],'','',''];
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
  }  
  // Wait 2 seconds for fs changes
  await sleep(2000);

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