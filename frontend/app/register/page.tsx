import { RegistrationForm } from "@/components/RegistrationForm"
import { Header } from "@/components/Header"

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Register Your Website</h1>
          <p className="text-foreground/80">Set up your website to earn from AI crawler access</p>
        </div>
        <RegistrationForm />
      </div>
    </main>
  )
}
