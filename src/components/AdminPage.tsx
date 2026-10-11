import React, { useState, useEffect } from "react";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("Mr. & Mrs.");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const getDisplayName = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return "";
    
    if (prefix === "Family") {
      return `${trimmedName} and Family`;
    } else if (prefix === "None") {
      return trimmedName;
    } else {
      return `${prefix} ${trimmedName}`;
    }
  };

  const generateLink = () => {
    const fullName = getDisplayName();
    const urlSafeName = fullName.replace(/\s+/g, "_");
    const params = new URLSearchParams({ to: urlSafeName });
    const link = `${baseUrl}?${params.toString()}`;
    setGeneratedLink(link);
    setCopiedLink(false);
    setCopiedMessage(false);
  };

  const copyLinkOnly = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getMessageText = () => {
    return `Some moments in life are simply too special to celebrate without the people who hold a special place in our hearts. As we get ready to begin this beautiful new chapter together, we would love to have you by our side to share the happiness, love, and memories of our wedding day. 🥹❤️

We’ve put together our wedding invitation with all the details of our special day, and we would love for you to take a look at it through the link below. ✨💌

It would mean so much to us to have you there, celebrating with us as we begin our forever. ❤️

Please view our wedding invitation and all the event details through the link below 🌐:

${generatedLink}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With all our love,
Vikum & Shammi ♾️🤍`;
  };

  const copyFullMessage = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(getMessageText());
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center font-montserrat p-4">
      <div className="max-w-xl w-full bg-white border border-[#d4af37]/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-[#4e342e] uppercase tracking-widest mb-2">
            Admin Panel
          </h1>
          <p className="text-[#8d6e63] text-xs uppercase tracking-widest font-bold">
            Wedding Invitation Link Generator
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-[#4e342e] uppercase tracking-widest mb-2 block">
              Prefix
            </label>
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full bg-transparent border-b-2 border-[#8d6e63]/20 py-3 text-[#4e342e] focus:outline-none focus:border-[#d4af37] transition-all font-serif text-lg italic"
            >
              <option>Mr.</option>
              <option>Mrs.</option>
              <option>Miss</option>
              <option>Mr. & Mrs.</option>
              <option>Family</option>
              <option>Dear</option>
              <option>None</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#4e342e] uppercase tracking-widest mb-2 block mt-6">
              Guest Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sanjaya"
              className="w-full bg-transparent border-b-2 border-[#8d6e63]/20 py-3 text-[#4e342e] focus:outline-none focus:border-[#d4af37] transition-all font-serif text-lg italic placeholder:text-slate-300"
            />
          </div>

          <div className="pt-8">
            <button
              onClick={generateLink}
              disabled={!name.trim()}
              className="w-full bg-[#4e342e] text-white py-4 rounded-xl font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-[#3e2723] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              Generate Link
            </button>
          </div>

          {generatedLink && (
            <div className="mt-8 p-6 bg-[#fcfcf0] rounded-2xl border border-[#d4af37]/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-[10px] font-bold text-[#4e342e] uppercase tracking-widest mb-3">
                Generated Link:
              </p>
              <p className="text-sm text-[#8d6e63] break-all font-mono mb-6 bg-white p-3 rounded-lg border border-[#8d6e63]/10">
                {generatedLink}
              </p>
              
              <p className="text-[10px] font-bold text-[#4e342e] uppercase tracking-widest mt-6 mb-3">
                Generated Message:
              </p>
              <pre className="text-sm text-[#8d6e63] whitespace-pre-wrap font-sans mb-6 bg-white p-4 rounded-lg border border-[#8d6e63]/10 leading-relaxed shadow-inner">
                {getMessageText()}
              </pre>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={copyLinkOnly}
                  className="flex-1 bg-white border border-[#d4af37] text-[#4e342e] py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-[#fcfcf0] transition-all flex items-center justify-center gap-2"
                >
                  {copiedLink ? "Copied!" : "Copy Link Only"}
                </button>
                <button
                  onClick={copyFullMessage}
                  className="flex-1 bg-[#d4af37] text-white py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-[#c5a059] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {copiedMessage ? "Copied!" : "Copy Full Message"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
