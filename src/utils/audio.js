// src/utils/audio.js
export async function recordOneSecondExample(duration = 4000) {
  // simple helper to record and return base64 audio (webm/ogg)
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("No microphone support");
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  return new Promise((resolve, reject) => {
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onerror = reject;
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: chunks[0].type });
      // convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1]; // remove data:...;base64,
        resolve({ base64: base64data, blob });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
      // stop tracks
      stream.getTracks().forEach((t) => t.stop());
    };

    recorder.start();
    setTimeout(() => recorder.stop(), duration);
  });
}
