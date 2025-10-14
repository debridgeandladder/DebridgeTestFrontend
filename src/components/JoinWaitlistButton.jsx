import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export const JoinWaitlistButton = ({ children, className = '', ...props }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#waitlist');
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`!px-14 !rounded-full hover:border-4 py-8 text-lg font-medium bg-gradient-to-r border-white from-[#22C55E] to-[#22C55E] hover:to-[#16A34A] text-white hover:shadow-lg hover:shadow-[#22C55E]/30 transition-all duration-300 transform hover:-translate-y-0.5 ${className}`}
    
      {...props}
    >
      {children || 'Join Waitlist'}
    </Button>
  );
};

export default JoinWaitlistButton;
