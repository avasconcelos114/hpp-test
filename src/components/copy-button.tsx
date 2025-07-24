import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const COPY_RESET_TIME = 2000;

export function CopyButton({ text, testId }: { text: string; testId: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, COPY_RESET_TIME);
    }
  }, [isCopied]);

  return (
    <Button
      variant='ghost'
      onClick={handleCopy}
      className='text-bvnk-primary h-[22px] p-0'
      data-testid={`copy-button-${testId}`}
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </Button>
  );
}
