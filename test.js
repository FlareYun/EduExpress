
const imageUrl = "https://cdn.britannica.com/61/93061-050-99147DCE/Statue-of-Liberty-Island-New-York-Bay.jpg";

async function AIAnswer(message, imageUrl) {
  const url = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-11B-Vision-Instruct/v1/chat/completions";
  const apiKey = "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";
  imageUrl="https://media.discordapp.net/attachments/651181429119778834/1298869939444252703/045f0e12_edit_img_twitter_post_image_file_16516765_1463507599_twitter_1.webp?ex=671b2265&is=6719d0e5&hm=ada499c84ad59c949ba3fe983898faf30aa88837dfe027d530e231960fbb8d69&=&format=webp"

  const data =  [{"type": "image_url", "image_url": {"url": imageUrl}}, { type: "text", text: message }] ;

  if (imageUrl){
      data.push({"type": "image_url", "image_url": {"url": imageUrl}});
  }

  const response = await fetch(url, {
      reactNative: { textStreaming: true },
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: data }],
      max_tokens: 500,
      stream: false,
    }),
  });

  console.log("Fetch Response:", response);

  if (!response.body) {
    console.error("Response body is null or undefined.");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let done = false;
  let result = "";

  while (!done) {
    const { value, done: isDone } = await reader.read();
    done = isDone;

    if (value) {
      const chunk = decoder.decode(value, { stream: true });

      console.log(chunk);

      result += JSON.parse(chunk)["choices"][0]["message"]["content"];
    }
  }

  return result;
}
  
  AIAnswer("1234");
  