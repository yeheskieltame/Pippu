export function BorrowTerms() {
  const terms = [
    {
      title: "Collateral Required",
      description: "You must pledge assets as collateral to borrow",
      icon: "🔒",
    },
    {
      title: "70% LTV Maximum",
      description: "Borrow up to 70% of your collateral value",
      icon: "📊",
    },
    {
      title: "Fixed Interest Rate",
      description: "Your rate is locked for the entire loan term",
      icon: "📌",
    },
    {
      title: "Liquidation Protection",
      description: "Get alerts before liquidation occurs",
      icon: "⚠️",
    },
  ]

  return (
    <div className="animate-bounce-in" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-2xl text-heading mb-4">How Borrowing Works</h3>
      <div className="grid grid-cols-2 gap-3">
        {terms.map((term, idx) => (
          <div key={idx} className="card-glass p-4">
            <p className="text-2xl mb-2">{term.icon}</p>
            <p
              className="text-sm font-semibold mb-1"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {term.title}
            </p>
            <p
              className="text-xs text-neutral-600"
              style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
            >
              {term.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
