from flask import Flask, jsonify, request
import anthropic
import base64
from docx import Document
import datetime
import os
from flask_cors import CORS, cross_origin
 

app = Flask(__name__)

api_key = os.getenv("APIKEY")

# Initialize Anthropics client with your API key
client = anthropic.Anthropic(api_key=api_key)


@app.route('/analyze_image', methods=['GET'])
@cross_origin()
def analyze_image():
    # Read image file and encode it as base64
    image_file = request.args.get('image')
    with open(image_file, "rb") as f:
        image_data = f.read()
    encoded_image_data = base64.b64encode(image_data).decode("utf-8")


    # Create a message to send to the Claude AI model
    message = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": encoded_image_data,  # Use the encoded image data
                        },
                    },
                    {
                        "type": "text",
                        "text": "This image depicts a design for a webpage. Please analyze the design and provide detailed information about the page layout, components, and functionality. Additionally, create detailed user stories (epics or tasks) from a software developer's perspective. Include information about features, interactions, and user flows to guide web development efforts."
                    }
                ],
            }
        ],
    )

    # Extract text from the response
    text_block = message.content[0]
    text = text_block.text

    # Create a new Word document
    doc = Document()

    # Add text to the document
    doc.add_paragraph(text)
    current_time = datetime.datetime.now()
    formatted_time = current_time.strftime("%Y-%m-%d_%H-%M-%S")

    # Save the document to a file
    doc.save(f"output_{formatted_time}.docx")

    return jsonify({"message": text})

if __name__ == '__main__':
    app.run(debug=True)