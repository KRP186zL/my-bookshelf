const keyBook = "KEY_BOOK";
const daftarBuku = [];
const RENDER_BOOK = "renderBuku";

document.addEventListener("DOMContentLoaded", () => {
  if (checkWebStorage()) {
    getDataFromStorage();
    document.dispatchEvent(new Event(RENDER_BOOK));
  } else {
    alert("Browser anda tidak mendukung Web Storage!");
  }
});

document.getElementById("form-buku").addEventListener("submit", (event) => {
  addBuku();
  event.preventDefault();
});

function addBuku() {
  const id = generateId();
  const inputJudul = document.getElementById("input-judul").value;
  const inputPenulis = document.getElementById("input-penulis").value;
  const inputTahun = document.getElementById("input-tahun").value;
  const inputBaca = document.getElementById("cek-baca").checked;
  const dataBuku = createDataBuku(
    id,
    inputJudul,
    inputPenulis,
    parseInt(inputTahun),
    !!inputBaca
  );
  daftarBuku.push(dataBuku);
  clearInput();
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveDataToWebStorage();
}

function isChecked() {
  const isReading = document.getElementById("cek-baca");
  if (isReading.checked) {
    return true;
  } else {
    return false;
  }
}

function getDataFromStorage() {
  const getData = localStorage.getItem(keyBook);
  let data = JSON.parse(getData);

  if (data !== null) {
    for (buku of data) {
      daftarBuku.push(buku);
    }
  }
}

function checkWebStorage() {
  if (typeof Storage !== undefined) {
    return true;
  }
  return false;
}

function generateId() {
  return +new Date();
}

function createDataBuku(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_BOOK, () => {
  const isReadingText = document.getElementById("is-reading");

  isReadingText.innerHTML = "<b>belum dibaca</b>";

  document.getElementById("cek-baca").addEventListener("change", () => {
    if (isChecked()) {
      isReadingText.innerHTML = "<b>sudah dibaca</b>";
    } else {
      isReadingText.innerHTML = "<b>belum dibaca</b>";
    }
  });

  const dibaca = document.getElementById("wrapper-sudah-buku");
  const belumDibaca = document.getElementById("wrapper-belum-buku");

  dibaca.innerHTML = "";
  belumDibaca.innerHTML = "";

  const myBook = daftarBuku;

  for (const buku of myBook) {
    if (buku.isComplete) {
      dibaca.append(createELementBuku(buku));
    } else {
      belumDibaca.append(createELementBuku(buku));
    }
  }
});

document.getElementById("cari-judul-buku").addEventListener("change", () => {
  const inputCari = document.getElementById("cari-judul-buku");
  const hasilCari = document.getElementById("hasil-cari");
  hasilCari.style.marginTop = "20px";
  const cariBelumBaca = document.getElementById("cari-belum-baca");
  const cariSudahBaca = document.getElementById("cari-sudah-baca");
  cariBelumBaca.innerHTML = "";
  cariSudahBaca.innerHTML = "";

  const belumBaca = document.getElementById("belum-dibaca");
  const sudahBaca = document.getElementById("sudah-dibaca");
  belumBaca.setAttribute("hidden", true);
  sudahBaca.setAttribute("hidden", true);

  if (inputCari.value === "") {
    belumBaca.removeAttribute("hidden");
    sudahBaca.removeAttribute("hidden");
    const getHeading = document.querySelectorAll("#hasil-cari h1");
    getHeading.forEach((heading) => {
      heading.setAttribute("hidden", true);
    });
    document.dispatchEvent(new Event(RENDER_BOOK));
    return;
  }

  daftarBuku.forEach((buku) => {
    if (
      buku.title.toLowerCase().includes(inputCari.value) ||
      buku.author.toLowerCase().includes(inputCari.value)
    ) {
      if (buku.isComplete) {
        cariSudahBaca.append(createELementBuku(buku));
      } else {
        cariBelumBaca.append(createELementBuku(buku));
      }
    }
  });

  const getHeading = document.querySelectorAll("#hasil-cari h1");
  getHeading.forEach((heading) => {
    heading.removeAttribute("hidden");
  });
});

function clearInput() {
  const checkboxInput = document.getElementById("cek-baca");
  const allInput = document.getElementsByTagName("input");
  for (const input of allInput) {
    input.value = "";
  }

  checkboxInput.checked = false;
}

function saveDataToWebStorage() {
  if (checkWebStorage()) {
    localStorage.setItem(keyBook, JSON.stringify(daftarBuku));
    document.dispatchEvent(new Event(RENDER_BOOK));
  }
}

function createELementBuku(data) {
  const { id, title, author, year, isComplete } = data;

  const containerBuku = document.createElement("div");
  containerBuku.classList.add("container-buku");

  const headingJudul = document.createElement("h2");
  headingJudul.innerText = `${title}`;

  const paragrafPenulis = document.createElement("p");
  paragrafPenulis.innerText = `Penulis : ${author}`;

  const paragrafTahun = document.createElement("p");
  paragrafTahun.innerText = `Terbit : ${year}`;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");

  const buttonChange = document.createElement("button");
  buttonChange.classList.add("button");
  buttonChange.classList.add("button-changeStatus");

  const buttonDelete = document.createElement("button");
  buttonDelete.innerText = "Hapus Buku";
  buttonDelete.classList.add("button");
  buttonDelete.classList.add("button-hapus");

  const buttonUpdate = document.createElement("button");
  buttonUpdate.innerText = "Update Buku";
  buttonUpdate.classList.add("button");
  buttonUpdate.classList.add("button-update");

  if (isComplete) {
    buttonChange.innerHTML = "Tandai <b>belum dibaca</b>";
    buttonChange.addEventListener("click", () => {
      updateStatusBook(id);
    });
  } else {
    buttonChange.innerHTML = "Tandai <b>sudah dibaca</b>";
    buttonChange.addEventListener("click", () => {
      updateStatusBook(id);
    });
  }

  buttonDelete.addEventListener("click", () => {
    deleteBook(id);
  });

  buttonUpdate.addEventListener("click", () => {
    updateBook(id);
  });

  buttonWrapper.append(buttonChange, buttonUpdate, buttonDelete);
  containerBuku.append(
    headingJudul,
    paragrafPenulis,
    paragrafTahun,
    buttonWrapper
  );
  containerBuku.setAttribute("id", `buku-${id}`);

  return containerBuku;
}

function updateBook(id) {
  const buku = searchId(id);
  findBuku = searchIndex(id);
  const buttonTambah = document.getElementById("tambah");
  buttonTambah.setAttribute("hidden", true);
  const buttonEdit = document.getElementById("edit");
  buttonEdit.removeAttribute("hidden");

  const inputJudul = document.getElementById("input-judul");
  const inputPenulis = document.getElementById("input-penulis");
  const inputTahun = document.getElementById("input-tahun");
  const inputBaca = document.getElementById("cek-baca");

  inputJudul.value = buku.title;
  inputPenulis.value = buku.author;
  inputTahun.value = buku.year;
  inputBaca.checked = buku.isComplete;

  document.getElementById("edit").addEventListener("click", () => {
    buku.title = inputJudul.value;
    buku.author = inputPenulis.value;
    buku.year = inputTahun.value;
    buku.isComplete = inputBaca.checked;
    daftarBuku.splice(findBuku, 1, buku);
    saveDataToWebStorage();
  });
}

function searchId(id) {
  for (buku of daftarBuku) {
    if (buku.id === id) {
      return buku;
    }
  }
  return null;
}

function updateStatusBook(id) {
  const buku = searchId(id);

  if (buku.isComplete) {
    buku.isComplete = false;
    saveDataToWebStorage();
  } else {
    buku.isComplete = true;
    saveDataToWebStorage();
  }
}

function deleteBook(id) {
  const buku = searchIndex(id);

  if (buku === -1) return;

  daftarBuku.splice(buku, 1);
  saveDataToWebStorage();
}

function searchIndex(id) {
  for (const index in daftarBuku) {
    if (daftarBuku[index].id === id) {
      return index;
    }
  }

  return -1;
}
