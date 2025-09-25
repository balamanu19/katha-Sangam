import React, { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaImage,
  FaVolumeUp,
  FaVideo,
  FaDownload,
} from "react-icons/fa"; // ✅ Added FaDownload
import "./Home.css";
import { GEMINI_API_URL } from "./constant";

const Home = () => {
  const [showStory, setShowStory] = useState(false);
  const [story, setStory] = useState("");
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [imageError, setImageError] = useState("");
  const [audioError, setAudioError] = useState("");
  const [videoError, setVideoError] = useState("");
  const [isReading, setIsReading] = useState(false);

  const [showImage, setShowImage] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const [audioUrl, setAudioUrl] = useState(null); // ✅ Added state for audio
  const [imageUrl, setImageUrl] = useState(null); // ✅ Added state for image
  // Add this state at the top with others
  const [videoUrl, setVideoUrl] = useState(null);

  // Banner rotation
  const bannerImages = [
    "/banner1.jpg",
    "/banner5.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
  ];
  const [currentImage, setCurrentImage] = useState(bannerImages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        (bannerImages.indexOf(currentImage) + 1) % bannerImages.length;
      setCurrentImage(bannerImages[nextIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, [currentImage]);
  //speak story ---------------
  const speakStory = (text) => {
    if (!text) return;

    if (isReading) {
      // If already reading, stop it
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      // Start reading
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 1;
      msg.pitch = 1;
      msg.onend = () => setIsReading(false); // reset when finished
      window.speechSynthesis.speak(msg);
      setIsReading(true);
    }
  };

  //--------------------------------
  // Generate story using Gemini API
  const generateStory = async () => {
    if (!userInput.trim()) return alert("Enter a mythological theme!");

    setLoading(true);
    setStoryError("");
    setShowStory(false);

    const payload = {
      contents: [{ parts: [{ text: userInput }] }],
    };

    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": "AIzaSyCEASwO3A_P7CdnmJ7I2ts89Fuj7yajVUk",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      let generatedText = "";

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        generatedText = data.candidates[0].content.parts[0].text;
      } else if (data?.output?.[0]?.content?.[0]?.text) {
        generatedText = data.output[0].content[0].text;
      } else {
        generatedText = "No story generated.";
      }

      setStory(generatedText);
      setShowStory(true);
    } catch (err) {
      console.error(err);
      setStoryError("Failed to generate story. Try again!");
    } finally {
      setLoading(false);
    }
  };
  // ---------------- Image Generation using Nebuies API ----------------
  const generateImage = async () => {
    if (!story && !userInput)
      return alert("Generate a story or enter text first!");
    setImageError("");
    setImageUrl(null);

    try {
      const res = await fetch(
        "https://api.studio.nebius.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_NEBUIES_API_KEY}`, // ✅ Your Nebuies key
          },
          body: JSON.stringify({
            model: "black-forest-labs/flux-schnell",
            prompt: story || userInput, // 📝 use story if exists, else input
            width: 512,
            height: 512,
            num_inference_steps: 1,
            seed: -1,
            guidance_scale: 100,
            negative_prompt: "",
            response_extension: "webp",
            response_format: "url",
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      const data = await res.json();
      const imageUrl = data?.data?.[0]?.url;

      if (imageUrl) {
        setImageUrl(imageUrl); // ✅ Show in Image Card instead of banner
      } else {
        setImageError("No image URL returned from API.");
      }
    } catch (err) {
      console.error("Image generation failed:", err);
      setImageError("Failed to generate image.");
    }
  };

  // ---------------- Hume.ai Text-to-Speech ----------------

  const HUME_API_URL = "https://api.hume.ai/v0/tts"; // ✅ correct endpoint

  const generateAudio = async () => {
    if (!story) return alert("Generate a story first!");
    setAudioError("");
    setAudioUrl(null);

    try {
      console.log("Using API key:", process.env.REACT_APP_HUME_API_KEY);

      const res = await fetch("https://api.hume.ai/v0/tts", {
        method: "POST",
        headers: {
          "X-Hume-Api-Key": process.env.REACT_APP_HUME_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          utterances: [
            {
              text: story,
              voice: {
                name: "Male English Actor",
                provider: "HUME_AI",
              },
            },
          ],
          format: {
            type: "mp3",
          }, // If supported (verify in docs)
        }),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg);
      }

      const data = await res.json();
      const base64Audio = data.generations[0].audio;

      // convert base64 -> binary -> blob
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: "audio/mpeg" });

      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (err) {
      console.error(err);

      setAudioError("Failed to generate audio.");
    }
  };
  // ---------------- Video Generation using Veo 3 ----------------
  // ---------------- Video Generation using Veo 3 (via Pollo.ai) ----------------
  const generateVideo = async () => {
    if (!story && !userInput)
      return alert("Generate a story or enter text first!");

    setVideoError("");
    setVideoUrl(null);

    try {
      const res = await fetch(
        "https://pollo.ai/api/platform/generation/google/veo3",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_POLLO_API_KEY, // ✅ your Pollo.ai key
          },
          body: JSON.stringify({
            input: {
              prompt: story || userInput, // 📝 use story if available, else input
              negativePrompt: "",
              length: 8, // 🎬 seconds
              aspectRatio: "16:9",
              resolution: "720p",
              seed: 123,
              generateAudio: false, // set true if you also want auto audio
            },
            webhookUrl: "", // optional: you can set if you want async callback
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      const data = await res.json();
      console.log("Video Response:", data);

      // API might give you a job ID or a direct video URL
      // If direct URL:
      if (data?.output?.[0]?.url) {
        setVideoUrl(data.output[0].url);
      } else if (data?.id) {
        setVideoError("Video is being processed. Use job ID: " + data.id);
      } else {
        setVideoError("No video URL returned from API.");
      }
    } catch (err) {
      console.error("Video generation failed:", err);
      setVideoError("Failed to generate video.");
    }
  };

  /*--------------------------------------*/
  return (
    <div className="home-container">
      {" "}
      {/* ✅ Fixed invalid tag */}
      {/* Banner */}
      <header className="banner">
        <img src={currentImage} alt="Banner" className="banner-img" />
        <div className="banner-overlay">
          <div className="banner-text">
            <h1 className="brand-text">
              Katha<span> Sangam</span>
            </h1>
            <p className="subtitle"> ✨ AI-powered Mythology Storyteller ✨</p>
          </div>
        </div>
      </header>
      {/* Input Section */}
      <div className="input-section">
        <textarea
          placeholder="Enter a mythological theme or character..."
          className="story-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="button-group">
          <button
            className="btn btn-purple"
            onClick={generateStory}
            disabled={loading}
          >
            <FaBookOpen /> {loading ? "Generating..." : "Generate Story"}
          </button>
          <button
            className="btn btn-blue"
            onClick={() => {
              setShowImage(true);
              generateImage();
            }}
          >
            <FaImage /> Generate Image
          </button>
          <button
            className="btn btn-green"
            onClick={() => {
              setShowAudio(true);
              generateAudio();
            }}
          >
            <FaVolumeUp /> Generate Audio
          </button>

          <button
            className="btn btn-red"
            onClick={() => {
              setShowVideo(true);
              generateVideo();
            }}
          >
            <FaVideo /> Generate Video
          </button>
        </div>
      </div>
      {/* Output Section */}
      <h2 className="section-title">✨ Your Mythological Creations ✨</h2>
      <div className="card-grid">
        {showStory && (
          <div className="card">
            <h3>
              <FaBookOpen className="icon purple" /> Story
            </h3>

            <div
              className={`story-content ${
                story.split(" ").length > 100 ? "scrollable" : ""
              }`}
            >
              {story}
            </div>
            {storyError && <p className="error-inline">{storyError}</p>}
            <button
              className="btn btn-orange"
              onClick={() => speakStory(story)}
            >
              <FaVolumeUp /> {isReading ? "Stop Reading" : "Read Story"}
            </button>
          </div>
        )}

        {showImage && (
          <div className="card">
            <h3>
              <FaImage className="icon blue" /> Image
            </h3>
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Generated" className="generated-img" />
                <button
                  className="btn btn-orange"
                  onClick={async () => {
                    try {
                      const response = await fetch(imageUrl);
                      const blob = await response.blob();

                      // Convert blob → JPG using canvas
                      const img = document.createElement("img");
                      img.src = URL.createObjectURL(blob);
                      img.onload = () => {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);

                        canvas.toBlob(
                          (jpgBlob) => {
                            const url = URL.createObjectURL(jpgBlob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = "generated-image.jpg"; // Always JPG
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          },
                          "image/jpeg",
                          0.95
                        ); // Quality 95%
                      };
                    } catch (err) {
                      console.error("Download failed", err);
                    }
                  }}
                >
                  <FaDownload /> Download
                </button>
              </>
            ) : (
              <div className="placeholder">{imageError || "No image yet"}</div>
            )}
          </div>
        )}

        {showAudio && (
          <div className="card">
            <h3>
              <FaVolumeUp className="icon green" /> Audio
            </h3>
            {audioUrl ? (
              <>
                <audio controls src={audioUrl}></audio>
                <button
                  className="btn btn-orange"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = audioUrl;
                    link.download = "generated-audio.mp3"; // ✅ Force download
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(audioUrl);
                  }}
                >
                  <FaDownload /> Download
                </button>
              </>
            ) : (
              <div className="placeholder">{audioError || "No audio yet"}</div>
            )}
          </div>
        )}

        {showVideo && (
          <div className="card">
            <h3>
              <FaVideo className="icon red" /> Video
            </h3>
            {videoUrl ? (
              <>
                <video controls width="100%" src={videoUrl}></video>
                <button
                  className="btn btn-orange"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = videoUrl;
                    link.download = "generated-video.mp4"; // ✅ force download
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <FaDownload /> Download
                </button>
              </>
            ) : (
              <div className="placeholder">{videoError || "No video yet"}</div>
            )}
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 KathaSangam | Crafted with ❤️ for Mythology Lovers</p>
      </footer>
    </div>
  );
};

export default Home;
