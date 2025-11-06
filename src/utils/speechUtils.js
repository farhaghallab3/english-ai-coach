// src/utils/speechUtils.js

export async function recordAudio(duration = 3) {
  // Check browser support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser doesn't support audio recording.");
    return null;
  }

  // Ask for mic permission
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks = [];

  return new Promise((resolve) => {
    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      resolve(audioBlob);
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), duration * 1000);
  });
}
