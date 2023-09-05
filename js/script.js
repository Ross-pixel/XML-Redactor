// Функция для загрузки XML файла
function loadXml() {
  const xmlFileInput = document.getElementById("xmlFileInput");
  const xmlEditor = document.getElementById("xmlEditor");

  const file = xmlFileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    xmlEditor.value = event.target.result;
    previewXml();
  };

  reader.readAsText(file);
}

// Функция для сохранения XML файла
function saveXml() {
  const xmlEditor = document.getElementById("xmlEditor");

  // Получите содержимое редактора и сохраните его как XML файл
  const xmlData = xmlEditor.value;
  const blob = new Blob([xmlData], { type: "text/xml" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "edited-website.xml";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Функция для предварительного просмотра XML содержимого
function previewXml() {
  const xmlEditor = document.getElementById("xmlEditor");
  const preview = document.getElementById("preview");

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlEditor.value, "text/xml");
    // Здесь можно реализовать предварительный просмотр на основе xmlDoc
    // Например, вы можете создать элементы и добавить их в preview.
    preview.innerHTML = "Preview will be displayed here.";
  } catch (error) {
    preview.innerHTML = "Invalid XML. Please check your input.";
  }
}

// Слушатели событий
document.getElementById("xmlFileInput").addEventListener("change", loadXml);
document.getElementById("xmlEditor").addEventListener("input", previewXml);
document.getElementById("saveButton").addEventListener("click", saveXml);
