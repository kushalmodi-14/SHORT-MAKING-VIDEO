import asyncio
import edge_tts

async def test():
    communicate = edge_tts.Communicate("Redis caching delivers a 200x speedup in Node.js", "en-US-ChristopherNeural")
    words = []
    with open("test_voice.mp3", "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "w": chunk["text"],
                    "start": chunk["offset"] / 10_000_000,
                    "end": (chunk["offset"] + chunk["duration"]) / 10_000_000
                })
    print(f"Generated test_voice.mp3 ({len(words)} words):")
    print(words[:2])

asyncio.run(test())
