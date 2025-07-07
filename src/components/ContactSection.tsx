
import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactSectionProps {
  siteSettings?: Record<string, string>;
}

const ContactSection = ({ siteSettings }: ContactSectionProps) => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600">Visit us at our locations or get in touch today!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sassy Hair Pearce */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Sassy Hair Pearce</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-pink-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Address</h4>
                  <p className="text-gray-600">Unit 3A, 70 Hodgson Crescent</p>
                  <p className="text-gray-600">Pearce ACT 2607</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-pink-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Hours</h4>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday: 9AM - 5PM</p>
                    <p>Tuesday - Thursday: 9AM - Late</p>
                    <p>Friday: 9AM - 5PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Sassy Collective Weston */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">The Sassy Collective Weston</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-pink-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Address</h4>
                  <p className="text-gray-600">Unit 20, 41-43 Liardet Street</p>
                  <p className="text-gray-600">Weston ACT 2611</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-pink-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Hours</h4>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday: 9AM - 5PM</p>
                    <p>Tuesday - Thursday: 9AM - Late</p>
                    <p>Friday: 9AM - 5PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Contact</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="text-pink-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Phone</h4>
                  <p className="text-gray-600">02 6288 9922</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-pink-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-600">appointments@sassyhair.com.au</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
