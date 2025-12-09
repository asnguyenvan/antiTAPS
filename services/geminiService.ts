import { GoogleGenAI, Chat, LiveServerMessage, Modality } from "@google/genai";
import { ParkingLot } from '../types';

let chatSession: Chat | null = null;

const getSystemInstruction = (lots: ParkingLot[]) => {
  const lotsData = JSON.stringify(lots.map(l => ({
    name: l.name,
    permitTypes: l.permitTypes.join(', '),
    weekdayLifted: l.weekdayLifted,
    weekendLifted: l.weekendLifted,
    enforcement: l.enforcementHours,
    schedule: l.schedule
  })));

  return `You are "antiTAPS Bot", a rebellious, anti-establishment parking assistant for the University of Florida (UF). TAPS (Transportation and Parking Services) is the "enemy" because they give out tickets.
  
  Your goal is to help students RECLAIM their campus by finding parking spots where they won't get ticketed.
  
  Here is the database of parking lots (Sectors) and their ENFORCEMENT SCHEDULES:
  ${lotsData}

  Rules:
  1. Speak in a slightly rebellious, "hacker" tone. Use terms like "safe zone," "surveillance," "lifted," and "avoid capture."
  2. If a user asks where to park, check the current time against the 'weekdayLifted' or 'weekendLifted' times. Prioritize finding "No Decal" zones.
  3. If a lot is listed as CLOSED in the schedule, WARN the user to stay away.
  4. Be helpful but cool.
  5. Never hallucinate fake spots. Stick to the data.
  6. If asked about "Garage 5", remember it's closed on weekends.
  `;
};

// Text Chat (Legacy)
export const initChat = async (lots: ParkingLot[]) => {
  if (!process.env.API_KEY) return null;
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: getSystemInstruction(lots) },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to init chat", error);
    return null;
  }
};

export const sendMessage = async (message: string, currentLots: ParkingLot[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const freshChat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction: getSystemInstruction(currentLots) }
  });

  try {
    const response = await freshChat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message", error);
    return "Connection jammed. The system is fighting back. Try again.";
  }
};

/* --- LIVE API UTILS --- */

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Float32 audio from AudioContext to PCM Int16 for Gemini
function float32ToInt16(float32Array: Float32Array): Int16Array {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16Array;
}

export class GeminiLiveClient {
  private ai: GoogleGenAI;
  private audioContext: AudioContext | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private currentStream: MediaStream | null = null;
  private nextStartTime = 0;
  private isConnected = false;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async connect(lots: ParkingLot[], onDisconnect: () => void) {
    if (this.isConnected) return;
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    
    // Connect to Gemini Live
    const sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: async () => {
          this.isConnected = true;
          console.log("Gemini Live Connected");
          
          // Setup Input Audio (Mic)
          try {
             this.currentStream = await navigator.mediaDevices.getUserMedia({ audio: true });
             this.inputSource = inputCtx.createMediaStreamSource(this.currentStream);
             this.processor = inputCtx.createScriptProcessor(4096, 1, 1);
             
             this.processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                // Downsample or process if needed, assuming 16k context handles rate
                const pcmInt16 = float32ToInt16(inputData);
                const pcmData = new Uint8Array(pcmInt16.buffer);
                const base64Data = arrayBufferToBase64(pcmData);

                sessionPromise.then(session => {
                    session.sendRealtimeInput({
                        media: {
                            mimeType: 'audio/pcm;rate=16000',
                            data: base64Data
                        }
                    });
                });
             };

             this.inputSource.connect(this.processor);
             this.processor.connect(inputCtx.destination);

          } catch (err) {
             console.error("Mic Error:", err);
             onDisconnect();
          }
        },
        onmessage: async (msg: LiveServerMessage) => {
          // Handle Audio Output
          const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData && this.audioContext) {
             const rawBytes = base64ToUint8Array(audioData);
             
             // Decode PCM directly since it's raw from Gemini
             // Manual decoding of Int16 PCM to float32 for AudioContext
             const dataInt16 = new Int16Array(rawBytes.buffer);
             const channelData = new Float32Array(dataInt16.length);
             for(let i=0; i<dataInt16.length; i++) {
                 channelData[i] = dataInt16[i] / 32768.0;
             }
             
             const audioBuffer = this.audioContext.createBuffer(1, channelData.length, 24000);
             audioBuffer.copyToChannel(channelData, 0);

             const source = this.audioContext.createBufferSource();
             source.buffer = audioBuffer;
             source.connect(this.audioContext.destination);
             
             const now = this.audioContext.currentTime;
             // Ensure smooth playback sequence
             const start = Math.max(now, this.nextStartTime);
             source.start(start);
             this.nextStartTime = start + audioBuffer.duration;
          }

          if (msg.serverContent?.interrupted) {
             this.nextStartTime = 0; 
             // Ideally cancel current nodes, but for simple demo just resetting timer helps
          }
        },
        onclose: () => {
          console.log("Gemini Live Closed");
          this.disconnect();
          onDisconnect();
        },
        onerror: (err) => {
          console.error("Gemini Live Error", err);
          this.disconnect();
          onDisconnect();
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: getSystemInstruction(lots),
        speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });

    return sessionPromise;
  }

  disconnect() {
    this.isConnected = false;
    if (this.currentStream) {
        this.currentStream.getTracks().forEach(t => t.stop());
        this.currentStream = null;
    }
    if (this.processor) {
        this.processor.disconnect();
        this.processor = null;
    }
    if (this.inputSource) {
        this.inputSource.disconnect();
        this.inputSource = null;
    }
    if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
    }
  }
}