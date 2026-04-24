# AI Subject Explainer

An automated, scalable system that utilizes Large Language Models (LLMs) to provide customized academic explanations based on the student's proficiency level.

## 🚀 Overview

Personalized education often requires significant human effort to adapt complex concepts to individual student comprehension levels. This project introduces the **AI Subject Explainer**, an automated tutor that combines the ubiquity of Google Forms and Email with the power of Generative AI. 

By filling out a simple Google Form, users can request explanations tailored to their academic level (School to Postgraduate) and desired format (Simple, Detailed, or Example-Based), receiving a beautifully formatted HTML email in seconds.

## ✨ Features

- **High Personalization**: Explanations are tailored to exact academic levels rather than providing generic definitions.
- **Dynamic Prompt Engineering**: Abstracts the complexity of prompt writing away from the user.
- **Format Options**: Generates simple overviews, detailed breakdowns, or example-based learning depending on user preference.
- **Rich Text Delivery**: Uses HTML formatting inside custom-styled emails for excellent readability.
- **Serverless & Zero-Cost Hosting**: Utilizes Google Apps Script (free) and OpenRouter's free-tier AI models, eliminating hosting and server maintenance costs.

## 🛠️ Tech Stack

- **Frontend/Input Interface**: Google Forms
- **Database/Storage**: Google Sheets
- **Backend Environment**: Google Apps Script (JavaScript)
- **Artificial Intelligence**: OpenRouter API (`openai/gpt-oss-120b:free` model)
- **Output/Delivery**: Google MailApp Service (HTML & CSS)

## ⚙️ How It Works

1. **User Input**: A user submits a Google Form with their email, topic, academic level, and preferred explanation type.
2. **Trigger**: The form submission saves to Google Sheets, triggering the `onFormSubmit` event in the Google Apps Script.
3. **Prompt Engineering**: The script extracts the data and constructs a highly specific prompt for the AI based on predefined instructional rules.
4. **AI Generation**: The script makes an API call to OpenRouter to generate the explanation enforcing strict HTML constraints.
5. **Delivery**: The response is parsed, wrapped in a branded HTML/CSS email template, and dispatched to the user.

## 🚀 Setup Instructions

1. **Create a Google Form**:
   Create a new Google Form with the following fields (in order):
   - Topic Name (Short answer)
   - Level of Study (Dropdown: `School`, `Under Graduate`, `Post Graduate`)
   - Type of Help (Dropdown: `Simple Explanation`, `Detailed Explanation`, `Example Based`)
   - Email Address (Short answer or automatically collect emails)

2. **Connect to Google Sheets**:
   In the Form's Responses tab, click "Link to Sheets" to create a new spreadsheet.

3. **Add the Google Apps Script**:
   - Open the linked Google Sheet.
   - Go to **Extensions > Apps Script**.
   - Copy the contents of `Code.gs` from this repository and paste it into the editor.

4. **Configure API Key**:
   - Get a free API key from [OpenRouter](https://openrouter.ai/keys).
   - Paste the key in the `OPENROUTER_API_KEY` variable at the top of `Code.gs`.

5. **Set up the Trigger**:
   - In the Apps Script editor, go to the **Triggers** menu (clock icon on the left).
   - Click **Add Trigger**.
   - Choose function to run: `sendExplanation`
   - Select event source: `From spreadsheet`
   - Select event type: `On form submit`
   - Save the trigger and grant the necessary permissions.

## 📄 License

This project is open-source and available for educational and personal use.
