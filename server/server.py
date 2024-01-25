from flask import Flask, request
from flask_cors import CORS
import os

os.chdir(r"C:\Users\RPKK-2258\XML Redactor\xml_folders")

app = Flask(__name__)
CORS(app)

@app.route('/get_files', methods=['GET'])
def handle_get_request():
    # Получение параметра из запроса
    param_value = request.args.get('param_name')
    # Обработка параметра (в данном случае, просто возвращаем его)
    return  f'The value of "param_name" is: {param_value}'

if __name__ == '__main__':
    app.run(debug=True)
