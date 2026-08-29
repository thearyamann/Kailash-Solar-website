import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Kailash Solar. Learn how we protect your personal information and data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-32 pb-24">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black font-montserrat text-foreground mb-8 tracking-tight">Privacy Policy</h1>
          
          <div className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-montserrat prose-headings:font-bold prose-a:text-primary">
            <p className="lead text-lg text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>

            <section className="space-y-6 text-muted-foreground">
              <h2 className="text-2xl text-foreground mt-8 mb-4">1. Introduction</h2>
              <p>Welcome to Kailash Solar ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website (regardless of where you visit it from) or use our services, including solar panel installation, PM Surya Ghar subsidy processing, and related EPC services in Meerut and Western UP.</p>

              <h2 className="text-2xl text-foreground mt-8 mb-4">2. The Data We Collect About You</h2>
              <p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes billing address, installation address, email address, and telephone numbers.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data:</strong> includes information about how you use our website, products, and services.</li>
              </ul>

              <h2 className="text-2xl text-foreground mt-8 mb-4">3. How We Use Your Personal Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>To provide accurate solar quotations and site assessments.</li>
                <li>To process and manage your PM Surya Ghar subsidy applications.</li>
                <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
                <li>To administer and protect our business and this website.</li>
              </ul>

              <h2 className="text-2xl text-foreground mt-8 mb-4">4. Data Security</h2>
              <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.</p>

              <h2 className="text-2xl text-foreground mt-8 mb-4">5. Contact Details</h2>
              <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
              <div className="bg-muted/50 p-6 rounded-xl mt-4 border border-border">
                <p className="font-bold text-foreground">Kailash Solar</p>
                <p>62, Sec 3, Industrial Area, Shatabdi Nagar</p>
                <p>Meerut, Uttar Pradesh - 250103</p>
                <p className="mt-2">Email: <a href="mailto:sales@kailashsolar.com" className="text-primary hover:underline">sales@kailashsolar.com</a></p>
                <p>Phone: <a href="tel:+918999999654" className="text-primary hover:underline">+91 8999999654</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
