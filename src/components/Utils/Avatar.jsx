export default function Avatar ({path}) {
    return (
        <>
            <div>
                <img src={path} alt="avatar" className="w-10 h-10 rounded-full" />
            </div>
        </>
    )
}