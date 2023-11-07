function cargarLista(foldername = '') {
  fetch('/list/'+ foldername)
    .then((response) => response.json())
    .then((data) => {
      const listaArchivos = document.getElementById("listaArchivos");
      listaArchivos.innerHTML = "";
      data.forEach((archivo) => {
        //create icon to file
        const file = document.createElement("span");
        file.className = "material-symbols-outlined";
        file.textContent = "article"

        const div = document.createElement("div");
        div.className = "file";
        div.textContent = archivo.name;
        if (archivo.type === 'd') {
          div.style.cursor = 'pointer';
          div.addEventListener('click', () => {
            cargarLista(archivo.name);
          });
        }
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => {
          fetch("/delete/" + archivo.name, { method: "DELETE" })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error al eliminar el archivo");
              }
              return response.text();
            })
            .then((message) => {
              console.log(message);
            })
            .catch((error) => {
              console.error(error);
            });
          cargarLista();
        });
        const btnDescargar = document.createElement("button");
        btnDescargar.textContent = "Descargar";
        btnDescargar.addEventListener("click", () => {
          const link = document.createElement("a");
          link.href = "/download/" + archivo.name;
          link.download = archivo.name;
          link.click();
        });

        div.appendChild(file);
        div.appendChild(btnEliminar);
        div.appendChild(btnDescargar);
        
        listaArchivos.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Error al cargar la lista de archivos:", error);
    });
}
cargarLista();

document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe de la forma predeterminada

    const formData = new FormData(this); // Crear un objeto FormData a partir del formulario

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al subir el archivo");
        }
        return response.text();
      })
      .then((message) => {
        console.log(message);
        cargarLista(); // Recargar la lista de archivos después de subir
      })
      .catch((error) => {
        console.error(error);
      });
  });

  
  function crearCarpeta() {
  const nombreCarpeta = document.getElementById('nombreCarpeta').value;

  fetch('/create/' + nombreCarpeta, { method: 'POST' })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al crear la carpeta');
      }
      return response.text();
    })
    .then((message) => {
      console.log(message);
      cargarLista();
    })
    .catch((error) => {
      console.error(error);
    });

    document.getElementById('nombreCarpeta').value = '';
};