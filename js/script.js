// Function to load and format XML file
function loadAndFormatXml() {
  const xmlFileInput = document.getElementById("xmlFileInput");
  const xmlEditor = document.getElementById("xmlEditor");

  const file = xmlFileInput.files[0];
  const reader = new FileReader();
  rowNum = 1;
  if (file) {
    const allowedExtensions = [".xml"]; // You can specify allowed extensions here
    const fileName = file.name;
    const fileExtension = fileName.slice(
      ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
    );

    if (allowedExtensions.includes("." + fileExtension.toLowerCase())) {
      // The file extension is allowed, continue processing
      reader.onload = function (event) {
        const unformattedXml = event.target.result;

        // Format XML
        const formattedXml = formatXml(unformattedXml);

        // Set the formatted XML in the editor
        xmlEditor.value = formattedXml;

        // Preview the formatted XML
        previewXml();
      };

      reader.readAsText(file);
    } else {
      // The file extension is not allowed, display an error message
      alert(
        "Invalid file extension. Only files with extensions: " +
          allowedExtensions.join(", ") +
          " are allowed."
      );
      // Reset the input value so the user can select another file
      xmlFileInput.value = "";
    }
  }
}

// Function to format XML
function formatXml(text) {
  let shift = 0; // num of tabs
  let ar = text
    .replace(/>\s{0,}</g, "><")
    .replace(/</g, "~::~<")
    .replace(/xmlns\:/g, "~::~xmlns:")
    .replace(/xmlns\=/g, "~::~xmlns=")
    .split("~::~"); // get list of all xml tags
  let str = '<?xml version="1.0" encoding="UTF-8"?>' + "\n";
  let closeFlag = false; // flag for checking open XML tags
  for (let i = 0; i < ar.length; i++) {
    if (ar[i]) {
      if (ar[i][0] + ar[i][1] == "<?") {
      } else if (ar[i][0] + ar[i][1] == "</") {
        shift--;
        if (closeFlag) {
          if (str.slice(-1) == ">") {
            str += "Insert your value";
          }
        } else {
          str += "\t".repeat(shift);
        }
        str += ar[i] + "\n";
        closeFlag = false;
      } else if (ar[i][0] == "<") {
        if (closeFlag) {
          str += "\n";
        }
        str += "\t".repeat(shift) + ar[i];
        shift++;
        closeFlag = true;
      }
    }
  }

  return str[0] == "\n" ? str.slice(1) : str;
}

// Function for preparing all data for saving
function prepareXml() {
  const xmlEditor = document.getElementById("xmlEditor");
  const preview = document.getElementById("preview");
  const allXmlElements = preview.querySelectorAll(".xml-element");
  const filteredXmlElements = Array.from(allXmlElements).filter((xmlElement) =>
    xmlElement.children[2].classList.contains("xml-input")
  );
  const parser = new DOMParser();
  let xmlDoc = parser.parseFromString(xmlEditor.value, "text/xml");
  xmlDoc.childNodes[0] = recursiveSaveInformation(
    xmlDoc.childNodes[0],
    filteredXmlElements
  );
  xmlEditor.value = new XMLSerializer().serializeToString(xmlDoc);
}

function recursiveSaveInformation(xmlParent, xmlElements) {
  if (xmlParent.children.length === 0) {
    const xmlValue = xmlElements.shift().children[2].value;
    xmlParent.innerHTML = xmlValue;
    return xmlParent;
  } else {
    for (let i = 0; i < xmlParent.children.length; i++) {
      xmlParent.children[i] = recursiveSaveInformation(
        xmlParent.children[i],
        xmlElements
      );
    }
  }
}

// Function to save an XML file
function saveXml() {
  prepareXml();
  const xmlEditor = document.getElementById("xmlEditor");

  // Get the content of the editor and save it as an XML file
  const xmlData = xmlEditor.value;

  // Check that all fields are filled
  if (xmlData.includes("Insert your value")) {
    alert("Fill all fields!");
  } else {
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

    // Add event listeners to each <textarea> element
    textareaElements.forEach((textareaElement) => {
      // Auto-clear for empty fields
      textareaElement.addEventListener("focus", function () {
        const textareaValue = textareaElement.value;
        if (textareaValue == "Insert your value") {
          textareaElement.value = "";
          textareaElement.classList.remove("important");
        }
      });
      // Auto-fill warning for empty fields
      textareaElement.addEventListener("focusout", function () {
        const textareaValue = textareaElement.value;
        if (textareaValue == "") {
          textareaElement.value = "Insert your value";
          textareaElement.classList.add("important");
        }
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
    if (text4XMLelement.value == "Insert your value") {
      text4XMLelement.classList.add("important");
    }
    elementPreview.appendChild(text4XMLelement);
    elementPreview.appendChild(document.createElement("br"));
  }

  container.appendChild(elementPreview);

  for (let i = 0; i < element.children.length; i++) {
    createPreviewElements(elementPreview, element.children[i]);
  }
}

// Add a change event listener to the file input
document
  .getElementById("xmlFileInput")
  .addEventListener("change", loadAndFormatXml);
