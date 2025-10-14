import debridgeLogo from '/logo.png'

const Logo = ({ className = "h-24 w-auto", showText = true, showIcon = true, textClassName = "text-3xl font-bold text-gray-900" }) => {
  return (
    <div className="flex items-center space-x-4">
      {showIcon && (
        <div className={`overflow-hidden ${className} bg-white  w-[60px] h-[60px] rounded-full`}>
            <img
              src={debridgeLogo}
              alt="BridgeX Logo"
              className="mt-[4px] w-full h-full object-cover"
            />
        </div>
      )}
      {showText && <div className={`text-white ${textClassName}`}>BridgeX</div>}
    </div>
  )
}

export default Logo
