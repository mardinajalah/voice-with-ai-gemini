"use client";
import { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const RecordingView = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const voiceToText = useRef<any>(null);
  const startRecording = () => {
    setIsRecording(true);
    voiceToText.current = new window.webkitSpeechRecognition();
    voiceToText.current.onresult = (event: any) => {
      const { transcript } = event.results[0][0];
      fetchVoiceToText(transcript);
    };

    voiceToText.current.start();
  };

  useEffect(() => {
    return () => {
      if (voiceToText.current) {
        voiceToText.current.stop();
      }
    };
  }, []);

  const fetchVoiceToText = async (text: string) => {
    const req = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: text,
      }),
    });
    const res = await req.json();
    speakResponse(res.response || "");
  };

  const speakResponse = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const naturalVoice = voices.find((voice) => voice.name.includes("Google")) || voices[0];
    utterance.voice = naturalVoice;

    synth.speak(utterance);
  };

  const stopRecording = () => {
    if (voiceToText.current) {
      voiceToText.current.stop();
      setIsRecording(false);
    }
  };

  const hendleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div>
      {isRecording ? (
        <button className='bg-red-400 hover:bg-red-500 p-4 rounded-full' onClick={hendleClick}>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-12 h-12' viewBox='0 -960 960 960' fill='#fff'>
            <path d='M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z' />
          </svg>
        </button>
      ) : (
        <button className='bg-blue-400 hover:bg-blue-500 p-4 rounded-full' onClick={hendleClick}>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-12 h-12' viewBox='0 -960 960 960' fill='#fff'>
            <path d='M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z' />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RecordingView;
