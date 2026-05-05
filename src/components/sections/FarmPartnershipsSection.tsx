export default function FarmPartnershipsSection() {
  const pillars = [
    {
      icon: "🌱",
      title: "Sustainable Productivity",
      body: "We partner with farmers who adopt sustainable farming methods that improve yields while protecting natural resources for future generations.",
    },
    {
      icon: "♻️",
      title: "Eco-Friendly Practices",
      body: "Our partner farms prioritise soil health, water conservation, and reduced chemical inputs — producing cleaner, safer food for consumers worldwide.",
    },
    {
      icon: "💰",
      title: "Fair Trade & Value Addition",
      body: "We ensure farmers receive fair prices for their produce and support value addition at source — keeping more of the economic benefit within local communities.",
    },
    {
      icon: "📚",
      title: "Training & Capacity",
      body: "Africom International Ltd invests in farmer training programmes covering good agricultural practices, post-harvest handling, and market access skills.",
    },
  ];

  return (
    <section className="section-padding bg-brand-green text-white">
      <div className="container-lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Farm Partnerships
          </h2>
          <p className="text-green-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Africom International Ltd is committed to building lasting relationships with
            Tanzanian farming communities — creating shared value through sustainable
            productivity, eco-friendly practices, and community empowerment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map(({ icon, title, body }) => (
            <div
              key={title}
              className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors"
            >
              <div className="text-3xl mb-4" aria-hidden="true">
                {icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{title}</h3>
              <p className="text-green-100 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
