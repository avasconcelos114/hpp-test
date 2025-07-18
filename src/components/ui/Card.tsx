import { cn } from '@/lib/utils/style';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col rounded-[10px] bg-white p-[25px]',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
