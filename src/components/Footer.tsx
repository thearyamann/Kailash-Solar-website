import { Phone, Mail, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";
import logo from "@/assets/kailash-logo.png";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <img src={logo.src} alt="Kailash Solar - Top Solar Panel Installers in Meerut UP" loading="lazy" className="h-16 w-auto mb-6 bg-primary-foreground rounded-lg p-2" />
            <p className="text-primary-foreground/90 mb-4 leading-relaxed">
              Solar EPC for homes, businesses, and industries. Serving Meerut and Western UP — PM Surya Ghar & UPNEDA empanelled vendor.
            </p>
            <p className="text-xs text-accent font-semibold mb-6 uppercase tracking-wide">
              PMSGY Approved · UPNEDA Empanelled · MNRE Compliant
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/kailashsolarpvtltd/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/kailash.solar/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/kailashsolar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {[
                { label: "Residential Solar", href: "/solar-company-meerut" },
                { label: "Commercial & Industrial EPC", href: "/solar-company-meerut" },
                { label: "PM Surya Ghar Subsidy", href: "/blog/pm-surya-ghar-subsidy-meerut" },
                { label: "Rooftop Solar", href: "/solar-company-meerut" },
                { label: "Net Metering", href: "/blog/pm-surya-ghar-subsidy-meerut" },
                { label: "Solar Financing", href: "/quote" },
              ].map((service) => (
                <li key={service.label}>
                  <Link href={service.href} className="text-primary-foreground/90 hover:text-accent transition-colors">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Solar Calculator", href: "/quote" },
                { label: "Solar Guides", href: "/blog/pm-surya-ghar-subsidy-meerut" },
                { label: "Book a Site Visit", href: "/book-visit" },
                { label: "Contact Us", href: "/book-visit" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-primary-foreground/90 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <span className="text-primary-foreground/90">
                  62, Sec 3, Industrial Area, Shatabdi Nagar Meerut, Uttar Pradesh - 250103
                  <br />
                  Meerut, Uttar Pradesh - 250001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a href="tel:+918999999654" className="text-accent font-bold hover:opacity-80 transition-opacity">
                  8-999-999-654
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href="mailto:sales@kailashsolar.com"
                  className="text-primary-foreground/90 hover:text-accent transition-colors"
                >
                  sales@kailashsolar.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom pt-6 pb-24 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/90 text-sm text-center md:text-left">© {currentYear} Kailash Solar. All rights reserved.</p>
          <div className="flex gap-6 text-sm justify-center">
            <Link href="/privacy" className="text-primary-foreground/90 hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary-foreground/90 hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
