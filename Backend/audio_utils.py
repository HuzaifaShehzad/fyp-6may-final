"""
Audio utility functions, including playback of WAV files.
"""

from typing import Union

import sounddevice as sd
import soundfile as sf


def play_audio(path: Union[str, bytes]) -> None:
    """
    Play the given audio file (WAV recommended).
    """
    print(f"Playing audio: {path}")
    data, samplerate = sf.read(path, always_2d=False)
    sd.play(data, samplerate)
    sd.wait()


__all__ = ["play_audio"]


