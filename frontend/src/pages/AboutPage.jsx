// pages/AboutPage.jsx
import {
  Award,
  Shield,
  Truck,
  Users,
  Heart,
  Star,
  ShoppingBag,
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              ইফতিয়ার স্টোর সম্পর্কে
              <div className="text-sm md:text-base font-normal text-gray-500 mt-2">
                About Iftear Store
              </div>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              বাংলাদেশের বিশ্বস্ত ও নির্ভরযোগ্য অনলাইন প্ল্যাটফর্ম। আমরা
              উচ্চমানের পণ্য এবং সেরা সেবা নিশ্চিত করি।
              <div className="text-sm text-gray-500 mt-2">
                Bangladesh's most trusted and reliable online platform. We
                provide high quality products and ensure best service.
              </div>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Award className="text-yellow-500" size={48} />}
              title="গুণগত মান"
              subtitle="Quality Products"
              description="সব পণ্য 100% অরিজিনাল এবং উচ্চমানের। আমরা কখনও গুণগত মানে কম্প্রোমাইজ করি না।"
              english="All products are 100% original and high quality. We never compromise on quality."
            />
            <FeatureCard
              icon={<Shield className="text-green-500" size={48} />}
              title="বিশ্বস্ততা"
              subtitle="Trust & Reliability"
              description="১০০% সুরক্ষিত এবং বিশ্বস্ত সার্ভিস প্ল্যাটফর্ম। আপনার তথ্য সম্পূর্ণ সুরক্ষিত।"
              english="100% secure and reliable service platform. Your information is completely secure."
            />
            <FeatureCard
              icon={<Truck className="text-blue-500" size={48} />}
              title="দ্রুত ডেলিভারি"
              subtitle="Fast Delivery"
              description="সারা বাংলাদেশে ২৪-৭২ ঘন্টার মধ্যে দ্রুত ডেলিভারি।"
              english="Fast delivery within 24-72 hours across Bangladesh. We deliver everywhere."
            />
            <FeatureCard
              icon={<Users className="text-purple-500" size={48} />}
              title="২৪/৭ সাপোর্ট"
              subtitle="24/7 Support"
              description="আমাদের কাস্টমার কেয়ার টিম ২৪/৭ সাপোর্ট প্রদান করে। যেকোনো সময় যোগাযোগ করুন।"
              english="Our customer care team provides 24/7 service. Contact us anytime."
            />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                আমাদের গল্প
                <div className="text-lg font-normal text-gray-500 mt-2">
                  Our Story
                </div>
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  ইফতিয়ার স্টোর শুরু হয়েছিল ২০২০ সালে একটি ছোট্ট আইডিয়া থেকে।
                  আমাদের স্বপ্ন ছিল এমন একটি প্ল্যাটফর্ম তৈরি করা যেখানে সবাই
                  সহজে কেনাকাটা করতে পারে।
                </p>
                <p className="text-lg">
                  আজ, আমরা বাংলাদেশের অন্যতম সেরা ই-কমার্স প্ল্যাটফর্ম। আমাদের
                  রয়েছে ১০,০০০+ সন্তুষ্ট গ্রাহক এবং ৫০০+ উচ্চমানের পণ্য।
                </p>
                <p className="text-lg">
                  আমাদের লক্ষ্য হলো প্রতিটি বাংলাদেশীর দোরগোড়ায় সহজ এবং
                  সাশ্রয়ী মূল্যে গুণগত মানের পণ্য পৌঁছে দেওয়া।
                </p>
                <div className="text-sm text-gray-500 space-y-2 mt-4">
                  <div>
                    Iftear Store started in 2020 from a small idea. Our dream
                    was to create a platform where everyone can shop easily.
                  </div>
                  <div>
                    Today, we are one of the best e-commerce platforms in
                    Bangladesh. We have over 10,000 happy customers and 500+
                    quality products.
                  </div>
                  <div>
                    Our goal is to deliver quality products to every
                    Bangladeshi's doorstep easily and affordably.
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                number="10,000+"
                label="সন্তুষ্ট গ্রাহক"
                english="Happy Customers"
              />
              <StatCard
                number="500+"
                label="গুণগত পণ্য"
                english="Quality Products"
              />
              <StatCard
                number="5+"
                label="জেলায় সার্ভিস"
                english="Districts Served"
              />
              <StatCard
                number="99%"
                label="সন্তুষ্টি হার"
                english="Satisfaction Rate"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            আমাদের মূল্যবোধ
            <div className="text-lg font-normal text-gray-500 mt-2">
              Our Values
            </div>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Heart className="text-red-500" size={32} />}
              title="গ্রাহক সন্তুষ্টি"
              subtitle="Customer Satisfaction"
              description="আমাদের প্রধান অগ্রাধিকার হলো গ্রাহকের সন্তুষ্টি। আমরা সর্বোচ্চ চেষ্টা করি প্রতিটি গ্রাহককে খুশি রাখতে।"
              english="Our top priority is customer satisfaction. We try our best to keep every customer happy."
            />
            <ValueCard
              icon={<Star className="text-yellow-500" size={32} />}
              title="গুণগত মান"
              subtitle="Quality Excellence"
              description="প্রতিটি পণ্য কঠোর গুণগত মান পরীক্ষার মাধ্যমে যায়। আমরা শুধুমাত্র সেরা মানের পণ্য সরবরাহ করি।"
              english="Every product goes through rigorous quality checks. We only provide the best product quality."
            />
            <ValueCard
              icon={<ShoppingBag className="text-green-500" size={32} />}
              title="সহজ শপিং"
              subtitle="Easy Shopping"
              description="সহজ এবং ব্যবহারবান্ধব ইন্টারফেস যেখানে যে কেউ ঝামেলা ছাড়াই কেনাকাটা করতে পারে।"
              english="Simple and user-friendly interface so anyone can shop easily without any hassle."
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            আমাদের মিশন
            <div className="text-lg font-normal text-blue-200 mt-2">
              Our Mission
            </div>
          </h2>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            "বাংলাদেশের প্রতিটি পরিবারের দোরগোড়ায় পৌঁছে দেওয়া সাশ্রয়ী এবং
            গুণগত মানের পণ্য, যাতে সবার জন্য একটি সহজ শপিং অভিজ্ঞতা তৈরি হয়।"
          </p>
          <div className="text-blue-200 text-lg mt-4">
            "To deliver affordable and quality products to every household in
            Bangladesh, creating a seamless shopping experience for all."
          </div>
        </div>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, subtitle, description, english }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {title}
        <div className="text-sm font-normal text-gray-500">{subtitle}</div>
      </h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
        {english}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ number, label, english }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
      <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
        {number}
      </div>
      <div className="font-semibold text-gray-800">{label}</div>
      <div className="text-sm text-gray-500 mt-1">{english}</div>
    </div>
  );
};

// Value Card Component
const ValueCard = ({ icon, title, subtitle, description, english }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      <p className="text-gray-600 mb-2">{description}</p>
      <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
        {english}
      </div>
    </div>
  );
};

export default AboutPage;
