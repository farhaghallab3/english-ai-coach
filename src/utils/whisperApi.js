// src/utils/whisperApi.js
export async function transcribeAudio(audioBlob, exampleText) {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.wav");
  formData.append("example", exampleText);

  const res = await fetch("https://farha31.pythonanywhere.com/api/transcribe/", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to transcribe audio");

  const data = await res.json();
  return data; // contains { user_text, feedback }
}
