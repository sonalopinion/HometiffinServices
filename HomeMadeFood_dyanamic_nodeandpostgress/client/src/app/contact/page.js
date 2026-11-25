import ContactForm from "@/components/ContactForm";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function ContactUs() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">
            Contact Us
          </h2>

          <p className="text-gray-600 mt-3">
            We'd love to hear from you. Send us your enquiry or place your order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-xl shadow-lg">

            <h3 className="text-2xl font-bold mb-6">
              Get In Touch
            </h3>

            <div className="space-y-6">

              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-orange-500 text-2xl" />
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-gray-600">
                    Mumbai, Maharashtra, India
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-orange-500 text-2xl" />
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p className="text-gray-600">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FaEnvelope className="text-orange-500 text-2xl" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-gray-600">
                    info@homemadefood.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <FaClock className="text-orange-500 text-2xl" />
                <div>
                  <h4 className="font-semibold">Working Hours</h4>
                  <p className="text-gray-600">
                    Mon - Sun : 8:00 AM - 9:00 PM
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">

            <h3 className="text-2xl font-bold mb-6">
              Send an Enquiry
            </h3>

            <ContactForm />

          </div>

        </div>

      </div>
    </section>
  );
}