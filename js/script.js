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
    // Очистите предварительный просмотр перед обновлением
    preview.innerHTML = "";
    // Создайте элементы предварительного просмотра на основе xmlDoc
    createPreviewElements(preview, xmlDoc.documentElement);

    // Обновите содержимое <textarea>
    xmlEditor.value = new XMLSerializer().serializeToString(xmlDoc);
  } catch (error) {
    console.log(error);
    preview.innerHTML = "Invalid XML. Please check your input.";
  }
}

function createPreviewElements(container, element) {
  const elementPreview = document.createElement("div");
  elementPreview.className = "xml-element";
  elementPreview.textContent = `<${element.nodeName}>`;

  const addButton = document.createElement("button");
  addButton.textContent = "Add Child";
  addButton.addEventListener("click", function () {
    addXmlElement(element);
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Element";
  deleteButton.addEventListener("click", function () {
    deleteXmlElement(element);
  });

  elementPreview.appendChild(document.createElement("br"));

  if (element.children.length == 0) {
    const text4XMLelement = document.createElement("textarea");
    text4XMLelement.className = "xml-input";
    text4XMLelement.value = element.innerHTML;
    elementPreview.appendChild(text4XMLelement);
    elementPreview.appendChild(document.createElement("br"));
  }

  elementPreview.appendChild(addButton);
  elementPreview.appendChild(deleteButton);
  container.appendChild(elementPreview);

  for (let i = 0; i < element.children.length; i++) {
    createPreviewElements(container, element.children[i]);
  }
}

function hideElement(element) {
  for (let i = 0; i < element.children.length; i++) {
    element.children[i].classList.add("hide");
  }
}

// Слушатели событий
document.getElementById("xmlFileInput").addEventListener("change", loadXml);
document.getElementById("xmlEditor").addEventListener("input", previewXml);
document.getElementById("saveButton").addEventListener("click", saveXml);

// Вызов функции предварительного просмотра при загрузке страницы
window.onload = function () {
  previewXml();
};
