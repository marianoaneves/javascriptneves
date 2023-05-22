const imgCarro = document.getElementById("imgCarro");
const container = document.querySelector("div#container");
const inputSearch = document.querySelector("input#inputSearch");
const carro = recuperarCarro();
const totalCarro = document.querySelector("span");
const productos = [];
const URL = "js/productos.json";

function filtroDeArticulos(valor) {
  let resultado = productos.filter((articulo) =>
    articulo.tipo.toLowerCase().includes(valor.toLowerCase())
  );
  if (resultado.length > 0) {
    cargarProductos(resultado);
  }
}

function retornoDeCard(articulo) {
  return `<div class="card">
            <div class="card-image">${articulo.foto}</div>
            <div class="card-name">${articulo.tipo}</div>
            <div class="card-price">$ ${articulo.precio}</div>
            <div class="card-button">
                <button class="button button-outline button-add" id="${articulo.numProd}" title="Agregar al carrito">Agregar</button>
            </div>
        </div>`;
}

function cargarProductos(array) {
  if (container) {
    container.innerHTML = "";
    array.forEach((articulo) => {
      container.innerHTML += retornoDeCard(articulo);
    });
    botonAgregar();
  }
}

if (inputSearch) {
  inputSearch.addEventListener("keyup", (e) => {
    filtroDeArticulos(e.target.value);
  });
}

function botonAgregar() {
  const botones = document.querySelectorAll(
    "button.button.button-outline.button-add"
  );
  for (const boton of botones) {
    boton.addEventListener("click", () => {
      let resultado = productos.find(
        (articulo) => articulo.numProd === parseInt(boton.id)
      );
      carro.push(resultado);
      console.table(carro);
      guardarCarro();

      Swal.fire({
        title: "✅ Producto agregado al carrito!",
        width: 500,
        padding: "3 rem",
        color: "rgba(0, 151, 239)",
        background: "#fff ",
        confirmButtonColor: "rgb(255, 124, 124)",
      });
    });
  }
}

function guardarCarro() {
  localStorage.setItem("carroProductos", JSON.stringify(carro));
}

function recuperarCarro() {
  return JSON.parse(localStorage.getItem("carroProductos")) || [];
}
mostrarProductos();
cargarProductos(productos);
recuperarCarro();

function mostrarProductos() {
  console.log(carro.length);

  if (document.querySelector("tbody")) {
    let cuadroitem = document.querySelector("tbody");
    if (carro.length > 0) {
      let html = "";
      for (let item of carro) {
        html += "<tr>";
        html += `<td class="imgTable">${item.foto}</td>`;
        html += `<td class="textTable">${item.tipo}</td>`;
        html += `<td class="textTable">${"$" + item.precio}</td>`;
        // html += `<td><img src="img/trash141.png" width="60px"/></td>`;
        html += `<td><button class="botonEliminar" id="${item.numProd}">Eliminar</button></td>`;
        html += "</tr>";
        cuadroitem.innerHTML = html;
      }
      eliminarItem();
    } else {
      cuadroitem.innerHTML = "";
    }
    calcularTotalCarro();
  }
}

function calcularTotalCarro() {
  let sumaCarro = 0;
  for (let item of carro) {
    sumaCarro += item.precio;
  }
  totalCarro.innerHTML = sumaCarro;
}

function eliminarItem() {
  const botones = document.querySelectorAll("button.botonEliminar");
  if (botones) {
    for (let boton of botones) {
      boton.addEventListener("click", (e) => {
        let indice = carro.findIndex(
          (item) => item.numProd === parseInt(e.target.id)
        );
        if (indice > -1) {
          carro.splice(indice, 1);
          guardarCarro();
          mostrarProductos();
        }
      });
    }
  } else {
    mostrarProductos();
  }
}

const btnCompra = document.getElementById("btnCompra");

if (btnCompra) {
  btnCompra.addEventListener("click", () => {
    Swal.fire({
      title: "Gracias por tu compra!🙌",
      confirmButtonText: "Aceptar",
      width: 500,
      padding: "3 rem",
      color: "rgba(0, 151, 239)",
      background: "#fff ",
      confirmButtonColor: "rgb(255, 124, 124)",
    });
    carro.length = 0;
    localStorage.removeItem("carroProductos");
    mostrarProductos();
  });
}

const cargaError = () => {
  return `<div class="card-error">
              <h2>Ocurrió un error</h2>
              <h3>No se pudo cargar el producto</h3>
              </div>`;
};

fetch(URL)
  .then((respuesta) => respuesta.json())
  .then((data) => productos.push(...data))
  .then(() => cargarProductos(productos))
  .catch((error) => (container.innerHTML = cargaError()));
