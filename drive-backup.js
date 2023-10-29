
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

app.get('/list', (req, res) => {
  const client = new ftp();

  client.on('ready', () => {
    console.log('Conexión al servidor FTP exitosa.');
    client.list('/home/sua/FTP', (err, list) => {
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
  const client = new ftp();
  console.log('Conectando al servidor FTP...');
  client.on('ready', () => {
    console.log('Conexión al servidor FTP exitosa.');
    client.put(fileBuffer, '/home/sua/FTP/' + req.file.originalname, (err) => {
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
// Definir una nueva ruta DELETE en tu servidor Express
app.delete('/delete/:filename', (req, res) => {
  // Obtener el nombre del archivo de los parámetros de la ruta
  const filename = req.params.filename;

  // Crear una nueva instancia del cliente FTP
  const client = new ftp();

  // Escuchar el evento 'ready' que se dispara cuando el cliente FTP está listo para enviar comandos
  client.on('ready', () => {
    // Eliminar el archivo del servidor FTP
    client.delete('/home/sua/FTP/' + filename, (err) => {
      // Si hay un error al eliminar el archivo, enviar una respuesta con un código de estado 500
      if (err) {
        console.error('Error al eliminar el archivo:', err);
        res.status(500).send('Error al eliminar el archivo');
      } else {
        // Si no hay errores, enviar una respuesta con un mensaje de éxito
        console.log('Archivo eliminado con éxito.');
        res.send('Archivo eliminado con éxito');
      }
      // Cerrar la conexión FTP
      client.end();
    });
  });

  // Escuchar el evento 'error' que se dispara cuando ocurre un error en la conexión FTP
  client.on('error', (err) => {
    console.error('Error al conectar con el servidor FTP:', err);
    res.status(500).send('Error al conectar con el servidor FTP');
  });

  // Conectar al servidor FTP con las opciones definidas en 'ftpOptions'
  client.connect(ftpOptions);
});







app.listen(port, () => {
  console.log(`Servidor escuchando por el puerto: ${port}`);
});
