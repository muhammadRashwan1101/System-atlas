export default function HeroSection() {
  return (
    <>
    <div className="flex flex-col items-center justify-center text-white text-center gap-6 mx-auto py-20 px-5 border-b border-(--secondary)">
        <div className="flex flex-col items-center justify-center text-center gap-4">
            <h2 className="text-6xl font-bold font-(family-name:--headlines)" >System Atlas: Map Your Architecture,</h2>
            <span className="text-6xl font-bold font-(family-name:--headlines) text-[#ADC6FF]"> Master Your Complexity.</span>
        </div>
        <p className="max-w-[80ch] text-(--text)">The source of truth for your microservices, dependencies, and infrastructure topology. Real-time observability meets deep architectural insight.</p>
        <div className="flex items-center justify-center gap-6">
                <button className="btn bg-[#ADC6FF] text-(--text-primary) hover:bg-[#ADC6FF]/90 px-6 py-[0.8rem] rounded-md font-(family-name:--headlines) text-lg font-extrabold">Get Started</button>
            <button className="btn bg-transparent border-2 border-gray-300 text-gray-300 hover:bg-white/5 px-6 py-3 rounded-md font-(family-name:--headlines) text-lg font-light">View Documentation</button>
        </div>
    </div>
    </>

  )
}
