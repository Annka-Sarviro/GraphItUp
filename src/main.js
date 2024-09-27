import { displayPreview } from "./scripts/preview";

const fileInput = document.getElementById("fileInput");
const dropbox = document.getElementById("dropbox");
const fileWrap = document.getElementById("file_wrap");
const loader = document.getElementById("loader");
const preview = document.getElementById("preview");
const openChartPageBtn = document.querySelector(".open-chart-page-btn");

const supportedExtensions = ["csv", "xls", "xlsx", "json"];

function setupFileInputHandler() {
  fileInput.addEventListener("change", e => {
    const file = e.target.files[0];

    handleFile(file);
  });
}

function showLoader() {
  loader.style.display = "block";
  dropbox.classList.add("blurred");
}

function hideLoader() {
  loader.style.display = "none";
  dropbox.classList.remove("blurred");
}

function handleFile(file) {
  fileWrap.innerHTML = "";
  preview.innerHTML = "";

  if (!file) {
    fileWrap.innerHTML = `<p style="color: red;">Виберіть інший файл.</p>`;
    openChartPageBtn.classList.add("open-chart-page-btn-disabled");
    return;
  }

  const extension = file.name.split(".").pop().toLowerCase();

  if (!supportedExtensions.includes(extension)) {
    fileWrap.innerHTML = `<p style="color: red;">Виберіть інший файл: формат ${extension} не підтримується.</p>`;
    openChartPageBtn.classList.add("open-chart-page-btn-disabled");
    return;
  }

  showLoader();
  let iconName = getIconName(extension);

  fileWrap.innerHTML = `
    <span class="material-icons file-icons">${iconName}</span>
    <p>Вибрано файл: ${file.name}</p>
  `;

  openChartPageBtn.classList.remove("open-chart-page-btn-disabled");

  setTimeout(() => {
    hideLoader();
    displayPreview(file, preview);
  }, 500);
}

function getIconName(extension) {
  switch (extension) {
    case "csv":
      return "description";
    case "xls":
    case "xlsx":
      return "table_chart";
    case "json":
      return "code";
    default:
      return "attach_file";
  }
}

// Drag-and-drop
dropbox.addEventListener("dragover", e => {
  e.preventDefault();
  dropbox.classList.add("dragover");
});

dropbox.addEventListener("dragleave", () => {
  dropbox.classList.remove("dragover");
});

dropbox.addEventListener("drop", e => {
  e.preventDefault();
  dropbox.classList.remove("dragover");

  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files;
    handleFile(file);
  } else {
    handleFile(null);
  }
});

setupFileInputHandler();
