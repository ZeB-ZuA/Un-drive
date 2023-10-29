alert("hello world")
function cargarLista() {
  fetch('/list')
    .then((response) => response.json())
    .then((data) => {
      const listaArchivos = document.getElementById('listaArchivos');
      const ul = document.createElement('ul');

      data.forEach((archivo) => {
        const li = document.createElement('li');
        li.textContent = archivo.name;
        ul.appendChild(li);
      });

      listaArchivos.innerHTML = '';
      listaArchivos.appendChild(ul);
    })
    .catch((error) => {
      console.error('Error al cargar la lista de archivos:', error);
    });
}

cargarLista();



// <!DOCTYPE html>
// <html>
// <head>
//   <title>Subir Archivo</title>
//   <link rel="stylesheet" type="text/css" href="style.css">
// </head>
// <body>
//   <h1>Subir Archivo al Servidor FTP</h1>
//   <form action="/upload" method="post" enctype="multipart/form-data">
//     <input type="file" name="file" accept=".txt, .jpg, .png, .pdf">
//     <button type="submit">Subir</button>
//   </form>

//   <div id="listaArchivos"></div>
//   <script type="text/javascript" src="listar.js" ></script>
// </body>

// </html>