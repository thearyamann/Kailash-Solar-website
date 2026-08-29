import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service and Conditions for Kailash Solar, the leading solar EPC in Meerut.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow pt-32 pb-24">
        <div className="container-custom max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black font-montserrat text-foreground mb-8 tracking-tight">Terms of Service</h1>
          
          <div className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-montserrat prose-headings:font-bold prose-a:text-primary">
            <p className="lead text-lg text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>

            <section className="space-y-6 text-muted-foreground">
              <h2 className="text-2xl text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using this website (kailashsolar.com) and our services, you accept and agree to be bound by the terms and provision of this agreement. Kailash Solar provides solar EPC services, rooftop solar installations, and PM Surya Ghar consultation in Meerut and Western UP subject to these terms.</p>

              <h2 className="text-2xl text-foreground mt-8 mb-4">2. Solar Installation Services</h2>
              <p>All solar installations, including residential and commercial projects, are subject to a formal contract and site assessment. The estimates provided by our online Solar Calculator are approximations and do not constitute a legally binding quote.</p>
              
              <h2 className="text-2xl text-foreground mt-8 mb-4">3. Government Subsidies</h2>
              <p>While Kailash Solar is an approved vendor for the PM Surya Ghar Yojana and UPNEDA, the final approval, disbursement, and timeline of any government subsidies are entirely at the discretion of the respective government bodies. We assist in the paperwork but cannot guarantee specific timelines for subsidy processing.</p>

              <h2 className="text-2xl text-foreground mt-8 mb-4">4. Intellectual Property</h2>
              <p>The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights. The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited.</p>

              <h2 className="text-2xl text-foreground mt-8 mb-4">5. Limitation of Liability</h2>
              <p>Kailash Solar shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if Kailash Solar has been advised of the possibility of such damages.</p>

              <h2 className="text-2xl text-foreground mt-8 mb-4">6. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of India. You irrevocably submit to the exclusive jurisdiction of the courts in Meerut, Uttar Pradesh, for the resolution of any disputes.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
