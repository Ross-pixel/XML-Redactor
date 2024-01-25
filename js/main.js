function sendGetRequest() {
  // Задаем URL запроса с параметром
  let url = "http://127.0.0.1:5000/get_files?param_name=All";

  // Создаем объект XMLHttpRequest
  let xhr = new XMLHttpRequest();

  // Настраиваем обработчик события завершения запроса
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // Обработка ответа сервера
      if (xhr.status === 200) {
        alert(xhr.responseText);
      } else {
        alert("Произошла ошибка при выполнении запроса.");
      }
    }
  };

  // Открываем GET-запрос
  xhr.open("GET", url, true);

  // Отправляем запрос
  xhr.send();
}

// Вызываем функцию при загрузке страницы (или в ответ на событие)
window.onload = sendGetRequest;
