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

let rowNum = 1;
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

    // Получите все элементы <textarea> внутри Preview
    const textareaElements = preview.querySelectorAll("textarea");

    // Добавьте слушатель события 'input' к каждому элементу <textarea>
    textareaElements.forEach((textareaElement) => {
      textareaElement.addEventListener("input", function () {
        // Получите значение элемента <textarea>
        const textareaValue = textareaElement.value;

        // Получите атрибут данных data-row
        const row = textareaElement.dataset.row;

        // Получите текущее значение xmlEditor
        const xmlEditorValue = xmlEditor.value;

        // Разделите xmlEditor на строки
        let xmlEditorLines = xmlEditorValue.split("\n");

        let rowCounter = 0;

        for (i = 0; i < xmlEditorLines.length; i++) {
          if (
            (xmlEditorLines[i].match(/\</g) || []).length === 2 &&
            (xmlEditorLines[i].match(/\>/g) || []).length === 2
          ) {
            rowCounter++;
          }
          console.log(row, rowCounter);
          if (row == rowCounter) {
            opentag = xmlEditorLines[i].split(">")[0];
            closetag = xmlEditorLines[i].split("<")[2];
            xmlEditorLines[i] = `${opentag}>${textareaValue}<${closetag}`;
          }
        }

        // Обновите xmlEditor с обновленными строками
        xmlEditor.value = xmlEditorLines.join("\n");
      });
    });

    // Обновите содержимое <textarea>
    xmlEditor.value = new XMLSerializer().serializeToString(xmlDoc);
  } catch (error) {
    console.log(error);
    preview.innerHTML = "Invalid XML. Please check your input.";
  }
}

// Добавьте слушатель события 'input' для xmlEditor
const xmlEditor = document.getElementById("xmlEditor");
xmlEditor.addEventListener("input", function () {
  // При изменении xmlEditor, вызывайте функцию previewXml() снова
  previewXml();
});

function createPreviewElements(container, element) {
  const elementPreview = document.createElement("div");
  elementPreview.className = "xml-element";

  // Create nametag
  const xmlName = document.createElement("a");
  xmlName.className = "xml-label";
  xmlName.textContent = `<${element.nodeName}>`;
  // Add hide children by click
  xmlName.addEventListener("click", function () {
    Array.from(elementPreview.children).forEach((el) => {
      if (el.classList.contains("xml-label")) {
      } else {
        if (el.style.display === "none") {
          el.style.display = "block";
        } else {
          el.style.display = "none";
        }
      }
    });
  });

  elementPreview.appendChild(xmlName);
  elementPreview.appendChild(document.createElement("br"));

  if (element.children.length == 0) {
    const text4XMLelement = document.createElement("textarea");
    text4XMLelement.className = "xml-input";
    text4XMLelement.dataset.row = rowNum;
    rowNum++;
    text4XMLelement.value = element.innerHTML;
    elementPreview.appendChild(text4XMLelement);
    elementPreview.appendChild(document.createElement("br"));
  }

  container.appendChild(elementPreview);

  for (let i = 0; i < element.children.length; i++) {
    createPreviewElements(elementPreview, element.children[i]);
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
