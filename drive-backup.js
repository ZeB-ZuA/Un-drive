
const express = require('express');
const multer = require('multer');
const ftp = require('ftp');
const app = express();
const port = 3000;

const ftpOptions = {
  host: '192.168.1.111',
  port: 21,
  user: 'sua',
  password: '1936',
};
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/list/:foldername?', (req, res) => {
  const foldername = req.params.foldername || '';
  const client = new ftp();

  client.on('ready', () => {
    client.list('/home/sua/FTP/' + foldername, (err, list) => {
      if (err) {
        console.error('Error al listar archivos en el servidor FTP:', err);
        res.status(500).send('Error al listar archivos en el servidor FTP');
      } else {
        console.log('Archivos en el servidor FTP:', list);
        res.json(list);
      }
      client.end();
    });
  });

  client.on('error', (err) => {
    console.error('Error al conectar con el servidor FTP:', err);
    res.status(500).send('Error al conectar con el servidor FTP');
  });
  client.connect(ftpOptions);
});



app.post('/upload', upload.single('file'), (req, res) => {
  const fileBuffer = req.file.buffer;
  const foldername = req.body.folder; // Carpeta donde se guardará el archivo
  const client = new ftp();
  console.log('Conectando al servidor FTP...');
  client.on('ready', () => {
    console.log('Conexión al servidor FTP exitosa.');
    client.put(fileBuffer, '/home/sua/FTP/' + foldername + '/' + req.file.originalname, (err) => {
      if (err) {
        console.error('Error al subir el archivo al servidor FTP:', err);
        res.status(500).send('Error al subir el archivo al servidor FTP');
      } else {
        console.log('Archivo subido con éxito.');
        res.send('Archivo subido con éxito');
      }
      client.end();
    });
  });

  client.on('error', (err) => {
    console.error('Error al conectar con el servidor FTP:', err);
    res.status(500).send('Error al conectar with the FTP server');
  });
  client.connect(ftpOptions);
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const client = new ftp();

  client.on('ready', () => {
    console.log('Conexión al servidor FTP exitosa.');
    client.get('/home/sua/FTP/' + filename, (err, stream) => {
      if (err) {
        console.error('Error al descargar el archivo del servidor FTP:', err);
        res.status(500).send('Error al descargar el archivo del servidor FTP');
      } else {
        console.log('Descarga de archivo iniciada.');
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
        stream.pipe(res);
      }
      client.end();
    });
  });

  client.on('error', (err) => {
    console.error('Error al conectar con el servidor FTP:', err);
    res.status(500).send('Error al conectar con el servidor FTP');
  });

  client.connect(ftpOptions);
});
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const client = new ftp();

  client.on('ready', () => {
    client.delete('/home/sua/FTP/' + filename, (err) => {
      if (err) {
        console.error('Error al eliminar el archivo:', err);
        res.status(500).send('Error al eliminar el archivo');
      } else {
        console.log('Archivo eliminado con éxito.');
        res.send('Archivo eliminado con éxito');
      }
      client.end();
    });
  });

  client.on('error', (err) => {
    console.error('Error al conectar con el servidor FTP:', err);
    res.status(500).send('Error al conectar con el servidor FTP');
  });

  client.connect(ftpOptions);
});
app.post('/create/:foldername', (req, res) => {
  const foldername = req.params.foldername;
  const client = new ftp();

  client.on('ready', () => {
    client.mkdir('/home/sua/FTP/' + foldername, true, (err) => {
      if (err) {
        console.error('Error al crear la carpeta:', err);
        res.status(500).send('Error al crear la carpeta');
      } else {
        console.log('Carpeta creada con éxito.');
        res.send('Carpeta creada con éxito');
      }
      client.end();
    });
  });

  client.on('error', (err) => {
    console.error('Error al conectar con el servidor FTP:', err);
    res.status(500).send('Error al conectar con el servidor FTP');
  });

  client.connect(ftpOptions);
});






app.listen(port, () => {
  console.log(`Servidor escuchando por el puerto: ${port}`);
});







