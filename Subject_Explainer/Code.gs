// ======================================
// CONFIG
// ======================================
var OPENROUTER_API_KEY = "@@@";


// ======================================
// MAIN FUNCTION — triggered on form submit
// ======================================
function sendExplanation(e) {

  var responses = e.values;

  // ⚠️ Column order based on your Google Sheet:
  // responses[0] = Timestamp
  // responses[1] = Topic Name       (free text — any topic the user types)
  // responses[2] = Level of Study   (School / Under Graduate / Post Graduate)
  // responses[3] = Type of Help     (Simple Explanation / Detailed Explanation / Example Based)
  // responses[4] = Email Address

  var email    = responses[4].trim();
  var topic    = responses[1].trim();
  var level    = responses[2].trim();
  var helpType = responses[3].trim();

  // Validation
  if (!email || !topic || !level || !helpType) {
    Logger.log("Missing fields — email: " + email + ", topic: " + topic + ", level: " + level + ", helpType: " + helpType);
    return;
  }

  //prompt and call OpenRouter
  var prompt      = buildPrompt(topic, level, helpType);
  var explanation  = callOpenRouter(prompt);

  // Build and send the HTML email
  var htmlEmail = buildEmail(topic, level, helpType, explanation);

  MailApp.sendEmail({
    to:       email,
    subject:  "💻 Your " + helpType + " on: " + topic + " (" + level + ")",
    htmlBody: htmlEmail
  });

  Logger.log("Email sent to: " + email + " | Topic: " + topic);
}


// ======================================
// PROMPT FOR AI MODEL
// ======================================
function buildPrompt(topic, level, helpType) {

  var levelContext = {
    "School":         "The student is in school (age 12-16). Use very simple language, real-life analogies, short sentences, and zero jargon. Relate to everyday objects.",
    "Under Graduate": "The student is an undergraduate. Use proper technical terms, structured concepts, and college-level examples. Include how and why it works.",
    "Post Graduate":  "The student is a postgraduate researcher. Use advanced terminology, formal definitions, complexity analysis, theoretical depth, and system-level applications."
  };

  var helpContext = {
    "Simple Explanation":   "Give a clear, concise overview. Use bullet points. Keep it short and easy to grasp. Cover just the core idea.",
    "Detailed Explanation": "Give a thorough explanation. Cover: definition, components, how it works, types (if any), and real-world applications. Use structured sections.",
    "Example Based":        "Explain using real-life analogies, practical examples, and code snippets where relevant. Make it feel tangible and easy to understand."
  };

  var levelDesc = levelContext[level]   || "Explain clearly for a general audience.";
  var helpDesc  = helpContext[helpType] || "Explain the topic clearly.";

  var prompt =
    "You are an expert tutor. A student has asked about the following topic.\n\n"
    + "Topic: \"" + topic + "\"\n"
    + "Student Level: " + level + "\n"
    + "Level Instructions: " + levelDesc + "\n"
    + "Type of Help: " + helpType + "\n"
    + "Help Instructions: " + helpDesc + "\n\n"
    + "FORMAT RULES (strictly follow):\n"
    + "- Respond ONLY in clean HTML\n"
    + "- Use ONLY these tags: <h3>, <ul>, <li>, <b>\n"
    + "- Do NOT use markdown, asterisks, code fences, or plain text outside tags\n"
    + "- Do NOT add inline styles or CSS\n"
    + "- Do NOT start with phrases like 'Sure!', 'Here is', 'Of course' etc.\n"
    + "- Start directly with a <h3> heading\n"
    + "- Keep the response under 350 words\n"
    + "- If the topic is unclear or not a real subject, politely say so inside <p> tags\n";

  return prompt;
}


// ======================================
// CALL OPENROUTER API
// ======================================
function callOpenRouter(prompt) {

  var url = "https://openrouter.ai/api/v1/chat/completions";

  var payload = {
    "model": "openai/gpt-oss-120b:free",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful tutor who explains any topic clearly based on the student's level. Always respond in clean HTML using only <h3>, <ul>, <li>, <b> tags. Never use markdown."
      },
      {
        "role": "user",
        "content": prompt
      }
    ],
    "max_tokens": 900,
    "temperature": 0.7
  };

  var options = {
    "method":      "post",
    "contentType": "application/json",
    "headers": {
      "Authorization": "Bearer " + OPENROUTER_API_KEY,
      "HTTP-Referer":  "https://ai-subject-explainer.app",
      "X-Title":       "AI Subject Explainer"
    },
    "payload":           JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json     = JSON.parse(response.getContentText());

    // Handle API-level errors
    if (json.error) {
      Logger.log("OpenRouter Error: " + JSON.stringify(json.error));
      var errMsg = json.error.message || JSON.stringify(json.error);
      return '<p style="color:red;">⚠️ OpenRouter Error: ' + errMsg + '</p>';
    }

    // Extract the generated text (OpenAI-compatible response format)
    if (!json.choices || json.choices.length === 0) {
      Logger.log("OpenRouter returned no choices.");
      return '<p style="color:red;">⚠️ OpenRouter returned an empty response. Please try again.</p>';
    }

    return json.choices[0].message.content;

  } catch (err) {
    Logger.log("API call failed: " + err.message);
    return '<p style="color:red;">⚠️ Could not reach OpenRouter. Please try again later.<br>Error: ' + err.message + '</p>';
  }
}


// ======================================
// BUILD HTML EMAIL
// ======================================
function buildEmail(topic, level, helpType, explanation) {

  return '<!DOCTYPE html><html><head><style>'
    + 'body { font-family: Arial, sans-serif; color: #333; line-height: 1.7; margin: 0; padding: 0; background-color: #f4f4f4; }'
    + '.container { max-width: 620px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }'
    + '.header { background: linear-gradient(135deg, #1A73E8, #0D47A1); color: #ffffff; padding: 25px 30px; }'
    + '.header h1 { margin: 0; font-size: 22px; }'
    + '.header p { margin: 6px 0 0; font-size: 13px; opacity: 0.85; }'
    + '.badge { display: inline-block; background: rgba(255,255,255,0.2); border-radius: 20px; padding: 3px 12px; font-size: 12px; margin-top: 8px; margin-right: 5px; }'
    + '.body-content { padding: 25px 30px; }'
    + '.body-content h3 { color: #1A73E8; margin-top: 20px; }'
    + '.body-content ul { padding-left: 20px; }'
    + '.body-content ul li { margin-bottom: 8px; }'
    + '.footer { background: #f9f9f9; padding: 15px 30px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; }'
    + '</style></head><body>'
    + '<div class="container">'
    + '<div class="header">'
    + '<h1>💻 ' + topic + '</h1>'
    + '<span class="badge">' + level + '</span>'
    + '<span class="badge">' + helpType + '</span>'
    + '</div>'
    + '<div class="body-content">'
    + explanation
    + '</div>'
    + '<div class="footer">'
    + '✨ Powered by OpenRouter (GPT-OSS 120B) + AI Subject Explainer<br>'
    + 'This response was AI-generated based on your form submission.'
    + '</div>'
    + '</div>'
    + '</body></html>';
}
