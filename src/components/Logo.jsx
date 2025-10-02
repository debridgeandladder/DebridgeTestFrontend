import debridgeLogo from '/logo.png'

const Logo = ({ className = "h-24 w-auto", showText = true, showIcon = true, textClassName = "text-3xl font-bold text-gray-900" }) => {
  return (
    <div className="flex items-center space-x-4">
      {showIcon && <img src={debridgeLogo} alt="BridgeX Logo" className={className} />}
      {showText && <div className={textClassName}>BridgeX</div>}
    </div>
  )
}

export default Logo
