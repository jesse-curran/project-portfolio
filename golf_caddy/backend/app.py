from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

client = OpenAI(api_key='sk-proj-1Zatllzfe1VSwU0JGSKbT3BlbkFJ9KofsMF67lK3bHqn8vj0')

app = Flask(__name__)
CORS(app)

# In-memory storage for pre-round info
pre_round_info = {}

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Golf Caddy API"})

@app.route('/save_pre_round_info', methods=['POST'])
def save_pre_round_info():
    data = request.json
    user_id = data.get('user_id')
    pre_round_info[user_id] = data
    return jsonify({"message": "Pre-round info saved successfully"}), 201

@app.route('/get_pre_round_info/<user_id>', methods=['GET'])
def get_pre_round_info(user_id):
    data = pre_round_info.get(user_id, {})
    return jsonify(data), 200

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_id = data.get('user_id')
    user_input = data.get('input')

    # Fetch pre-round info for the user
    user_info = pre_round_info.get(user_id, {})

    # Prepare the prompt for GPT-3.5-turbo
    messages = [
        {"role": "system", "content": "You are a helpful golf caddy."},
        {"role": "user", "content": f"Player Info: {user_info}"},
        {"role": "user", "content": f"User Input: {user_input}"}
    ]

    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=messages,
    max_tokens=150)

    return jsonify({"response": response.choices[0].message.content.strip()}), 200


if __name__ == '__main__':
    app.run(debug=True)
