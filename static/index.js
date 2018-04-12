const express = require('express');
const upload = require('multer')({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs');
const port = 8080;

let  app = express();

app.set('port', port);
// index.html, index.js放在static文件夹中
app.use(express.static(path.join(__dirname, 'static')));

app.get('/index', (req, res) => {
  res.sendfile('index.html');
});

app.get('/test', (req, res)=>{
  res.sendfile('test.html')
})

app.get('/jquery.js', (req, res)=>{
  res.sendfile('jquery.js')
})

// 单文件
// app.post('/upload', upload.single('file'), (req, res) => {
//   // 没有附带文件
//   if (!req.file) {
//     res.json({ ok: false });
//     return;
//   }

//   // 输出文件信息
//   console.log('====================================================');
//   console.log('fieldname: ' + req.file.fieldname);
//   console.log('originalname: ' + req.file.originalname);
//   console.log('encoding: ' + req.file.encoding);
//   console.log('mimetype: ' + req.file.mimetype);
//   console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB');
//   console.log('destination: ' + req.file.destination);
//   console.log('filename: ' + req.file.filename);
//   console.log('path: ' + req.file.path);

//   // 重命名文件
//   let oldPath = path.join(__dirname, req.file.path);
//   let newPath = path.join(__dirname, 'uploads/' + req.file.originalname);
//   fs.rename(oldPath, newPath, (err) => {
//     if (err) {
//       res.json({ ok: false });
//       console.log(err);
//     } else {
//       res.json({ ok: true });
//     }
//   });
// });


// 多文件
app.post('/upload', upload.array('files'), (req, res) => {
  // 没有附带文件
  if (!req.files) {
    res.json({ ok: false });
    return;
  }
  // let promiseArr = []
  // req.files.forEach((n)=>{
  //   // 输出文件信息
  //   console.log('====================================================');
  //   console.log('fieldname: ' + n.fieldname);
  //   console.log('originalname: ' + n.originalname);
  //   console.log('encoding: ' + n.encoding);
  //   console.log('mimetype: ' + n.mimetype);
  //   console.log('size: ' + (n.size / 1024).toFixed(2) + 'KB');
  //   console.log('destination: ' + n.destination);
  //   console.log('filename: ' + n.filename);
  //   console.log('path: ' + n.path);

  //   // 重命名文件
  //   let oldPath = path.join(__dirname, n.path);
  //   let newPath = path.join(__dirname, 'uploads/' + n.originalname);

  //   let promise = new Promise((resolve, reject)=>{
  //     fs.rename(oldPath, newPath, (err)=>{
  //       if(err){
  //         reject({ok: false})
  //       }else{
  //         resolve({ok: true})
  //       }
  //     })
  //   })
  //   promiseArr.push(promise)
  // })
  // Promise.all(promiseArr).then(res=>{
  //   res.json(res)
  // }).catch(err=>{
  //   res.json(err)
  // })

  let arr = req.files.map(n => {
    // 输出文件信息
    console.log('====================================================');
    console.log('fieldname: ' + n.fieldname);
    console.log('originalname: ' + n.originalname);
    console.log('encoding: ' + n.encoding);
    console.log('mimetype: ' + n.mimetype);
    console.log('size: ' + (n.size / 1024).toFixed(2) + 'KB');
    console.log('destination: ' + n.destination);
    console.log('filename: ' + n.filename);
    console.log('path: ' + n.path);

    // 重命名文件
    let oldPath = path.join(__dirname, n.path);
    let newPath = path.join(__dirname, 'uploads/' + n.originalname);

    return new Promise((resolve, reject)=>{
      fs.rename(oldPath, newPath, (err)=>{
        if(err){
          reject({ok: false})
        }else{
          resolve()
        }
      })
    })
  });

  Promise.all(arr).then(data=>{
    res.json({ok: true})
  }).catch(err=>{
    res.json(err)
  })
});


app.listen(port, () => {
  console.log("[Server] localhost:" + port);
});