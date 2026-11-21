import asyncio
import edge_tts

async def main():
    submaker = edge_tts.SubMaker()
    communicate = edge_tts.Communicate("Hello world, this is a test.", "en-US-ChristopherNeural")
    with open("test_sub.mp3", "wb") as file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                file.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                submaker.feed(chunk)
    print("SRT output:\n", submaker.get_srt())

asyncio.run(main())
