// Function to load an XML file
function loadXml() {
  const xmlFileInput = document.getElementById("xmlFileInput");
  const xmlEditor = document.getElementById("xmlEditor");

  const file = xmlFileInput.files[0];
  const reader = new FileReader();
  rowNum = 1;

  reader.onload = function (event) {
    xmlEditor.value = event.target.result;
    previewXml();
  };

  reader.readAsText(file);
}

// Function to save an XML file
function saveXml() {
  const xmlEditor = document.getElementById("xmlEditor");

  // Get the content of the editor and save it as an XML file
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

// Function to preview XML content
function previewXml() {
  const xmlEditor = document.getElementById("xmlEditor");
  const preview = document.getElementById("preview");

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlEditor.value, "text/xml");
    // Clear the preview before updating it
    preview.innerHTML = "";
    // Create preview elements based on xmlDoc
    createPreviewElements(preview, xmlDoc.documentElement);

    // Get all <textarea> elements inside Preview
    const textareaElements = preview.querySelectorAll("textarea");

    // Add an 'input' event listener to each <textarea> element
    textareaElements.forEach((textareaElement) => {
      textareaElement.addEventListener("input", function () {
        // Get the value of the <textarea> element
        const textareaValue = textareaElement.value;

        // Get the 'data-row' attribute
        let row = textareaElement.dataset.row;

        // Get the current value of xmlEditor
        const xmlEditorValue = xmlEditor.value;

        // Split xmlEditor into lines
        let xmlEditorLines = xmlEditorValue.split("\n");

        let rowCounter = 0;

        for (i = 0; i < xmlEditorLines.length; i++) {
          if (
            (xmlEditorLines[i].match(/\</g) || []).length === 2 &&
            (xmlEditorLines[i].match(/\>/g) || []).length === 2
          ) {
            rowCounter++;
          }
          if (row == rowCounter) {
            opentag = xmlEditorLines[i].split(">")[0];
            closetag = xmlEditorLines[i].split("<")[2];
            xmlEditorLines[i] = `${opentag}>${textareaValue}<${closetag}`;
          }
        }

        // Update xmlEditor with the modified lines
        xmlEditor.value = xmlEditorLines.join("\n");
      });
    });

    // Update the content of <textarea>
    xmlEditor.value = new XMLSerializer().serializeToString(xmlDoc);
  } catch (error) {
    console.log(error);
    preview.innerHTML = "Invalid XML. Please check your input.";
  }
}

// Add an 'input' event listener for xmlEditor
const xmlEditor = document.getElementById("xmlEditor");
xmlEditor.addEventListener("input", function () {
  // When xmlEditor changes, call previewXml() again
  previewXml();
});

function createPreviewElements(container, element) {
  const elementPreview = document.createElement("div");
  elementPreview.className = "xml-element";

  // Create a name tag
  const xmlName = document.createElement("a");
  xmlName.className = "xml-label";
  xmlName.textContent = `<${element.nodeName}>`;
  // Add a click event to hide children
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

// Event listeners
document.getElementById("xmlFileInput").addEventListener("change", loadXml);
document.getElementById("xmlEditor").addEventListener("input", previewXml);
document.getElementById("saveButton").addEventListener("click", saveXml);

// Call the previewXml() function when the page loads
window.onload = function () {
  previewXml();
};
