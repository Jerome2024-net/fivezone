"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function ProCheckoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

      if (!res.ok) {
        // If not logged in, redirect to login
        if (res.status === 401) {
          router.push("/login?redirect=/pricing&message=login_to_subscribe")
          return
        }
        // If no business profile, redirect to register
        if (res.status === 400 && data.message?.includes("freelancer profile")) {
          router.push("/register?plan=pro")
          return
        }
        throw new Error(data.message || "Something went wrong")
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Redirecting to checkout...
          </>
        ) : (
          <>
            Upgrade to Pro
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  )
}
