from flask import Flask, request, jsonify, render_template
from huggingface_hub import InferenceClient
import json
import time

app = Flask(__name__)

# Hugging Face Inference Client 설정
repo_id = "dohun123/llama2-3b-10epoch"

llm_client = InferenceClient(
    model=repo_id,
    timeout=120,
    token = "MY_HF_TOKEN_KEY"
)

def call_llm(inference_client: InferenceClient, prompt: str):
    time.sleep(1)
    response = inference_client.post(
        json={
            "inputs": prompt,
            "parameters": {"max_new_tokens": 200},
            "task": "text-generation",
        },
    )
    print(response)
    return json.loads(response.decode())[0]["generated_text"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    prompt = data.get("prompt", "")
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    # LLM을 호출하여 응답 생성
    try:
        response_text = call_llm(llm_client, prompt)
        # 질문 부분을 제거하고 답변만 반환
        answer = response_text.replace(prompt, "").strip()
        return jsonify({"response": answer})
    except Exception as e:
        return jsonify({"error": f"Failed to generate response: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
