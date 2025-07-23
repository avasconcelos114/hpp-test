import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const COPY_RESET_TIME = 2000;

export function CopyButton({ text }: { text: string }) {
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
      size='sm'
      onClick={handleCopy}
      className='text-bvnk-primary p-0'
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </Button>
  );
}
