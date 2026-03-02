// pages/ContactPage.jsx
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Facebook,
  Youtube,
  Instagram,
  MessageSquare,
  Send,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("আপনার বার্তা পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            আমাদের সাথে যোগাযোগ করুন
            <div className="text-lg font-normal text-gray-500 mt-2">
              Contact Us
            </div>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            যেকোনো সমস্যা বা জিজ্ঞাসার জন্য আমরা সবসময় প্রস্তুত আছি। আমাদের সাথে
            সরাসরি যোগাযোগ করুন।
            <div className="text-sm text-gray-500 mt-2">
              We are always ready to help you with any problem or query. Contact
              us directly.
            </div>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Basic Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                যোগাযোগের তথ্য
                <div className="text-base font-normal text-gray-500">
                  Contact Information
                </div>
              </h2>

              <div className="space-y-4">
                <ContactItem
                  icon={<Phone className="text-green-500" size={24} />}
                  title="ফোন নম্বর"
                  subtitle="Phone Number"
                  details={["+880 1833-620248", "+880 1969-123456"]}
                  link="tel:+8801833620248"
                />

                <ContactItem
                  icon={<Mail className="text-blue-500" size={24} />}
                  title="ইমেইল ঠিকানা"
                  subtitle="Email Address"
                  details={["support@mannanstore.com", "info@mannanstore.com"]}
                  link="mailto:support@mannanstore.com"
                />

                <ContactItem
                  icon={<MapPin className="text-red-500" size={24} />}
                  title="অফিস ঠিকানা"
                  subtitle="Office Address"
                  details={[
                    "বাণিজ্যিক এলাকা, শম্ভুগঞ্জ",
                    "ময়মনসিংহ, বাংলাদেশ",
                  ]}
                  english={[
                    "Commercial Area, Shambhugonj",
                    "Mymensingh, Bangladesh",
                  ]}
                />

                <ContactItem
                  icon={<Clock className="text-purple-500" size={24} />}
                  title="কার্যকাল"
                  subtitle="Business Hours"
                  details={[
                    "শনিবার - বৃহস্পতিবার: সকাল ৯টা - রাত ১০টা",
                    "শুক্রবার: বন্ধ",
                  ]}
                  english={[
                    "Saturday - Thursday: 9AM - 10PM",
                    "Friday: Closed",
                  ]}
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                সোশ্যাল মিডিয়া
                <div className="text-base font-normal text-gray-500">
                  Social Media
                </div>
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <SocialCard
                  icon={<Facebook className="text-blue-600" size={24} />}
                  platform="ফেসবুক পেজ"
                  english="Facebook Page"
                  handle="@MannanStoreBD"
                  link="https://facebook.com/MannanStoreBD"
                  color="bg-blue-50 hover:bg-blue-100"
                />

                <SocialCard
                  icon={<Youtube className="text-red-600" size={24} />}
                  platform="ইউটিউব চ্যানেল"
                  english="YouTube Channel"
                  handle="Mannan Store"
                  link="https://youtube.com/@MannanStore"
                  color="bg-red-50 hover:bg-red-100"
                />

                <SocialCard
                  icon={<Instagram className="text-pink-600" size={24} />}
                  platform="ইনস্টাগ্রাম"
                  english="Instagram"
                  handle="@mannanstore.bd"
                  link="https://instagram.com/mannanstore.bd"
                  color="bg-pink-50 hover:bg-pink-100"
                />

                <SocialCard
                  icon={<MessageSquare className="text-green-600" size={24} />}
                  platform="হোয়াটসঅ্যাপ"
                  english="WhatsApp"
                  handle="+8801833620248"
                  link="https://wa.me/8801833620248"
                  color="bg-green-50 hover:bg-green-100"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">
                জরুরি যোগাযোগ
                <div className="text-sm font-normal text-red-100">
                  Emergency Contact
                </div>
              </h3>
              <p className="mb-4">
                কোনো জরুরি সমস্যার জন্য সরাসরি কল করুন।
                <div className="text-red-100 text-sm">
                  Call directly for any emergency issue.
                </div>
              </p>
              <div className="flex items-center gap-2">
                <Phone size={20} />
                <span className="font-bold text-lg">+880 1833-620248</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              বার্তা পাঠান
              <div className="text-base font-normal text-gray-500">
                Send us a Message
              </div>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    আপনার নাম
                    <div className="text-xs text-gray-500">Your Name</div>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="আপনার পুরো নাম লিখুন"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ইমেইল ঠিকানা
                    <div className="text-xs text-gray-500">Email Address</div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ফোন নম্বর
                    <div className="text-xs text-gray-500">Phone Number</div>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    বিষয়
                    <div className="text-xs text-gray-500">Subject</div>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="বার্তার বিষয়"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  আপনার বার্তা
                  <div className="text-xs text-gray-500">Your Message</div>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="আপনার বার্তা বা জিজ্ঞাসা এখানে লিখুন..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
              >
                <Send size={20} />
                বার্তা পাঠান
                <div className="text-sm font-normal text-blue-200">
                  Send Message
                </div>
              </button>
            </form>

            {/* Quick Response Info */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800">
                <MessageCircle size={20} />
                <span className="font-semibold">দ্রুত প্রতিক্রিয়া</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                আমরা 24 ঘন্টার মধ্যে আপনার বার্তার উত্তর দেব।
                <div className="text-green-600 text-xs">
                  We will reply to your message within 24 hours.
                </div>
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            আমাদের অবস্থান
            <div className="text-base font-normal text-gray-500">
              Our Location
            </div>
          </h2>

          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin size={48} className="mx-auto mb-2 text-red-500" />
              <p className="font-semibold">মান্নান স্টোর - শম্ভুগঞ্জ</p>
              <p className="text-sm">Mannan Store - Shambhugonj</p>
              <div className="text-xs text-gray-500 mt-2">
                Google Maps integration
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Item Component
const ContactItem = ({ icon, title, subtitle, details, english, link }) => {
  return (
    <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">
          {title}
          <div className="text-sm font-normal text-gray-500">{subtitle}</div>
        </h3>
        {details.map((detail, index) => (
          <div key={index}>
            {link ? (
              <a
                href={link}
                className="text-blue-600 hover:text-blue-800 hover:underline block"
              >
                {detail}
              </a>
            ) : (
              <p className="text-gray-700">{detail}</p>
            )}
            {english && english[index] && (
              <div className="text-xs text-gray-500">{english[index]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Social Card Component
const SocialCard = ({ icon, platform, english, handle, link, color }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${color} p-4 rounded-lg border transition-all duration-300 hover:shadow-md text-center`}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="font-semibold text-gray-900 text-sm">{platform}</div>
      <div className="text-xs text-gray-500 mb-1">{english}</div>
      <div className="text-blue-600 font-medium text-sm">{handle}</div>
    </a>
  );
};

export default ContactPage;
