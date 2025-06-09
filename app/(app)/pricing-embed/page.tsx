import StripePricingTable from "@/components/pricing/stripe-pricing-table"

export default function PricingEmbedPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Choose Your Membership Plan</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Join the Green Mission community with our embedded pricing table. Select the plan that best fits your
          sustainable business needs.
        </p>
      </div>

      {/* Stripe Embedded Pricing Table */}
      <StripePricingTable className="max-w-6xl mx-auto" />

      <div className="text-center text-sm text-muted-foreground">
        <p>
          All plans include access to our sustainable business directory and community features.
          <br />
          Need help choosing?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact our team
          </a>
        </p>
      </div>
    </div>
  )
}
