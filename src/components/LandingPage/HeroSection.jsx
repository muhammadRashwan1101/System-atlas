import {FaRegCirclePlay} from 'react-icons/fa6';
export default function HeroSection() {
  return (
    <>
    <div className="flex flex-col items-center justify-center text-white text-center gap-15 mx-auto max-w-[80ch] py-20 px-5 border-b border-(--secondary)">
        <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-6xl font-bold font-(family-name:--headlines) leading-18" >Visualize Services. <span className="text-6xl font-bold font-(family-name:--headlines) bg-[linear-gradient(90deg,#ADC6FF,#ADC6FF80,#ADC6FF70,#ADC6FF)] text-transparent bg-clip-text"> Understand Dependencies.</span> Predict Impact.</h2>
            
        </div>
        <p className="max-w-[60ch] text-(--text)">The intelligence layer for your cloud infrastructure. Map relationships between every service, API, and database to eliminate architectural blind spots.</p>
        <div className="flex items-center justify-center gap-6">
                <button className="btn bg-white text-(--neutral) hover:bg-white/80 px-6 py-[1.1rem] rounded-md font-(family-name:--body-font) text-md font-semibold transition-all duration-200">Start Mapping Free</button>
            <button className="btn bg-[#18181B] flex gap-3 items-center border border-[#27272A] text-gray-300 hover:bg-white/8 px-6 py-[0.8rem] rounded-md font-(family-name:--headlines) text-lg font-light transition-all duration-200"><FaRegCirclePlay />Interactive Demo</button>
        </div>
    </div>
    </>

  )
}
