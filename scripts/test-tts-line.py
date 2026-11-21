import asyncio
import edge_tts
import subprocess
import json

def probe_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=noprint_wrappers=1:nokey=1", path],
                         capture_output=True, text=True).stdout
    return float(out.strip())

async def _gen(text, voice, out_path):
    communicate = edge_tts.Communicate(text, voice)
    with open(out_path, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])

text = "Your API is drowning in slow DB calls, let's fix that fast!"
voice = "en-US-ChristopherNeural"
out_path = "test_clip.mp3"

asyncio.run(_gen(text, voice, out_path))
dur = probe_duration(out_path)
words_list = text.split()
weights = [max(2, len(w)) + 1.6 for w in words_list]
total_w = sum(weights) or 1
cur = 0.0
words = []
for w, weight in zip(words_list, weights):
    d = (weight / total_w) * dur
    words.append({"w": w, "start": round(cur, 3), "end": round(cur + d, 3)})
    cur += d

print(f"Generated {out_path}: duration={dur:.2f}s, words={len(words)}")
print(words[:3])
