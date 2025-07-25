import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const COPY_RESET_TIME = 5000;

export function CopyButton({
  text,
  testId,
  ariaLabel,
}: {
  text: string;
  testId: string;
  ariaLabel: string;
}) {
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
      aria-label={ariaLabel}
      aria-pressed={isCopied}
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </Button>
  );
}
