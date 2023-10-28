// Importar módulos necesarios
const express = require('express'); // Módulo Express para crear el servidor
const multer = require('multer'); // Módulo Multer para manejar la carga de archivos
const ftp = require('ftp'); // Módulo FTP para interactuar con servidores FTP
const app = express(); // Crear una instancia de la aplicación Express
const port = 3000; // Definir el puerto en el que el servidor escuchará las solicitudes

// Configuración de opciones para la conexión FTP
const ftpOptions = {
  host: '192.168.1.111', // Dirección del servidor FTP
  port: 21, // Puerto para la conexión FTP
  user: 'sua', // Nombre de usuario FTP
  password: '1936', // Contraseña FTP
};

/// Configuramos Multer para almacenar los archivos cargados en la memoria como Buffer objects
const storage = multer.memoryStorage(); // Almacenar archivos en memoria
const upload = multer({ storage: storage });

// Definimos una ruta GET en la raíz ('/') del servidor que envía un archivo HTML al cliente
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta "/list": Responde a solicitudes GET para listar archivos en el servidor FTP
app.get('/list', (req, res) => {
  // Crear una instancia de cliente FTP
  const client = new ftp();

  // Manejar eventos para la conexión FTP
  client.on('ready', () => {
    console.log('Conexión al servidor FTP exitosa.');

    // Definimos una ruta GET en /list que se conecta al servidor FTP 
    // y obtiene una lista de archivos en la carpeta /home/sua/FTP
    client.list('/home/sua/FTP', (err, list) => {
      if (err) {
        console.error('Error al listar archivos en el servidor FTP:', err);
        res.status(500).send('Error al listar archivos en el servidor FTP');
      } else {
        console.log('Archivos en el servidor FTP:', list);
        res.json(list); // Enviar la lista en formato JSON al cliente
      }
      client.end(); // Cerrar la conexión FTP
    });
  });

  client.on('error', (err) => {
    console.error('Error al conectar con el servidor FTP:', err);
    res.status(500).send('Error al conectar con el servidor FTP');
  });

  // Conectar al servidor FTP utilizando las opciones definidas
  client.connect(ftpOptions);
});

// Ruta "/upload": Responde a solicitudes POST para cargar archivos en el servidor FTP
app.post('/upload', upload.single('file'), (req, res) => {
  const fileBuffer = req.file.buffer; // Obtener el archivo cargado en memoria
  const client = new ftp(); // Crear una instancia de cliente FTP

  console.log('Conectando al servidor FTP...');

  // Manejar eventos para la conexión FTP
  client.on('ready', () => {
    console.log('Conexión al servidor FTP exitosa.');

    // Subir el archivo al directorio '/home/sua/FTP' en el servidor FTP
    client.put(fileBuffer, '/home/sua/FTP/' + req.file.originalname, (err) => {
      if (err) {
        console.error('Error al subir el archivo al servidor FTP:', err);
        res.status(500).send('Error al subir el archivo al servidor FTP');
      } else {
        console.log('Archivo subido con éxito.');
        res.send('Archivo subido con éxito');
      }
      client.end(); // Cerrar la conexión FTP
    });
  });

  client.on('error', (err) => {
    console.error('Error al conectar con el servidor FTP:', err);
    res.status(500).send('Error al conectar with the FTP server');
  });

  // Conectar al servidor FTP 
  client.connect(ftpOptions);
});

// Importar Express.js y crear una ruta para descargar archivos
app.get('/download/:filename', (req, res) => {
  // Obtener el nombre del archivo a descargar desde los parámetros de la solicitud
  const filename = req.params.filename;

  // Crear una instancia de un cliente FTP
  const client = new ftp();

  // Manejar el evento 'ready' del cliente FTP (conexión exitosa)
  client.on('ready', () => {
    console.log('Conexión al servidor FTP exitosa.');

    // Intentar obtener el archivo del servidor FTP
    client.get('/home/sua/FTP/' + filename, (err, stream) => {
      if (err) {
        // Mostrar un mensaje de error y responder con un código de estado HTTP 500 en caso de error
        console.error('Error al descargar el archivo del servidor FTP:', err);
        res.status(500).send('Error al descargar el archivo del servidor FTP');
      } else {
        // Iniciar la descarga del archivo
        console.log('Descarga de archivo iniciada.');

        // Configurar la respuesta HTTP para que el navegador interprete la respuesta como una descarga de archivo
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename);

        // Transmitir el contenido del archivo al navegador del usuario
        stream.pipe(res);
      }

      // Cerrar la conexión FTP
      client.end();
    });
  });

  // Manejar el evento 'error' del cliente FTP (error de conexión)
  client.on('error', (err) => {
    // Mostrar un mensaje de error y responder con un código de estado HTTP 500 en caso de error de conexión
    console.error('Error al conectar con el servidor FTP:', err);
    res.status(500).send('Error al conectar con el servidor FTP');
  });

  // Conectar al servidor FTP utilizando las opciones previamente configuradas
  client.connect(ftpOptions);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando por el puerto: ${port}`);
});
