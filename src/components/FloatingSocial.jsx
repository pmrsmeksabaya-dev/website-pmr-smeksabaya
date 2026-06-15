import { MessageCircle, Instagram, Facebook, Youtube, Send } from 'lucide-react';

const FloatingSocial = () => {
  return (
    <div className="fixed bottom-20 left-4 md:left-6 z-40 flex flex-col gap-2">
      <a href="https://wa.me/621234567890" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition">
        <MessageCircle size={20} />
      </a>
      <a href="https://www.instagram.com/laspraja_smkn1baya" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[#f09433] to-[#bc1888] text-white p-3 rounded-full shadow-lg hover:scale-110 transition">
        <Instagram size={20} />
      </a>
      <a href="https://www.facebook.com/share/1FnbuMwaff/" target="_blank" rel="noopener noreferrer" className="bg-[#1877f2] text-white p-3 rounded-full shadow-lg hover:scale-110 transition">
        <Facebook size={20} />
      </a>
      <a href="https://www.tiktok.com/@pmrsmeksaofficial" target="_blank" rel="noopener noreferrer" className="bg-black text-white p-3 rounded-full shadow-lg hover:scale-110 transition">
        <Send size={20} />
      </a>
      <a href="https://www.youtube.com/@pmrwira.smkn1pringgabaya" target="_blank" rel="noopener noreferrer" className="bg-[#ff0000] text-white p-3 rounded-full shadow-lg hover:scale-110 transition">
        <Youtube size={20} />
      </a>
    </div>
  );
};

export default FloatingSocial;