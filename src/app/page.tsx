import type { Metadata } from "next"
import InvoiceGenerator from "@/components/invoice-generator"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "InvoicePro - Indian Invoice Generator",
  description: "Generate professional invoices for the Indian market with HSN codes and tax options",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              Features
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              Pricing
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              Templates
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              Support
            </a>
          </nav>
          <div className="hidden md:block">
            <a href="#" className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 font-medium mr-2">
              Sign In
            </a>
            <a href="#" className="px-4 py-2 rounded-md bg-emerald-600 text-white font-medium">
              Get Started
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Generate Professional Invoices for Indian Businesses
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create GST-compliant invoices with HSN codes and tax calculations in seconds. No signup required.
            </p>
          </div>

          <InvoiceGenerator />
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Logo />
              <p className="text-gray-600 mt-4 max-w-md">
                InvoicePro helps Indian businesses create professional invoices with proper tax calculations and HSN
                codes.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      Templates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      GST Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      HSN Codes
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>© {new Date().getFullYear()} InvoicePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
