import { MobileAiAssistant } from '@/components/features/aiAssistant/mobile';
import { useNavigate } from 'react-router-dom';

export function AiAssistantMobile() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return <MobileAiAssistant onClose={handleClose} />;
}

