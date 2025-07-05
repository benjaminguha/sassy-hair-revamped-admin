
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
          <p className="text-xl text-gray-600">Ready to transform your look? Contact us today!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="text-pink-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-600">
                  {siteSettings?.address || "123 Beauty Lane, Style City, SC 12345"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="text-pink-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">
                  {siteSettings?.contact_phone || "+1 (555) 123-4567"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="text-pink-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">
                  {siteSettings?.contact_email || "info@sassyhair.com"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="text-pink-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hours</h3>
                <p className="text-gray-600">
                  {siteSettings?.hours || "Mon-Fri: 9AM-7PM, Sat: 8AM-6PM, Sun: 10AM-4PM"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Book an Appointment</h3>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                />
              </div>
              <div>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent">
                  <option>Select Service</option>
                  <option>Hair Cut & Style</option>
                  <option>Hair Coloring</option>
                  <option>Hair Treatment</option>
                  <option>Special Occasions</option>
                </select>
              </div>
              <div>
                <textarea
                  rows={4}
                  placeholder="Additional Notes"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
