import { Facebook, Instagram, Youtube, Send, MapPin, Phone, Mail, Globe } from 'lucide-react';

const socialMedia = [
  { name: 'Facebook', icon: Facebook, username: 'PMR Wira Smkn Prbya', url: 'https://www.facebook.com/share/1FnbuMwaff/', color: '#1877f2' },
  { name: 'Instagram', icon: Instagram, username: 'laspraja_smkn1baya', url: 'https://www.instagram.com/laspraja_smkn1baya', color: '#e4405f' },
  { name: 'TikTok', icon: Send, username: 'PMR WIRA SMKN 1 PRINGGABAYA', url: 'https://www.tiktok.com/@pmrsmeksaofficial', color: '#000000' },
  { name: 'YouTube', icon: Youtube, username: 'PMR Wira Unit SMKN 1 Pringgabaya', url: 'https://www.youtube.com/@pmrwira.smkn1pringgabaya', color: '#ff0000' },
];

const KontakPage = () => {
  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Hubungi <span className="text-pmi">Kami</span></h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Ikuti media sosial kami atau hubungi kontak resmi PMR Wira SMKN 1 Pringgabaya
        </p>

        {/* Media Sosial */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span>📱</span> Media Sosial Resmi
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {socialMedia.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ backgroundColor: social.color }}
              >
                <social.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1">{social.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 break-all line-clamp-1">{social.username}</p>
              <p className="text-pmi text-sm mt-2 font-semibold">Kunjungi →</p>
            </a>
          ))}
        </div>

        {/* Info Sekolah & Maps */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-pmi" /> Alamat
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              SMKN 1 Pringgabaya<br />
              Jl. Raya Pringgabaya No. KM 5, Labuan Lombok,<br />
              Kec. Pringgabaya, Kab. Lombok Timur, NTB 83654
            </p>
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3947.123456789!2d116.56789!3d-8.45678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcdb123456789ab%3A0x123456789abcdef!2sSMKN%201%20Pringgabaya!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Maps SMKN 1 Pringgabaya"
              ></iframe>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Informasi Kontak</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Phone className="w-5 h-5 text-pmi mt-0.5" />
                <div>
                  <p className="font-semibold">WhatsApp Admin</p>
                  <p className="text-gray-600 dark:text-gray-400">+62 123 4567 890</p>
                  <a href="https://wa.me/621234567890" className="text-pmi text-sm hover:underline">Chat via WhatsApp →</a>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Mail className="w-5 h-5 text-pmi mt-0.5" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600 dark:text-gray-400">pmr@smkn1pringgabaya.sch.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <Globe className="w-5 h-5 text-pmi mt-0.5" />
                <div>
                  <p className="font-semibold">Website Sekolah</p>
                  <a href="https://smkn1pringgabaya.sch.id" className="text-pmi hover:underline">smkn1pringgabaya.sch.id</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KontakPage;