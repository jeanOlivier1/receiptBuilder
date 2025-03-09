import { GoogleGenerativeAI } from "@google/generative-ai";

export const instruction = `
You are a model specialized in extracting data from receipt images. Your task is to analyze the provided image, extract the relevant information, and then structure the result in a precise JSON format. Follow these steps:

Extracting data:

Find and extract the receipt date in YYYY-MM-DD format.
Retrieve the list of purchased items as an array of strings.
Identify the total amount as a decimal number.
Detect the company name or institution that issued the receipt.
Handling missing information:

If any of this information is missing from the image, assign it the value null to avoid errors.
Receipt classification:

Ask the user to choose the appropriate category between "Meals" and "Accommodation".
Use the user's choice to set the value of the "category" field in the final JSON.
Generating the final JSON:

Organize the extracted information in the following  dictionnary python structure:
{
"category": "Meals",
"data": {
"date_recu": "YYYY-MM-DD" or null,
"items_purchased": ["ExampleItem1", "ExampleItem2"] or null,
"total_amount": Number or null,
"devise": "Euros", "dollar", "XOF" or null,
"company": "CompanyName" or null
}
}
Respect the struction don't put backtips , commentary or extra informations, output the result only strictly in the same dictionnary structure.
`;

export const analyzeImage = async (imageData: string, category: string) => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg",
        },
      },
      instruction,
    ]);

    const text = result.response.text();
    // Using regex to remove the backticks and 'json' part
    let cleanedText = text.replace(/```json|```/g,'')
    console.log(cleanedText)
    const parsedData = JSON.parse(cleanedText);
    parsedData.category = category; // Override with user-selected category
    return parsedData;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};